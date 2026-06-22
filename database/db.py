import sqlite3
import json
import hashlib
import secrets
from datetime import datetime

DB_PATH = "veevak.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS sellers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT,
            password_salt TEXT,
            language TEXT DEFAULT 'en',
            currency TEXT DEFAULT 'NGN',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            seller_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES sellers(id)
        );

        CREATE TABLE IF NOT EXISTS shops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES sellers(id)
        );

        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_id INTEGER NOT NULL,
            customer_name TEXT,
            products TEXT,              -- JSON array
            order_total REAL,
            payment_method TEXT,
            payment_status TEXT,
            channel TEXT DEFAULT 'whatsapp',
            order_status TEXT DEFAULT 'confirmed',
            sale_date TEXT,
            raw_extraction TEXT,        -- full LLM JSON, for debugging
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (shop_id) REFERENCES shops(id)
        );

        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_id INTEGER NOT NULL,
            description TEXT,
            amount REAL,
            category TEXT,
            expense_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (shop_id) REFERENCES shops(id)
        );

        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_id INTEGER NOT NULL,
            product_name TEXT,
            stock_qty INTEGER DEFAULT 0,
            unit_price REAL,
            low_stock_threshold INTEGER DEFAULT 3,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (shop_id) REFERENCES shops(id)
        );

        CREATE TABLE IF NOT EXISTS chat_uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_id INTEGER NOT NULL,
            filename TEXT,
            message_count INTEGER,
            orders_extracted INTEGER,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (shop_id) REFERENCES shops(id)
        );
    """)

    conn.commit()
    conn.close()


# ── SELLERS & SHOPS ──────────────────────────────────────────────────

def _hash_password(password: str, salt: str = None) -> tuple:
    """Returns (hash, salt). Generates a new salt if none provided."""
    if salt is None:
        salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((salt + password).encode()).hexdigest()
    return pwd_hash, salt


def create_seller(name: str, email: str, language="en", currency="NGN", password: str = None) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    pwd_hash, salt = (_hash_password(password) if password else (None, None))
    cursor.execute(
        "INSERT INTO sellers (name, email, password_hash, password_salt, language, currency) VALUES (?, ?, ?, ?, ?, ?)",
        (name, email, pwd_hash, salt, language, currency)
    )
    seller_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return seller_id


def verify_password(email: str, password: str):
    """Returns the seller dict if email+password match, else None."""
    seller = get_seller_by_email(email)
    if not seller or not seller.get("password_hash"):
        return None
    check_hash, _ = _hash_password(password, seller["password_salt"])
    if check_hash == seller["password_hash"]:
        return seller
    return None


def create_session(seller_id: int) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    token = secrets.token_hex(32)
    cursor.execute("INSERT INTO sessions (token, seller_id) VALUES (?, ?)", (token, seller_id))
    conn.commit()
    conn.close()
    return token


def get_seller_by_session(token: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT sellers.* FROM sellers
        JOIN sessions ON sessions.seller_id = sellers.id
        WHERE sessions.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_seller_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sellers WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def create_shop(seller_id: int, name: str) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO shops (seller_id, name) VALUES (?, ?)", (seller_id, name))
    shop_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return shop_id


def get_shops_for_seller(seller_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shops WHERE seller_id = ?", (seller_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── SALES ────────────────────────────────────────────────────────────

def save_sale(shop_id: int, extraction: dict, sale_date: str, channel: str = "whatsapp"):
    if not extraction.get("has_order"):
        return None

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO sales
        (shop_id, customer_name, products, order_total, payment_method,
         payment_status, channel, order_status, sale_date, raw_extraction)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        shop_id,
        extraction.get("customer_name"),
        json.dumps(extraction.get("products", [])),
        extraction.get("order_total"),
        extraction.get("payment_method"),
        extraction.get("payment_status"),
        channel,
        extraction.get("order_status", "confirmed"),
        sale_date,
        json.dumps(extraction)
    ))
    sale_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return sale_id


def get_sales_for_shop(shop_id: int, limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM sales WHERE shop_id = ?
        ORDER BY created_at DESC LIMIT ?
    """, (shop_id, limit))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["products"] = json.loads(d["products"] or "[]")
        result.append(d)
    return result


# ── EXPENSES ─────────────────────────────────────────────────────────

def save_expense(shop_id: int, description: str, amount: float, category: str, expense_date: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO expenses (shop_id, description, amount, category, expense_date)
        VALUES (?, ?, ?, ?, ?)
    """, (shop_id, description, amount, category, expense_date))
    expense_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return expense_id


def get_expenses_for_shop(shop_id: int, limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM expenses WHERE shop_id = ?
        ORDER BY created_at DESC LIMIT ?
    """, (shop_id, limit))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── INVENTORY ────────────────────────────────────────────────────────

def upsert_inventory_item(shop_id: int, product_name: str, stock_qty: int, unit_price: float, low_threshold: int = 3):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM inventory WHERE shop_id = ? AND product_name = ?", (shop_id, product_name))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
            UPDATE inventory SET stock_qty = ?, unit_price = ?, low_stock_threshold = ?
            WHERE id = ?
        """, (stock_qty, unit_price, low_threshold, existing["id"]))
        item_id = existing["id"]
    else:
        cursor.execute("""
            INSERT INTO inventory (shop_id, product_name, stock_qty, unit_price, low_stock_threshold)
            VALUES (?, ?, ?, ?, ?)
        """, (shop_id, product_name, stock_qty, unit_price, low_threshold))
        item_id = cursor.lastrowid

    conn.commit()
    conn.close()
    return item_id


def get_inventory_for_shop(shop_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inventory WHERE shop_id = ?", (shop_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── ANALYTICS ────────────────────────────────────────────────────────

def get_shop_analytics(shop_id: int) -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    # Today revenue
    cursor.execute("""
        SELECT COALESCE(SUM(order_total), 0) FROM sales
        WHERE shop_id = ? AND date(sale_date) = date('now') AND order_status != 'cancelled'
    """, (shop_id,))
    today_revenue = cursor.fetchone()[0]

    # Today expenses
    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) FROM expenses
        WHERE shop_id = ? AND date(expense_date) = date('now')
    """, (shop_id,))
    today_expenses = cursor.fetchone()[0]

    # Weekly revenue by day (last 7 days) — used for the dashboard trend chart
    cursor.execute("""
        SELECT date(sale_date) as d, SUM(order_total) as total
        FROM sales WHERE shop_id = ? AND sale_date >= date('now', '-7 days')
        GROUP BY date(sale_date) ORDER BY d
    """, (shop_id,))
    weekly = [{"date": r["d"], "total": r["total"]} for r in cursor.fetchall()]

    # True current-calendar-month revenue and expenses, independent of the 7-day chart window
    cursor.execute("""
        SELECT COALESCE(SUM(order_total), 0) FROM sales
        WHERE shop_id = ? AND strftime('%Y-%m', sale_date) = strftime('%Y-%m', 'now')
        AND order_status != 'cancelled'
    """, (shop_id,))
    monthly_revenue = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) FROM expenses
        WHERE shop_id = ? AND strftime('%Y-%m', expense_date) = strftime('%Y-%m', 'now')
    """, (shop_id,))
    monthly_expenses = cursor.fetchone()[0]

    # Recent sales
    cursor.execute("""
        SELECT * FROM sales WHERE shop_id = ?
        ORDER BY created_at DESC LIMIT 10
    """, (shop_id,))
    recent = []
    for r in cursor.fetchall():
        d = dict(r)
        d["products"] = json.loads(d["products"] or "[]")
        recent.append(d)

    # Top products (basic frequency count across all sales)
    cursor.execute("SELECT products FROM sales WHERE shop_id = ?", (shop_id,))
    product_counts = {}
    for (products_json,) in cursor.fetchall():
        for p in json.loads(products_json or "[]"):
            name = p.get("name", "Unknown")
            total = p.get("total_price") or 0
            if name not in product_counts:
                product_counts[name] = 0
            product_counts[name] += total
    top_products = sorted(product_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    conn.close()

    return {
        "today_revenue": today_revenue,
        "today_expenses": today_expenses,
        "today_profit": today_revenue - today_expenses,
        "weekly_revenue": weekly,
        "monthly_revenue": monthly_revenue,
        "monthly_expenses": monthly_expenses,
        "monthly_profit": monthly_revenue - monthly_expenses,
        "recent_sales": recent,
        "top_products": [{"name": n, "revenue": v} for n, v in top_products]
    }