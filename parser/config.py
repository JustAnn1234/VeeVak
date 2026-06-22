# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# Centralized API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Centralized Model Targets
GEMINI_MODEL = "gemini-2.5-flash-lite"
OLLAMA_DEFAULT_MODEL = "llama3.1:8b"

# Centralized Currency Dictionary
CURRENCY_SYMBOLS = {
    "NGN": "₦", 
    "USD": "$", 
    "GBP": "£"
}

DEFAULT_CURRENCY = "NGN"

def get_currency_symbol(currency_code: str) -> str:
    """Safely retrieves a currency symbol, falling back to the standard default symbol if not found."""
    code_upper = (currency_code or DEFAULT_CURRENCY).upper()
    return CURRENCY_SYMBOLS.get(code_upper, "₦")