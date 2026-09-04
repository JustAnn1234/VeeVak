import json
import requests
from typing import Dict, List


def _call_gemini(prompt: str, api_key: str, max_tokens: int = 1024, temperature: float = 0.1):
    """Shared helper for calling Gemini and returning the raw text response, or None on failure."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens}
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
    return f"""You are a sales data extraction assistant for small businesses in Nigeria and other African markets.
Analyze this chat conversation and extract order information.

The conversation may contain:
- Nigerian Pidgin English (e.g., "how much be this", "I go pay", "send am")
- Code-switching between English and local languages
- Informal pricing (e.g., "45k" means 45,000)
- Abbreviations common in informal commerce
- Media placeholders like [image/voice note] which usually represent a payment screenshot — treat these as supporting evidence of payment, not as missing information

A conversation counts as having an order (has_order: true) whenever a customer agrees to buy one or more specific items, even if the word "order" never appears. Signs of a real order include: the customer naming items and quantities they want, the seller quoting a price and the customer accepting it, the customer saying things like "send it", "I'll take it", "sending payment now", or the seller confirming payment was received. You do not need an explicit confirmation phrase — agreement plus a quoted price is enough.

Extract the following and return ONLY valid JSON, nothing else, no markdown formatting:

{{
  "has_order": true or false,
  "customer_name": "name or null",
  "products": [
    {{
      "name": "product name",
      "quantity": number or null,
      "unit_price": number or null,
      "total_price": number or null
    }}
  ],
  "order_total": number or null,
  "payment_method": "on delivery, transfer, cash, or unknown",
  "payment_status": "paid, pending, or unknown",
  "order_status": "confirmed, inquiry, cancelled, or unclear",
  "notes": "any important context"
}}

Example: if a customer asks about a product, the seller quotes a price, the customer says "let me take one" and later says "just sent it" after the seller asks for payment, this IS a confirmed order with payment_status "paid", even though no one used the word "order".

Rules:
- Convert "k" to thousands (45k = 45000)
- Only set has_order to false if the conversation is purely an inquiry with no agreement to buy at all
- Use {currency_symbol} context implicitly; just return raw numbers, no currency symbols in the JSON
- Do not add explanation or markdown code fences, return raw JSON only

CONVERSATION:
{conversation}

JSON OUTPUT:"""


def parse_llm_response(raw_text: str) -> Dict:
    """Safely parse LLM JSON response, stripping markdown if present."""
    text = raw_text.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("{")
    end = text.rfind("}") + 1

    if start != -1 and end > start:
        json_str = text[start:end]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            return {"has_order": False, "error": f"JSON parse failed: {str(e)}", "raw": raw_text[:300]}

    return {"has_order": False, "error": "No JSON found in response", "raw": raw_text[:300]}


def extract_with_gemini(conversation_text: str, api_key: str, currency_symbol: str = "₦") -> Dict:
    """Extract order data using Gemini's free tier."""
    prompt = build_extraction_prompt(conversation_text, currency_symbol)
    raw_text = _call_gemini(prompt, api_key, max_tokens=1024, temperature=0.1)

    if raw_text is None:
        return {"has_order": False, "error": "Gemini API request failed"}

    result = parse_llm_response(raw_text)
    if not result.get("has_order") and "error" not in result:
        result["_debug_raw"] = raw_text[:500]
    return result


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