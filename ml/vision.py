import base64
import json
import requests
import os


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def extract_from_image(image_base64: str, currency_symbol: str = "₦") -> dict:
    """
    Send an image (base64) to Gemini Vision and extract sale information.
    Works with WhatsApp screenshots, Instagram DMs, handwritten receipts,
    POS receipts, and any other sales-related image.
    """
    prompt = f"""You are a sales data extraction assistant for small businesses in Nigeria and other African markets.

Analyze this image carefully. It may be:
- A WhatsApp or Instagram chat screenshot showing a sale
- A POS or payment receipt
- A handwritten sales record
- A bank transfer confirmation
- A voice note transcription
- Any other sales-related document

Extract all sale information and return ONLY valid JSON, nothing else, no markdown:

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
  "payment_method": "transfer, cash, pos, or unknown",
  "payment_status": "paid, pending, or unknown",
  "order_status": "confirmed, inquiry, or unclear",
  "channel": "whatsapp, instagram, facebook, tiktok, offline, or unknown",
  "notes": "any important context"
}}

Rules:
- Convert k to thousands (45k = 45000)
- If you see a payment confirmation (bank alert, transfer receipt), set payment_status to paid
- If the image shows just a product inquiry with no agreement to buy, set has_order to false
- Use {currency_symbol} context but return raw numbers only
- If you cannot extract any sale information, set has_order to false
- Return raw JSON only, no explanation"""

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_base64
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 1024
        }
    }

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
        json=payload,
        timeout=30
    )

    if response.status_code == 200:
        try:
            raw = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            clean = raw.strip().replace("```json", "").replace("```", "").strip()
            start = clean.find("{")
            end = clean.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(clean[start:end])
            return {"has_order": False, "error": "Could not parse response"}
        except Exception as e:
            return {"has_order": False, "error": str(e)}
    else:
        return {"has_order": False, "error": f"Gemini API error {response.status_code}"}


def extract_from_audio(audio_base64: str, mime_type: str = "audio/ogg", currency_symbol: str = "₦") -> dict:
    """
    Send a voice note (base64) to Gemini and extract sale information.
    Handles Nigerian English, Pidgin English, Yoruba, Hausa, Igbo.
    Supports OGG (WhatsApp), MP3, WAV, M4A formats.
    """
    prompt = f"""You are a sales assistant for small businesses in Nigeria.

Listen to this voice note carefully. The speaker may be talking in:
- English
- Nigerian Pidgin English (e.g. "I sell am", "dem pay", "e don pay")
- Yoruba, Hausa, or Igbo mixed with English
- Any combination of the above

They are describing a sale, expense, or business update.

Extract the information and return ONLY valid JSON, nothing else:

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
  "payment_method": "transfer, cash, pos, or unknown",
  "payment_status": "paid, pending, or unknown",
  "order_status": "confirmed or unclear",
  "channel": "whatsapp, instagram, facebook, offline, or unknown",
  "has_expense": false,
  "expense_description": null,
  "expense_amount": null,
  "transcription": "full transcription of what was said",
  "notes": "any important context"
}}

Rules:
- Convert k to thousands (e.g. "ten k" = 10000, "45k" = 45000)
- Pidgin "e don pay" or "dem don pay" means payment_status is paid
- If they describe spending money, set has_expense to true and fill expense fields
- Always include the full transcription in the transcription field
- Use {currency_symbol} context but return raw numbers only
- Return raw JSON only"""

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": audio_base64
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 1024
        }
    }

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
        json=payload,
        timeout=45
    )

    if response.status_code == 200:
        try:
            raw = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            clean = raw.strip().replace("```json", "").replace("```", "").strip()
            start = clean.find("{")
            end = clean.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(clean[start:end])
            return {"has_order": False, "error": "Could not parse response"}
        except Exception as e:
            return {"has_order": False, "error": str(e)}
    else:
        return {"has_order": False, "error": f"Gemini API error {response.status_code}"}