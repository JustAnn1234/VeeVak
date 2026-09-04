from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import os
from dotenv import load_dotenv

from parser.whatsapp import (
    parse_whatsapp_export, identify_owner,
    group_into_conversations, build_conversation_text
)
from parser.extractor import (
    extract_with_gemini,
    classify_intents_multi,
    extract_expenses_with_gemini,
    extract_inventory_with_gemini,
    chat_with_context,
)
from database.db import (
    init_db, create_seller, get_seller_by_email, create_shop, get_shops_for_seller,
    save_sale, get_sales_for_shop, save_expense, get_expenses_for_shop,
    upsert_inventory_item, get_inventory_for_shop, get_shop_analytics,
    verify_password, create_session, get_seller_by_session, update_seller_profile
)

load_dotenv()

app = FastAPI(title="VeeVak API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

CURRENCY_SYMBOLS = {"NGN": "₦", "USD": "$", "GBP": "£"}


@app.get("/")
async def health_check():
    return {"status": "ok", "service": "VeeVak API"}


# ── Request models ───────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    business_name: str
    language: str = "en"
    currency: str = "NGN"


class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileUpdateRequest(BaseModel):
    name: str
    email: str

class OnboardRequest(BaseModel):
    name: str
    email: str
    business_name: str
    language: str = "en"
    currency: str = "NGN"

class AddShopRequest(BaseModel):
    seller_id: int
    name: str


class ExpenseRequest(BaseModel):
    shop_id: int
    description: str
    amount: float
    category: str = "Other"
    expense_date: Optional[str] = None


class InventoryRequest(BaseModel):
    shop_id: int
    product_name: str
    stock_qty: int
    unit_price: float
    low_stock_threshold: int = 3


class PasteAnalyzeRequest(BaseModel):
    shop_id: int
    chat_text: str
    currency: str = "NGN"


class QuickSaleRequest(BaseModel):
    shop_id: int
    product_name: str
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    total_price: float
    customer_name: Optional[str] = None
    channel: str = "whatsapp"
    payment_status: str = "paid"
    sale_date: Optional[str] = None


class ChatMessage(BaseModel):
    role: str
    text: str


class ConversationRequest(BaseModel):
    shop_id: int
    shop_name: Optional[str] = ""
    currency: str = "NGN"
    messages: List[ChatMessage]

# ── Authentication ───────────────────────────────────────────────────

@app.post("/auth/signup")
async def signup(req: SignupRequest):
    existing = get_seller_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    seller_id = create_seller(req.name, req.email, req.language, req.currency, password=req.password)
    shop_id = create_shop(seller_id, req.business_name)
    token = create_session(seller_id)

    return {
        "token": token,
        "seller_id": seller_id,
        "shop_id": shop_id,
        "shop_name": req.business_name
    }


@app.post("/auth/login")
async def login(req: LoginRequest):
    seller = verify_password(req.email, req.password)
    if not seller:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    token = create_session(seller["id"])
    shops = get_shops_for_seller(seller["id"])

    return {
        "token": token,
        "seller_id": seller["id"],
        "name": seller["name"],
        "email": seller["email"],
        "language": seller["language"],
        "currency": seller["currency"],
        "shops": shops
    }


@app.get("/auth/me")
async def get_current_session(token: str):
    seller = get_seller_by_session(token)
    if not seller:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    shops = get_shops_for_seller(seller["id"])
    return {
        "seller_id": seller["id"],
        "name": seller["name"],
        "email": seller["email"],
        "language": seller["language"],
        "currency": seller["currency"],
        "shops": shops
    }


@app.put("/auth/profile")
async def update_profile(req: ProfileUpdateRequest, token: str):
    seller = get_seller_by_session(token)
    if not seller:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    email = req.email.strip()
    name = req.name.strip()
    if not name or not email:
        raise HTTPException(status_code=400, detail="Name and email are required.")
    existing = get_seller_by_email(email)
    if existing and existing["id"] != seller["id"]:
        raise HTTPException(status_code=400, detail="That email is already in use.")
    update_seller_profile(seller["id"], name, email)
    return {"name": name, "email": email}

# ── Onboarding ───────────────────────────────────────────────────────

@app.post("/onboard")
async def onboard(req: OnboardRequest):
    existing = get_seller_by_email(req.email)
    if existing:
        seller_id = existing["id"]
    else:
        seller_id = create_seller(req.name, req.email, req.language, req.currency)

    shop_id = create_shop(seller_id, req.business_name)

    return {
        "seller_id": seller_id,
        "shop_id": shop_id,
        "shop_name": req.business_name
    }


@app.post("/shops/add")
async def add_shop(req: AddShopRequest):
    shop_id = create_shop(req.seller_id, req.name)
    return {"shop_id": shop_id, "name": req.name}


@app.get("/shops/{seller_id}")
async def list_shops(seller_id: int):
    return {"shops": get_shops_for_seller(seller_id)}


# ── WhatsApp Upload ──────────────────────────────────────────────────

@app.post("/upload/whatsapp")
async def upload_whatsapp_chat(
    file: UploadFile = File(...),
    shop_id: int = Form(...),
    owner_name: str = Form(default=""),
    currency: str = Form(default="NGN")
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    messages = parse_whatsapp_export(text)
    messages = identify_owner(messages, owner_name)
    conversations = group_into_conversations(messages)

    sym = CURRENCY_SYMBOLS.get(currency, "₦")
    results = []

    for customer, msgs in conversations.items():
        convo_text = build_conversation_text(msgs)
        extraction = extract_with_gemini(convo_text, GEMINI_API_KEY, sym)

        if extraction.get("has_order"):
            sale_date = msgs[0]["date"] if msgs else None
            sale_date_iso = _to_iso_date(sale_date)
            save_sale(shop_id, extraction, sale_date_iso, channel="whatsapp")
            results.append({"customer": customer, "extraction": extraction})

    return {
        "message": f"Processed {len(conversations)} conversations",
        "orders_found": len(results),
        "results": results
    }


@app.post("/analyze/paste")
async def analyze_pasted_chat(req: PasteAnalyzeRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server")

    sym = CURRENCY_SYMBOLS.get(req.currency, "₦")
    extraction = extract_with_gemini(req.chat_text, GEMINI_API_KEY, sym)

    if extraction.get("has_order"):
        save_sale(req.shop_id, extraction, date.today().isoformat(), channel="whatsapp")

    return extraction


@app.post("/chat/conversation")
async def conversation(req: ConversationRequest):
    """
    True conversational endpoint. Frontend sends the full message history each time.
    The AI responds naturally, and this call ALSO silently extracts + saves any
    transactions mentioned in the latest message in the background. A single
    message can describe more than one thing at once (e.g. a sale AND an
    expense, or two separate expenses), so every relevant intent and every
    individual item found is processed, not just the first.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set")

    sym = CURRENCY_SYMBOLS.get(req.currency, "₦")
    today = date.today().isoformat()
    latest_text = req.messages[-1].text if req.messages else ""

    shop_context = f"Shop name: {req.shop_name}." if req.shop_name else ""
    reply = chat_with_context(
        [{"role": m.role, "text": m.text} for m in req.messages],
        shop_context, GEMINI_API_KEY, sym
    )

    saved_actions = []
    intents = classify_intents_multi(latest_text, GEMINI_API_KEY)

    if "expense" in intents:
        expenses = extract_expenses_with_gemini(latest_text, GEMINI_API_KEY, sym)
        for exp in expenses:
            save_expense(req.shop_id, exp["description"], exp["amount"], exp.get("category", "other"), today)
            saved_actions.append(f"expense:{exp['description']}")

    if "inventory" in intents:
        items = extract_inventory_with_gemini(latest_text, GEMINI_API_KEY, sym)
        for item in items:
            qty = 0 if item.get("action") == "out_of_stock" else (item.get("quantity") or 1)
            upsert_inventory_item(req.shop_id, item["product_name"], qty, item.get("unit_price") or 0.0)
            saved_actions.append(f"inventory:{item['product_name']}")

    if "sale" in intents:
        extraction = extract_with_gemini(latest_text, GEMINI_API_KEY, sym)
        if extraction.get("has_order"):
            save_sale(req.shop_id, extraction, today, channel="whatsapp")
            saved_actions.append("sale logged")

    return {"reply": reply, "intent": ",".join(intents), "saved": saved_actions}


# ── Sales ────────────────────────────────────────────────────────────

@app.post("/sales/quick")
async def quick_log_sale(req: QuickSaleRequest):
    extraction = {
        "has_order": True,
        "customer_name": req.customer_name,
        "products": [{
            "name": req.product_name,
            "quantity": req.quantity,
            "unit_price": req.unit_price,
            "total_price": req.total_price
        }],
        "order_total": req.total_price,
        "payment_method": req.channel,
        "payment_status": req.payment_status,
        "order_status": "confirmed"
    }
    sale_date = req.sale_date or date.today().isoformat()
    sale_id = save_sale(req.shop_id, extraction, sale_date, channel=req.channel)
    return {"sale_id": sale_id, "message": "Sale logged"}


@app.get("/sales/{shop_id}")
async def list_sales(shop_id: int):
    return {"sales": get_sales_for_shop(shop_id)}


# ── Expenses ─────────────────────────────────────────────────────────

@app.post("/expenses")
async def log_expense(req: ExpenseRequest):
    expense_date = req.expense_date or date.today().isoformat()
    expense_id = save_expense(req.shop_id, req.description, req.amount, req.category, expense_date)
    return {"expense_id": expense_id, "message": "Expense logged"}


@app.get("/expenses/{shop_id}")
async def list_expenses(shop_id: int):
    return {"expenses": get_expenses_for_shop(shop_id)}


# ── Inventory ────────────────────────────────────────────────────────

@app.post("/inventory")
async def add_inventory(req: InventoryRequest):
    item_id = upsert_inventory_item(
        req.shop_id, req.product_name, req.stock_qty, req.unit_price, req.low_stock_threshold
    )
    return {"item_id": item_id, "message": "Inventory updated"}


@app.get("/inventory/{shop_id}")
async def list_inventory(shop_id: int):
    return {"inventory": get_inventory_for_shop(shop_id)}


# ── Analytics ────────────────────────────────────────────────────────

@app.get("/analytics/{shop_id}")
async def analytics(shop_id: int):
    return get_shop_analytics(shop_id)


# ── Helpers ──────────────────────────────────────────────────────────

def _to_iso_date(date_str: Optional[str]) -> str:
    """Convert DD/MM/YYYY to YYYY-MM-DD. Falls back to today if parsing fails."""
    if not date_str:
        return date.today().isoformat()
    try:
        parts = date_str.split("/")
        if len(parts) == 3:
            d, m, y = parts
            return f"{y}-{m.zfill(2)}-{d.zfill(2)}"
    except Exception:
        pass
    return date.today().isoformat()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)