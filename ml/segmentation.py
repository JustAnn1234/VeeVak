import pandas as pd
import numpy as np
from datetime import date, timedelta


def get_customer_transactions(shop_id: int, conn) -> pd.DataFrame:
    """Pull all sales grouped by customer for RFM analysis."""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            customer_name,
            COUNT(*) as frequency,
            SUM(order_total) as monetary,
            MAX(sale_date) as last_purchase
        FROM sales
        WHERE shop_id = ?
            AND order_status != 'cancelled'
            AND customer_name IS NOT NULL
            AND customer_name != 'Unknown'
            AND customer_name != 'Customer'
        GROUP BY customer_name
        HAVING COUNT(*) >= 1
        ORDER BY monetary DESC
    """, (shop_id,))
    rows = cursor.fetchall()

    if not rows:
        return pd.DataFrame()

    records = []
    today = date.today()
    for row in rows:
        try:
            last_date = str(row["last_purchase"])[:10]
            last_dt = date.fromisoformat(last_date)
            recency_days = (today - last_dt).days
            records.append({
                "customer": row["customer_name"],
                "recency": recency_days,
                "frequency": int(row["frequency"]),
                "monetary": float(row["monetary"]),
            })
        except Exception:
            continue

    return pd.DataFrame(records)


def normalize(series: pd.Series) -> pd.Series:
    """Min-max normalize a series, handling zero-range edge case."""
    mn, mx = series.min(), series.max()
    if mx == mn:
        return pd.Series([0.5] * len(series), index=series.index)
    return (series - mn) / (mx - mn)


def assign_segment_label(row: dict) -> dict:
    r = row["r_score"]  # 0=recent, 1=old
    f = row["f_score"]  # 0=rare, 1=frequent
    m = row["m_score"]  # 0=low spend, 1=high spend

    if r <= 0.3 and f >= 0.6 and m >= 0.6:
        return {"segment":"Champion","emoji":"🏆","color":"#4ade80",
                "description":"Buys often and recently. Your most valuable customer.",
                "action":"Reward them. Give early access to new products or a loyalty discount."}
    elif f >= 0.6 and r <= 0.5:
        return {"segment":"Loyal Customer","emoji":"⭐","color":"#34d399",
                "description":"Comes back regularly and trusts your business.",
                "action":"Keep them engaged. Send new arrivals and ask for referrals."}
    elif m >= 0.7 and f <= 0.4:
        return {"segment":"Big Spender","emoji":"💰","color":"#c9920a",
                "description":"Spends a lot when they buy but doesn't come often.",
                "action":"Bring them back. Offer bundles or a reason to return sooner."}
    elif r >= 0.6 and f >= 0.4:
        return {"segment":"At Risk","emoji":"⚠️","color":"#fb923c",
                "description":"Was a regular customer but hasn't bought recently.",
                "action":"Re-engage now. Send a personal message or limited-time offer."}
    elif r >= 0.7 and f <= 0.3:
        return {"segment":"Needs Attention","emoji":"😴","color":"#f87171",
                "description":"Hasn't bought in a while and didn't buy often.",
                "action":"Try a win-back message. If no response, focus energy elsewhere."}
    elif f <= 0.2 and r <= 0.4:
        return {"segment":"New Customer","emoji":"🌱","color":"#60a5fa",
                "description":"Recently made their first or second purchase.",
                "action":"Make a great impression. Follow up and encourage a second order."}
    else:
        return {"segment":"Promising","emoji":"💫","color":"#a78bfa",
                "description":"Showing good signs but still early to fully categorize.",
                "action":"Stay consistent. Keep engaging and track their next purchase."}


def segment_customers(shop_id: int, conn) -> dict:
    """
    Run K-Means clustering on RFM scores to segment customers.
    Falls back to rule-based segmentation if too few customers for K-Means.
    """
    df = get_customer_transactions(shop_id, conn)

    if df.empty:
        return {"enough_data": False,
                "message": "No named customers yet. Add customer names when logging sales to unlock segmentation.",
                "segments": [], "summary": {}}

    if len(df) < 3:
        return {"enough_data": False,
                "message": f"Only {len(df)} named customer(s) found. Need at least 3 to run segmentation.",
                "segments": [], "summary": {}}

    df["r_norm"] = 1 - normalize(df["recency"])
    df["f_norm"] = normalize(df["frequency"])
    df["m_norm"] = normalize(df["monetary"])

    n_clusters = min(4, len(df))
    try:
        from sklearn.cluster import KMeans
        from sklearn.preprocessing import StandardScaler
        features = df[["r_norm", "f_norm", "m_norm"]].values
        features_scaled = StandardScaler().fit_transform(features)
        df["cluster"] = KMeans(n_clusters=n_clusters, random_state=42, n_init=10).fit_predict(features_scaled)
    except ImportError:
        df["rfm_score"] = df["r_norm"] + df["f_norm"] + df["m_norm"]
        df["cluster"] = pd.cut(df["rfm_score"], bins=n_clusters, labels=False)

    results = []
    for _, row in df.iterrows():
        score_dict = {"r_score": 1 - row["r_norm"], "f_score": row["f_norm"], "m_score": row["m_norm"]}
        label_info = assign_segment_label(score_dict)
        results.append({
            "customer": row["customer"],
            "recency_days": int(row["recency"]),
            "frequency": int(row["frequency"]),
            "monetary": round(row["monetary"], 0),
            **label_info,
        })

    results.sort(key=lambda x: x["monetary"], reverse=True)

    from collections import Counter
    segment_counts = Counter(r["segment"] for r in results)

    at_risk = sum(1 for r in results if r["segment"] in ["At Risk", "Needs Attention"])
    champions = sum(1 for r in results if r["segment"] == "Champion")
    new_customers = sum(1 for r in results if r["segment"] == "New Customer")

    insights = []
    if champions > 0:
        insights.append(f"You have {champions} champion customer{'s' if champions > 1 else ''} — your most valuable buyer{'s' if champions > 1 else ''}. Protect these relationships.")
    if at_risk > 0:
        insights.append(f"{at_risk} customer{'s are' if at_risk > 1 else ' is'} at risk of churning. Reach out before you lose them.")
    if new_customers > 0:
        insights.append(f"{new_customers} new customer{'s' if new_customers > 1 else ''} recently. Focus on converting them into regulars.")

    return {
        "enough_data": True,
        "total_customers": len(results),
        "segments": results,
        "segment_counts": dict(segment_counts),
        "insights": insights,
        "summary": {"champions": champions, "at_risk": at_risk, "new_customers": new_customers, "total": len(results)},
    }
