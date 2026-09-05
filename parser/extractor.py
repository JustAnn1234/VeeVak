import json
import csv
import os
import re
import requests
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, ValidationError


class ParsedSaleItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    product_name: str
    quantity: float = Field(ge=0)
    unit_price: float = Field(ge=0)


class ParsedSale(BaseModel):
    model_config = ConfigDict(extra="ignore")

    customer_name: str = "Customer"
    sales_channel: Literal["whatsapp", "instagram", "tiktok", "offline", "website", "direct"] = "direct"
    items: List[ParsedSaleItem] = Field(default_factory=list)
    total_amount: Optional[float] = Field(default=None, ge=0)
    payment_method: Literal["bank_transfer", "cash", "pos", "paystack_link", "unknown"] = "unknown"
    transaction_date: str = "today"


class ParsedSalesResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    sales: List[ParsedSale] = Field(default_factory=list)


STRUCTURED_EXTRACTION_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "sales": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "customer_name": {"type": "STRING"},
                    "sales_channel": {"type": "STRING", "enum": ["whatsapp", "instagram", "tiktok", "offline", "website", "direct"]},
                    "items": {"type": "ARRAY", "items": {"type": "OBJECT", "properties": {
                        "product_name": {"type": "STRING"},
                        "quantity": {"type": "NUMBER"},
                        "unit_price": {"type": "NUMBER"},
                    }, "required": ["product_name", "quantity", "unit_price"]}},
                    "total_amount": {"type": "NUMBER"},
                    "payment_method": {"type": "STRING", "enum": ["bank_transfer", "cash", "pos", "paystack_link", "unknown"]},
                    "transaction_date": {"type": "STRING"},
                },
                "required": ["customer_name", "sales_channel", "items", "total_amount", "payment_method", "transaction_date"],
            },
        },
    },
    "required": ["sales"],
}


STRUCTURED_EXTRACTION_SYSTEM_PROMPT = """You are VeeVak AI, a precise transaction parser for African informal commerce. Extract structured sale data from incoming chat logs.

ALWAYS return valid JSON matching the supplied schema. Clean all currency symbols (₦, $, N) and shorthand such as 45k into plain numbers.

RULES FOR CHANNEL DETECTION:
1. Instagram handles (@handle:), DMs, or Instagram/IG mean instagram.
2. TikTok handles (@username:), TikTok, or TT mean tiktok when the input identifies TikTok.
3. WhatsApp timestamps such as [01:15 PM, 05/09/2026] Name: or the word WhatsApp mean whatsapp.
4. POS, cash, walk-in, in-store, or direct in-person notes mean offline.
5. Use website only when the input explicitly identifies a website or checkout.
6. If no channel marker is present, use direct. Never default to whatsapp.
7. Return an empty sales array when there is no clear sale agreement."""


def _call_gemini(prompt: str, api_key: str, max_tokens: int = 1024, temperature: float = 0.1, response_schema: Optional[Dict] = None):
    """Shared helper for calling Gemini and returning the raw text response, or None on failure."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    generation_config = {"temperature": temperature, "maxOutputTokens": max_tokens}
    if response_schema:
        generation_config.update({"responseMimeType": "application/json", "responseSchema": response_schema})
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": generation_config,
    }
    for attempt in range(2):
        try:
            response = requests.post(url, json=payload, timeout=30)
            if response.status_code == 200:
                try:
                    return response.json()["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError):
                    return None
            if response.status_code not in (429, 500, 502, 503, 504) or attempt == 1:
                return None
        except requests.exceptions.RequestException:
            if attempt == 1:
                return None
    return None


def build_extraction_prompt(conversation: str, currency_symbol: str = "₦") -> str:
    return f"""{STRUCTURED_EXTRACTION_SYSTEM_PROMPT}

Analyze this input from a small business in Nigeria or another African market. Understand Nigerian Pidgin, local-language code-switching, informal pricing such as 45k, and payment screenshots represented by [image/voice note]. A customer agreeing to buy specific items is a sale even if the word order is absent. Use {currency_symbol} as context and return raw numbers.

The input may contain:
- Nigerian Pidgin English (e.g., "how much be this", "I go pay", "send am")
- Code-switching between English and local languages
- Informal pricing (e.g., "45k" means 45,000)
- Abbreviations common in informal commerce
- Media placeholders like [image/voice note] which usually represent a payment screenshot — treat these as supporting evidence of payment, not as missing information

A conversation counts as having an order (has_order: true) whenever a customer agrees to buy one or more specific items, even if the word "order" never appears. Signs of a real order include: the customer naming items and quantities they want, the seller quoting a price and the customer accepting it, the customer saying things like "send it", "I'll take it", "sending payment now", or the seller confirming payment was received. You do not need an explicit confirmation phrase — agreement plus a quoted price is enough.

Return the supplied structured JSON schema only, with no explanation or markdown formatting. Each sale must include the customer name, detected channel, item list, total amount, payment method, and transaction date.

Example: if a customer asks about a product, the seller quotes a price, the customer says "let me take one" and later says "just sent it" after the seller asks for payment, this IS a confirmed order with payment_status "paid", even though no one used the word "order".

Rules:
- Convert "k" to thousands (45k = 45000)
- Return an empty sales array for a pure inquiry with no agreement to buy
- Never use whatsapp unless the raw input has a WhatsApp marker

CONVERSATION:
{conversation}

JSON OUTPUT:"""


def parse_llm_response(raw_text: str) -> Dict:
    """Safely parse LLM JSON response, stripping markdown if present."""
    text = re.sub(r"^\s*```(?:json)?\s*|\s*```\s*$", "", raw_text.strip(), flags=re.IGNORECASE).strip()

    start = text.find("{")
    end = text.rfind("}") + 1

    if start != -1 and end > start:
        json_str = text[start:end]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            return {"has_order": False, "error": f"JSON parse failed: {str(e)}", "raw": raw_text[:300]}

    return {"has_order": False, "error": "No JSON found in response", "raw": raw_text[:300]}


def detect_sales_channel(text: str) -> str:
    """Detect an explicit source marker; never assume WhatsApp."""
    lowered = text.lower()
    if re.search(r"\b(instagram|ig|dm|dms)\b|@[a-z0-9._-]+\s*:", lowered):
        return "instagram"
    if re.search(r"\b(tiktok|tt)\b", lowered):
        return "tiktok"
    if re.search(r"\[\s*\d{1,2}:\d{2}\s*(?:am|pm)?\s*,\s*\d{1,2}/\d{1,2}/\d{2,4}\s*\]|\bwhatsapp\b", lowered):
        return "whatsapp"
    if re.search(r"\b(pos|cash|walk[- ]?in|in[- ]?store|offline)\b", lowered):
        return "offline"
    if re.search(r"\bwebsite|webshop|checkout\b", lowered):
        return "website"
    return "direct"


def _structured_result(parsed: ParsedSalesResponse, raw_text: str, source_text: str) -> Dict:
    """Convert the strict schema to the legacy shape consumed by the API."""
    if not parsed.sales:
        return {"has_order": False, "sales_channel": detect_sales_channel(source_text), "products": []}
    sale = parsed.sales[0]
    channel = detect_sales_channel(source_text)
    products = [{"name": item.product_name, "quantity": item.quantity, "unit_price": item.unit_price, "total_price": item.quantity * item.unit_price} for item in sale.items]
    total = sale.total_amount if sale.total_amount is not None else sum(item["total_price"] for item in products)
    return {
        "has_order": bool(products),
        "customer_name": sale.customer_name or "Customer",
        "products": products,
        "order_total": total,
        "payment_method": sale.payment_method,
        "payment_status": "paid" if sale.payment_method != "unknown" else "unknown",
        "order_status": "confirmed" if products else "inquiry",
        "sales_channel": channel,
        "notes": f"Parsed from {channel} input.",
    }


def _call_granite(conversation_text: str, token: str, currency_symbol: str) -> Optional[str]:
    if not token:
        return None
    prompt = f"{STRUCTURED_EXTRACTION_SYSTEM_PROMPT}\nCurrency context: {currency_symbol}\nInput:\n{conversation_text}\nJSON:"
    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/ibm-granite/granite-3.0-8b-instruct",
            headers={"Authorization": f"Bearer {token}"},
            json={"inputs": prompt, "parameters": {"max_new_tokens": 700, "temperature": 0.1, "return_full_text": False}},
            timeout=60,
        )
        if response.status_code != 200:
            return None
        payload = response.json()
        if isinstance(payload, list) and payload and isinstance(payload[0], dict):
            return payload[0].get("generated_text")
        return None
    except requests.exceptions.RequestException:
        return None


def extract_with_gemini(conversation_text: str, api_key: str, currency_symbol: str = "₦") -> Dict:
    """Extract validated order data with Gemini, then Granite as a fallback."""
    prompt = build_extraction_prompt(conversation_text, currency_symbol)
    last_error = "Gemini API request failed"
    for _attempt in range(2):
        raw_text = _call_gemini(prompt, api_key, max_tokens=1024, temperature=0.1, response_schema=STRUCTURED_EXTRACTION_SCHEMA)
        if not raw_text:
            continue
        parsed_json = parse_llm_response(raw_text)
        if "error" in parsed_json:
            last_error = parsed_json["error"]
            continue
        try:
            parsed = ParsedSalesResponse.model_validate(parsed_json)
            return _structured_result(parsed, raw_text, conversation_text)
        except ValidationError as exc:
            last_error = f"Schema validation failed: {exc.errors()[0]['msg']}"

    granite_raw = _call_granite(conversation_text, os.getenv("HUGGINGFACE_API_TOKEN") or os.getenv("HF_TOKEN", ""), currency_symbol)
    if granite_raw:
        try:
            parsed = ParsedSalesResponse.model_validate(parse_llm_response(granite_raw))
            return _structured_result(parsed, granite_raw, conversation_text)
        except (ValidationError, TypeError):
            pass
    return {"has_order": False, "sales_channel": detect_sales_channel(conversation_text), "error": last_error, "fallback": "ibm-granite"}


def classify_intents_multi(text: str, api_key: str) -> List[str]:
    """
    Detects ALL categories present in one message, since a seller may describe
    a sale and an expense in the same sentence
    (e.g. "I sold 5 dresses for 250k and spent 10k on fuel").
    Returns a list such as ["sale", "expense"], ["sale"], or ["other"].
    """
    prompt = f"""You are classifying a message from a small business owner in Nigeria.
The message may describe MORE THAN ONE thing at once — for example a sale AND an expense
in the same sentence. Identify every category that applies.

Reply with a comma-separated list using only these words, nothing else:
- sale — describes a sale, order, or something a customer bought
- expense — describes money they spent (supplies, transport, bills, fuel, etc.)
- inventory — adding/updating stock, marking items in or out of stock, adjusting quantities

If none apply, reply with: other

Examples:
"I sold 5 dresses for 250k and spent 10k on fuel" -> sale, expense
"Spent 5k on transport" -> expense
"Sold 2 bags of rice for 90k" -> sale
"Mark the pink skirt as out of stock" -> inventory
"How are you today" -> other

Message: "{text}"

Comma-separated list only:"""

    if re.search(r"(?im)^\s*TA-[A-Z0-9-]+\s*,", text) or "item sku" in text.lower():
        return ["inventory"]

    raw = _call_gemini(prompt, api_key, max_tokens=20, temperature=0.0)
    if not raw:
        return ["other"]

    r = raw.strip().lower()
    found = [intent for intent in ["sale", "expense", "inventory"] if intent in r]
    return found if found else ["other"]


def build_expenses_extraction_prompt(text: str, currency_symbol: str = "₦") -> str:
    return f"""You are an expense-logging assistant for a small business owner in Nigeria or another African market.
The message may describe ONE OR MORE separate expenses. Extract EACH expense as its own item.

Return ONLY a valid JSON array, nothing else, no markdown formatting:

[
  {{
    "description": "short description of what was bought/paid for",
    "amount": number,
    "category": "stock, transport, utilities, or other"
  }}
]

Rules:
- Convert "k" to thousands (5k = 5000)
- If the message has two or more distinct expenses, return one object per expense — do NOT merge them into one combined total
- Use {currency_symbol} context implicitly; return raw numbers only, no currency symbols
- If no clear expense amount is mentioned, return an empty array: []
- Do not add explanation or markdown code fences, return raw JSON only

MESSAGE:
{text}

JSON OUTPUT:"""


def extract_expenses_with_gemini(text: str, api_key: str, currency_symbol: str = "₦") -> List[Dict]:
    """Extract one or more expenses from a single message as a list."""
    prompt = build_expenses_extraction_prompt(text, currency_symbol)
    raw_text = _call_gemini(prompt, api_key, max_tokens=512, temperature=0.1)

    if raw_text is None:
        return []

    text_clean = raw_text.strip().replace("```json", "").replace("```", "").strip()
    start = text_clean.find("[")
    end = text_clean.rfind("]") + 1
    if start == -1 or end <= start:
        return []

    try:
        result = json.loads(text_clean[start:end])
        return [e for e in result if e.get("amount") and e.get("description")]
    except json.JSONDecodeError:
        return []


def build_inventory_extraction_prompt(text: str, currency_symbol: str = "₦") -> str:
    return f"""You are an inventory-logging assistant for a small business owner in Nigeria or another African market.
The message may describe ONE OR MORE inventory actions. Extract EACH action as its own item.

Return ONLY a valid JSON array, nothing else, no markdown formatting:

[
  {{
    "product_name": "name of the product",
    "action": "in_stock, out_of_stock, or set_stock",
    "quantity": number or null,
    "unit_price": number or null
  }}
]

Rules:
- "out_of_stock" means quantity should be treated as 0
- "set_stock" means a specific quantity was given (e.g. "we have 10 left")
- "in_stock" means the item is available but no specific quantity was given
- Use {currency_symbol} context implicitly; return raw numbers only, no currency symbols
- If no clear inventory action is mentioned, return an empty array: []
- Do not add explanation or markdown code fences, return raw JSON only

MESSAGE:
{text}

JSON OUTPUT:"""


def extract_inventory_with_gemini(text: str, api_key: str, currency_symbol: str = "₦") -> List[Dict]:
    """Extract one or more inventory actions from a single message as a list."""
    table_items = extract_inventory_table(text)
    if table_items:
        return table_items

    prompt = build_inventory_extraction_prompt(text, currency_symbol)
    raw_text = _call_gemini(prompt, api_key, max_tokens=512, temperature=0.1)

    if raw_text is None:
        return []

    text_clean = raw_text.strip().replace("```json", "").replace("```", "").strip()
    start = text_clean.find("[")
    end = text_clean.rfind("]") + 1
    if start == -1 or end <= start:
        return []

    try:
        result = json.loads(text_clean[start:end])
        return [i for i in result if i.get("product_name") and i.get("action")]
    except json.JSONDecodeError:
        return []


def extract_inventory_table(text: str) -> List[Dict]:
    """Parse comma-separated SKU rows reliably before asking the model."""
    items = []
    for line in text.splitlines():
        if not re.match(r"^\s*TA-[A-Z0-9-]+\s*,", line, re.IGNORECASE):
            continue
        columns = next(csv.reader([line], skipinitialspace=True), [])
        if len(columns) < 9:
            continue
        sku, product, category, size, color, quantity, _cost, retail, batch = [c.strip() for c in columns[:9]]
        try:
            stock_qty = int(quantity.replace(",", ""))
            unit_price = float(retail.replace(",", ""))
        except ValueError:
            continue
        items.append({
            "product_name": f"{product} - {size} - {color} ({sku})",
            "action": "set_stock",
            "quantity": stock_qty,
            "unit_price": unit_price,
        })
    return items


def chat_with_context(messages: List[Dict], shop_context: str, api_key: str, currency_symbol: str = "₦", business_context: str = "") -> str:
    """
    Generates a natural conversational reply given the full message history,
    so the AI Chat assistant actually remembers prior turns instead of
    treating every message as a one-off.
    """
    history_text = "\n".join([f"{'Seller' if m['role']=='user' else 'You'}: {m['text']}" for m in messages])

    prompt = f"""You are VeeVak, a friendly AI assistant helping a small business owner log their sales, expenses, and inventory through casual chat.
{shop_context}
{business_context}

Respond naturally and conversationally, like a helpful assistant who remembers the conversation so far. Keep replies SHORT (2-3 sentences max). Use {currency_symbol} for any amounts.
If the seller just told you about a sale, expense, or stock update, acknowledge it warmly and confirm what you understood. If their message is unclear, ask a brief clarifying question.

Conversation so far:
{history_text}

Your reply:"""

    raw = _call_gemini(prompt, api_key, max_tokens=200, temperature=0.4)
    return raw.strip() if raw else "Sorry, I had trouble responding. Please try again."


def extract_with_ollama(conversation_text: str, model: str = "llama3.1:8b", currency_symbol: str = "₦") -> Dict:
    """Extract order data using a local Ollama model (optional, for offline use)."""
    prompt = build_extraction_prompt(conversation_text, currency_symbol)

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.1, "top_p": 0.9}
            },
            timeout=60
        )
        if response.status_code == 200:
            raw_text = response.json()["response"]
            return parse_llm_response(raw_text)
        return {"has_order": False, "error": "Ollama request failed"}
    except requests.exceptions.ConnectionError:
        return {"has_order": False, "error": "Ollama not running. Start it with `ollama serve`."}