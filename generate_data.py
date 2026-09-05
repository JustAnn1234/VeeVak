import sqlite3
import json
import random
from datetime import date, timedelta

DB_PATH = "veevak.db"

# Nigerian-contextual product catalog by business type
FASHION_PRODUCTS = [
    ("Ankara print midi dress", 18000, 35000),
    ("Lace blouse", 12000, 25000),
    ("High-waist denim jeans", 15000, 28000),
    ("Adire tie-dye top", 8000, 15000),
    ("Corporate pencil skirt", 10000, 20000),
    ("Aso-oke gele", 25000, 45000),
    ("Chiffon senator wear", 22000, 40000),
    ("Kaftan dress", 14000, 30000),
    ("Crop top and palazzo set", 16000, 32000),
    ("Sequin party dress", 28000, 55000),
]

FOOD_PRODUCTS = [
    ("Bento cake (6 inches)", 15000, 25000),
    ("Chops pack (small chops)", 5000, 12000),
    ("Jollof rice per cooler", 8000, 18000),
    ("Chin chin (1kg)", 2500, 5000),
    ("Puff puff (100 pieces)", 3000, 6000),
    ("Wedding cake (3 tier)", 80000, 150000),
    ("Cupcake box (12 pieces)", 8000, 15000),
    ("Chapman drink (per bottle)", 1500, 3000),
    ("Asun (spicy goat meat)", 6000, 12000),
    ("Coconut candy (pack)", 1000, 2500),
]

BEAUTY_PRODUCTS = [
    ("Gele tying service", 5000, 15000),
    ("Hair braiding (knotless)", 25000, 50000),
    ("Makeup glam", 15000, 35000),
    ("Pedicure and manicure", 8000, 15000),
    ("Hair fixing (weave)", 12000, 25000),
    ("Eyebrow shaping", 2000, 5000),
    ("Lash extension", 10000, 20000),
    ("Natural hair treatment", 6000, 14000),
    ("Wig installation", 8000, 18000),
    ("Bridal makeup", 50000, 120000),
]

CUSTOMER_NAMES = [
    "Chioma Obi", "Amara Eze", "Funke Adeyemi", "Bisi Okonkwo",
    "Ngozi Nwosu", "Fatima Aliyu", "Aisha Bello", "Temi Olatunji",
    "Shade Adebayo", "Kemi Adeola", "Yetunde Fashola", "Sola Badmus",
    "Adaeze Umeh", "Chiamaka Nzeka", "Blessing Okeke", "Ifeoma Chukwu",
    "Tunde Bakare", "Emeka Okafor", "Chike Nwofor", "Seun Adeleke",
    "Biodun Afolabi", "Rotimi Ogunleye", "Tobi Adewale", "Dayo Bamidele",
    "Vera Eze", "Precious Obi", "Gift Nwachukwu", "Grace Adeleke",
    "Mercy Okon", "Peace Udoh", "Joy Effiong", "Favour Osei",
    "Amina Sule", "Hauwa Musa", "Zainab Usman", "Maryam Abdullahi",
    "Customer", "Customer", "Customer",
]

CHANNELS = ["whatsapp", "whatsapp", "whatsapp", "instagram", "facebook", "offline", "tiktok"]
PAYMENT_METHODS = ["transfer", "transfer", "transfer", "cash", "pos"]

EXPENSE_TYPES = [
    ("Data subscription", 3000, 5000, "utilities"),
    ("Fuel / transport", 2000, 8000, "transport"),
    ("Packaging materials", 3000, 12000, "stock"),
    ("Raw materials", 10000, 40000, "stock"),
    ("Instagram advert boost", 2000, 10000, "utilities"),
    ("Delivery rider fee", 1000, 5000, "transport"),
    ("Generator fuel", 3000, 8000, "utilities"),
    ("Shop rent (monthly)", 30000, 80000, "utilities"),
    ("Electricity bill", 5000, 15000, "utilities"),
    ("New fabric/materials", 20000, 60000, "stock"),
    ("Laundry/dry cleaning", 2000, 6000, "other"),
    ("Phone credit", 500, 2000, "utilities"),
]


def generate_fashion_shop_data(cursor, shop_id, days=90):
    today = date.today()
    for day_offset in range(days, 0, -1):
        sale_date = today - timedelta(days=day_offset)
        weekday = sale_date.weekday()
        is_weekend = weekday >= 5
        is_month_end = sale_date.day >= 25 or sale_date.day <= 5

        base_prob = 0.6
        if is_weekend:
            base_prob = 0.85
        if is_month_end:
            base_prob += 0.15

        if random.random() < base_prob:
            num_sales = random.choices([1, 2, 3, 4], weights=[40, 35, 20, 5])[0]
            for _ in range(num_sales):
                product = random.choice(FASHION_PRODUCTS)
                name, min_price, max_price = product
                price = round(random.randint(min_price, max_price) / 500) * 500
                qty = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
                total = price * qty
                customer = random.choice(CUSTOMER_NAMES)
                channel = random.choice(CHANNELS)
                payment = random.choice(PAYMENT_METHODS)

                extraction = {
                    "has_order": True,
                    "customer_name": customer,
                    "products": [{"name": name, "quantity": qty, "unit_price": price, "total_price": total}],
                    "order_total": total,
                    "payment_method": payment,
                    "payment_status": "paid",
                    "order_status": "confirmed"
                }

                cursor.execute("""
                    INSERT INTO sales (shop_id, customer_name, products, order_total,
                        payment_method, payment_status, channel, order_status, sale_date, raw_extraction)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    shop_id, customer, json.dumps(extraction["products"]),
                    total, payment, "paid", channel, "confirmed",
                    sale_date.isoformat(), json.dumps(extraction)
                ))

        if random.random() < 0.35:
            expense = random.choice(EXPENSE_TYPES)
            desc, min_amt, max_amt, category = expense
            amount = round(random.randint(min_amt, max_amt) / 500) * 500
            cursor.execute("""
                INSERT INTO expenses (shop_id, description, amount, category, expense_date)
                VALUES (?, ?, ?, ?, ?)
            """, (shop_id, desc, amount, category, sale_date.isoformat()))


def generate_food_shop_data(cursor, shop_id, days=90):
    today = date.today()
    for day_offset in range(days, 0, -1):
        sale_date = today - timedelta(days=day_offset)
        weekday = sale_date.weekday()
        is_weekend = weekday >= 5

        if random.random() < (0.75 if is_weekend else 0.5):
            num_sales = random.choices([1, 2, 3, 5], weights=[30, 35, 25, 10])[0]
            for _ in range(num_sales):
                product = random.choice(FOOD_PRODUCTS)
                name, min_price, max_price = product
                price = round(random.randint(min_price, max_price) / 500) * 500
                total = price
                customer = random.choice(CUSTOMER_NAMES)
                channel = random.choice(["whatsapp", "whatsapp", "instagram", "offline"])

                extraction = {
                    "has_order": True,
                    "customer_name": customer,
                    "products": [{"name": name, "quantity": 1, "unit_price": price, "total_price": total}],
                    "order_total": total,
                    "payment_method": "transfer",
                    "payment_status": "paid",
                    "order_status": "confirmed"
                }

                cursor.execute("""
                    INSERT INTO sales (shop_id, customer_name, products, order_total,
                        payment_method, payment_status, channel, order_status, sale_date, raw_extraction)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    shop_id, customer, json.dumps(extraction["products"]),
                    total, "transfer", "paid", channel, "confirmed",
                    sale_date.isoformat(), json.dumps(extraction)
                ))

        if random.random() < 0.4:
            expense = random.choice(EXPENSE_TYPES)
            desc, min_amt, max_amt, category = expense
            amount = round(random.randint(min_amt, max_amt) / 500) * 500
            cursor.execute("""
                INSERT INTO expenses (shop_id, description, amount, category, expense_date)
                VALUES (?, ?, ?, ?, ?)
            """, (shop_id, desc, amount, category, sale_date.isoformat()))


def main():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM shops")
    shops = cursor.fetchall()

    if not shops:
        print("No shops found. Create at least one account and shop first, then run this script.")
        return

    print(f"Found {len(shops)} shop(s). Generating synthetic data...")

    for shop in shops:
        shop_id = shop["id"]
        shop_name = shop["name"]

        cursor.execute("SELECT COUNT(*) as cnt FROM sales WHERE shop_id = ?", (shop_id,))
        existing_count = cursor.fetchone()["cnt"]

        if existing_count > 20:
            print(f"Shop '{shop_name}' (id:{shop_id}) already has {existing_count} sales. Skipping.")
            continue

        print(f"Generating data for '{shop_name}' (id:{shop_id})...")

        name_lower = shop_name.lower()
        if any(w in name_lower for w in ["fashion", "apparel", "cloth", "wear", "dress", "style"]):
            generate_fashion_shop_data(cursor, shop_id, days=90)
            print(f"  → Generated 90 days of fashion business data")
        elif any(w in name_lower for w in ["food", "cake", "bake", "confection", "kitchen", "catering"]):
            generate_food_shop_data(cursor, shop_id, days=90)
            print(f"  → Generated 90 days of food business data")
        elif any(w in name_lower for w in ["beauty", "hair", "makeup", "gele", "salon", "spa"]):
            generate_food_shop_data(cursor, shop_id, days=90)
            print(f"  → Generated 90 days of beauty business data")
        else:
            generate_fashion_shop_data(cursor, shop_id, days=90)
            print(f"  → Generated 90 days of general business data")

    conn.commit()
    conn.close()

    print("\nDone! Your shops now have 90 days of synthetic historical data.")
    print("This is enough to train the Prophet forecasting model.")


if __name__ == "__main__":
    main()
