import pandas as pd
from datetime import date, timedelta
import json


def get_sales_dataframe(shop_id: int, conn) -> pd.DataFrame:
    """Pull all sales for a shop into a pandas DataFrame."""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT sale_date, COALESCE(SUM(order_total), 0) as total
        FROM sales
        WHERE shop_id = ? AND order_status != 'cancelled'
        GROUP BY sale_date
        ORDER BY sale_date
    """, (shop_id,))
    rows = cursor.fetchall()

    if not rows:
        return pd.DataFrame(columns=["ds", "y"])

    data = []
    for row in rows:
        try:
            data.append({"ds": pd.to_datetime(row["sale_date"]), "y": float(row["total"])})
        except Exception:
            continue

    return pd.DataFrame(data)


def fill_missing_dates(df: pd.DataFrame) -> pd.DataFrame:
    """Fill in zero-revenue days so Prophet sees a continuous time series."""
    if df.empty:
        return df
    full_range = pd.date_range(start=df["ds"].min(), end=df["ds"].max(), freq="D")
    df = df.set_index("ds").reindex(full_range, fill_value=0).reset_index()
    df.columns = ["ds", "y"]
    return df


def forecast_revenue(shop_id: int, conn, periods: int = 14) -> dict:
    """
    Run Prophet on a shop's sales history and return a forecast
    for the next `periods` days.

    Returns a dict with:
      - history: list of {date, actual} for the last 30 days
      - forecast: list of {date, predicted, lower, upper}
      - summary: plain-English summary string
      - enough_data: bool
    """
    try:
        from prophet import Prophet
    except ImportError:
        return {"error": "Prophet not installed. Run: pip install prophet", "enough_data": False}

    df = get_sales_dataframe(shop_id, conn)

    if len(df) < 10:
        return {
            "enough_data": False,
            "message": "Not enough sales history yet. Keep logging sales and check back in a few weeks."
        }

    df = fill_missing_dates(df)

    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=True,
        daily_seasonality=False,
        changepoint_prior_scale=0.1,
        seasonality_prior_scale=10,
    )

    # Nigerian market context — month-end salary effect
    model.add_seasonality(
        name="month_end",
        period=30.5,
        fourier_order=3,
    )

    model.fit(df)

    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)

    today = pd.Timestamp(date.today())
    forecast_future = forecast[forecast["ds"] >= today][
        ["ds", "yhat", "yhat_lower", "yhat_upper"]
    ].head(periods).copy()

    # Clamp negatives to zero
    forecast_future["yhat"] = forecast_future["yhat"].clip(lower=0)
    forecast_future["yhat_lower"] = forecast_future["yhat_lower"].clip(lower=0)
    forecast_future["yhat_upper"] = forecast_future["yhat_upper"].clip(lower=0)

    history_recent = df.tail(30)

    next_7_avg = forecast_future.head(7)["yhat"].mean()
    prev_7_avg = df.tail(7)["y"].mean() if len(df) >= 7 else df["y"].mean()

    if prev_7_avg > 0:
        change_pct = ((next_7_avg - prev_7_avg) / prev_7_avg) * 100
        if change_pct > 10:
            trend_text = f"Revenue is expected to increase by about {abs(change_pct):.0f}% next week."
        elif change_pct < -10:
            trend_text = f"Revenue may dip by about {abs(change_pct):.0f}% next week based on recent patterns."
        else:
            trend_text = "Revenue is expected to remain fairly steady next week."
    else:
        trend_text = "Keep logging sales to see more accurate predictions."

    peak_day = forecast_future.loc[forecast_future["yhat"].idxmax(), "ds"]
    peak_day_name = peak_day.strftime("%A, %b %d")

    summary = f"{trend_text} Your strongest day is likely to be {peak_day_name}."

    return {
        "enough_data": True,
        "summary": summary,
        "history": [
            {"date": row["ds"].strftime("%Y-%m-%d"), "actual": round(row["y"], 0)}
            for _, row in history_recent.iterrows()
        ],
        "forecast": [
            {
                "date": row["ds"].strftime("%Y-%m-%d"),
                "predicted": round(row["yhat"], 0),
                "lower": round(row["yhat_lower"], 0),
                "upper": round(row["yhat_upper"], 0),
            }
            for _, row in forecast_future.iterrows()
        ],
    }
