import pandas as pd
import numpy as np
from datetime import date, timedelta

from database.db import fix_sql


def get_recent_data(shop_id: int, conn, days: int = 60) -> tuple:
    """Pull sales and expenses for the last N days."""
    cursor = conn.cursor()
    since = (date.today() - timedelta(days=days)).isoformat()

    cursor.execute(fix_sql("""
        SELECT sale_date as d, COALESCE(SUM(order_total), 0) as total
        FROM sales
        WHERE shop_id = ? AND sale_date >= ? AND order_status != 'cancelled'
        GROUP BY sale_date
        ORDER BY sale_date
    """), (shop_id, since))
    sales_rows = cursor.fetchall()

    cursor.execute(fix_sql("""
        SELECT expense_date as d, COALESCE(SUM(amount), 0) as total
        FROM expenses
        WHERE shop_id = ? AND expense_date >= ?
        GROUP BY expense_date
        ORDER BY expense_date
    """), (shop_id, since))
    expense_rows = cursor.fetchall()

    return sales_rows, expense_rows


def build_daily_dataframe(sales_rows, expense_rows, days: int = 60) -> pd.DataFrame:
    """Build a complete daily DataFrame with zeros for missing days."""
    today = date.today()
    date_range = [today - timedelta(days=i) for i in range(days, -1, -1)]

    sales_map = {}
    for row in sales_rows:
        try:
            sales_map[str(row["d"])[:10]] = float(row["total"])
        except Exception:
            pass

    expense_map = {}
    for row in expense_rows:
        try:
            expense_map[str(row["d"])[:10]] = float(row["total"])
        except Exception:
            pass

    records = []
    for d in date_range:
        ds = d.isoformat()
        records.append({
            "date": ds,
            "weekday": d.weekday(),
            "day_of_month": d.day,
            "sales": sales_map.get(ds, 0),
            "expenses": expense_map.get(ds, 0),
        })

    return pd.DataFrame(records)


def detect_anomalies(shop_id: int, conn) -> dict:
    """
    Run Isolation Forest on daily sales and expense patterns.
    Returns a list of anomaly alerts in plain English,
    plus context stats useful for the frontend.
    """
    try:
        from sklearn.ensemble import IsolationForest
    except ImportError:
        return {"error": "scikit-learn not installed", "alerts": []}

    sales_rows, expense_rows = get_recent_data(shop_id, conn, days=60)

    df = build_daily_dataframe(sales_rows, expense_rows, days=60)

    if len(df) < 14:
        return {
            "alerts": [],
            "enough_data": False,
            "message": "Not enough data yet for anomaly detection."
        }

    # ── SALES ANOMALY DETECTION ──────────────────────────────────────
    sales_alerts = []
    sales_df = df[["sales", "weekday", "day_of_month"]].copy()

    model_sales = IsolationForest(
        contamination=0.1,
        random_state=42,
        n_estimators=100
    )
    df["sales_anomaly"] = model_sales.fit_predict(sales_df)
    df["sales_score"] = model_sales.decision_function(sales_df)

    today_str = date.today().isoformat()
    yesterday_str = (date.today() - timedelta(days=1)).isoformat()

    today_row = df[df["date"] == today_str]
    yesterday_row = df[df["date"] == yesterday_str]

    avg_daily_sales = df[df["sales"] > 0]["sales"].mean()
    avg_weekly_sales = df.tail(7)["sales"].mean()

    for row_df, label in [(today_row, "today"), (yesterday_row, "yesterday")]:
        if row_df.empty:
            continue
        row = row_df.iloc[0]

        if row["sales_anomaly"] == -1:
            day_sales = row["sales"]
            if day_sales == 0 and avg_daily_sales > 0:
                zero_streak = 0
                check_date = date.today()
                for _ in range(10):
                    ds = check_date.isoformat()
                    matching = df[df["date"] == ds]
                    if not matching.empty and matching.iloc[0]["sales"] == 0:
                        zero_streak += 1
                        check_date -= timedelta(days=1)
                    else:
                        break

                if zero_streak >= 2:
                    sales_alerts.append({
                        "type": "no_sales_streak",
                        "severity": "warning",
                        "title": "Sales gap detected",
                        "message": f"You've had no sales for {zero_streak} days in a row. This is unusual based on your recent patterns. Consider posting on your social channels or following up with recent customers.",
                        "metric": f"{zero_streak} days without sales",
                    })

            elif day_sales > 0 and avg_daily_sales > 0:
                ratio = day_sales / avg_daily_sales
                if ratio > 2.5:
                    sales_alerts.append({
                        "type": "sales_spike",
                        "severity": "positive",
                        "title": "Unusually strong sales day",
                        "message": f"Your sales {label} (₦{day_sales:,.0f}) were {ratio:.1f}x your daily average. Great day! Consider what you did differently.",
                        "metric": f"₦{day_sales:,.0f} vs ₦{avg_daily_sales:,.0f} avg",
                    })
                elif ratio < 0.2:
                    sales_alerts.append({
                        "type": "sales_drop",
                        "severity": "warning",
                        "title": "Unusually low sales",
                        "message": f"Sales {label} were much lower than normal (₦{day_sales:,.0f} vs your avg of ₦{avg_daily_sales:,.0f}). Check if there were any supply, delivery, or visibility issues.",
                        "metric": f"₦{day_sales:,.0f} vs ₦{avg_daily_sales:,.0f} avg",
                    })

    # ── EXPENSE ANOMALY DETECTION ────────────────────────────────────
    expense_alerts = []
    expense_df = df[["expenses", "weekday", "day_of_month"]].copy()
    avg_daily_expenses = df[df["expenses"] > 0]["expenses"].mean()

    if avg_daily_expenses > 0 and not np.isnan(avg_daily_expenses):
        model_expenses = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        df["expense_anomaly"] = model_expenses.fit_predict(expense_df)

        today_expense_row = df[df["date"] == today_str]
        if not today_expense_row.empty:
            row = today_expense_row.iloc[0]
            if row["expense_anomaly"] == -1 and row["expenses"] > 0:
                ratio = row["expenses"] / avg_daily_expenses
                if ratio > 2.5:
                    expense_alerts.append({
                        "type": "expense_spike",
                        "severity": "caution",
                        "title": "High expenses today",
                        "message": f"Today's expenses (₦{row['expenses']:,.0f}) are {ratio:.1f}x your daily average (₦{avg_daily_expenses:,.0f}). Make sure this was planned spending.",
                        "metric": f"₦{row['expenses']:,.0f} vs ₦{avg_daily_expenses:,.0f} avg",
                    })

    # ── WEEKLY PATTERN INSIGHTS ──────────────────────────────────────
    pattern_alerts = []

    if len(df) >= 21:
        df["weekday_name"] = pd.to_datetime(df["date"]).dt.strftime("%A")
        weekday_avg = df.groupby("weekday_name")["sales"].mean()
        best_day = weekday_avg.idxmax()
        worst_day = weekday_avg.idxmin()

        if weekday_avg[best_day] > 0:
            pattern_alerts.append({
                "type": "best_day_insight",
                "severity": "info",
                "title": f"{best_day} is your best day",
                "message": f"Based on your sales patterns, {best_day} consistently brings in the most revenue. Consider stocking up and posting more on {best_day}s.",
                "metric": f"₦{weekday_avg[best_day]:,.0f} avg on {best_day}s",
            })

    all_alerts = sales_alerts + expense_alerts + pattern_alerts

    return {
        "enough_data": True,
        "alerts": all_alerts,
        "stats": {
            "avg_daily_sales": round(avg_daily_sales, 0) if not np.isnan(avg_daily_sales) else 0,
            "avg_daily_expenses": round(avg_daily_expenses, 0) if avg_daily_expenses and not np.isnan(avg_daily_expenses) else 0,
            "days_analyzed": len(df),
        }
    }
