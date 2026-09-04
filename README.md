# VeeVak

**Business management for African informal commerce — built around WhatsApp.**

VeeVak helps small-business sellers in Nigeria (and across African markets) automatically log sales, track expenses, manage inventory, and understand their numbers — all through conversations they're already having on WhatsApp. A seller pastes or uploads a WhatsApp chat export; VeeVak parses it, extracts every order, and saves it. No manual data entry.

---

## What it does

| Feature | Description |
|---|---|
| **WhatsApp Chat Parsing** | Upload a `.txt` WhatsApp export. VeeVak identifies the seller, groups messages by customer, and extracts every order from the conversation thread. |
| **AI Order Extraction** | Uses Gemini to read conversations written in Nigerian Pidgin, code-switched English/Yoruba/Igbo/Hausa, and informal shorthand (`45k` → `₦45,000`). Extracts product names, quantities, prices, payment status, and order status. |
| **Paste-to-Analyse** | Paste a single conversation block directly into the app for instant extraction without uploading a file. |
| **Conversational Logging** | An in-app AI assistant lets sellers log sales, expenses, and stock updates in plain chat — "sold 3 dresses for 90k, spent 5k on transport." Both a sale and an expense are extracted from the same message. |
| **Expense Tracking** | Log business expenses manually or via the AI chat. Categorised as stock, transport, utilities, or other. |
| **Inventory Management** | Track stock levels and unit prices per product. Items are upserted by name. Supports CSV-style bulk uploads with SKU rows. Low-stock thresholds trigger alerts. |
| **Sales Dashboard** | Today's revenue, expenses, and profit at a glance. Weekly revenue trend chart. Top products by revenue. Recent sales feed. |
| **Reports** | Monthly revenue, expenses, and profit. |
| **Customer View** | All customers derived from sales history, with total spend and order count. |
| **Multi-shop Support** | One seller account can manage multiple shops. |
| **Auth** | Session-token authentication. Passwords hashed with SHA-256 + random salt. |

---

## Tech stack

### Backend
- **Python 3** / **FastAPI** — REST API
- **SQLite** (local dev) / **PostgreSQL** (production) — dual-database support via a single `db.py` abstraction layer
- **Google Gemini API** (`gemini-2.5-flash`) — order extraction, intent classification, expense/inventory parsing, conversational replies
- **Deployed on** Render

### Frontend
- **React** (Vite) — single-page app, no framework
- **Plain CSS** — no component library; dark/light theme toggle
- **Deployed on** Render (static site)

---

## Project structure

```
VeeVak/
├── main.py                  # FastAPI app — all routes
├── database/
│   └── db.py                # SQLite ↔ PostgreSQL abstraction, all DB queries
├── parser/
│   ├── whatsapp.py          # WhatsApp export parser (message parsing, owner detection, grouping)
│   ├── extractor.py         # Gemini prompts and response parsing (sales, expenses, inventory, chat)
│   └── config.py            # Shared config
├── models/                  # ML models (see roadmap below)
├── requirements.txt
├── runtime.txt
└── veevak-frontend/
    ├── src/
    │   └── App.jsx          # Entire React SPA (single file)
    └── package.json
```

---

## API reference

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new seller + create their first shop |
| `POST` | `/auth/login` | Log in, return session token + seller info + shops |
| `GET` | `/auth/me?token=` | Validate session, return seller profile |
| `PUT` | `/auth/profile?token=` | Update name and email |
| `POST` | `/onboard` | Legacy onboarding (no password) |
| `POST` | `/shops/add` | Add a shop to an existing seller |
| `GET` | `/shops/{seller_id}` | List all shops for a seller |
| `POST` | `/upload/whatsapp` | Upload a WhatsApp `.txt` export for extraction |
| `POST` | `/analyze/paste` | Analyse a pasted conversation block |
| `POST` | `/chat/conversation` | Conversational AI — send full message history, get reply + saved actions |
| `POST` | `/sales/quick` | Manually log a single sale |
| `GET` | `/sales/{shop_id}` | List recent sales |
| `POST` | `/expenses` | Log an expense |
| `GET` | `/expenses/{shop_id}` | List recent expenses |
| `POST` | `/inventory` | Add or update an inventory item |
| `GET` | `/inventory/{shop_id}` | List all inventory items |
| `GET` | `/analytics/{shop_id}` | Full analytics snapshot (revenue, expenses, profit, trends, top products) |

---

## Running locally

### Backend

```bash
# 1. Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variables
# Create a .env file:
echo "GEMINI_API_KEY=your_key_here" > .env

# 4. Start the server
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

SQLite is used automatically when `DATABASE_URL` is not set. The database file `veevak.db` is created on first run.

### Frontend

```bash
cd veevak-frontend
npm install
npm run dev
# App available at http://localhost:5173
```

The frontend talks to `https://veevak-backend.onrender.com` by default. To point it at your local backend, change `API_BASE` at the top of [`veevak-frontend/src/App.jsx`](veevak-frontend/src/App.jsx).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `DATABASE_URL` | No | PostgreSQL connection string. If omitted, SQLite is used. |

---

## ML roadmap

The following models are planned as genuine machine-learning additions — not API calls, but models trained and deployed on VeeVak's own transaction data.

### 1. Revenue forecasting — Prophet
Given a shop's historical daily sales, predict the next 7–14 days of revenue using Facebook Prophet (time-series decomposition with trend + seasonality). Output: a dotted forecast line extending beyond the current chart on the Reports page.

**Endpoint:** `GET /analytics/forecast/{shop_id}`  
**Library:** `prophet`

### 2. Anomaly detection — Isolation Forest
Flag statistically unusual spikes or drops in sales and expenses. Trained per-shop on rolling windows of daily totals. Surfaces alerts like *"Your expenses this week are 3× your normal weekly average"* or *"You had no sales for 4 days, which is unusual for your shop."*

**Endpoint:** `GET /analytics/anomalies/{shop_id}`  
**Library:** `scikit-learn` (`IsolationForest`)

### 3. Customer segmentation — K-Means / RFM
Cluster customers by Recency, Frequency, and Monetary value (RFM). Labels clusters meaningfully: *High-value regulars*, *One-time buyers*, *At-risk customers (inactive 30+ days)*. Shown as segment badges on the Customers page.

**Endpoint:** `GET /analytics/segments/{shop_id}`  
**Library:** `scikit-learn` (`KMeans`), `pandas`

### 4. Product cross-sell recommendations — Association Rules (Apriori)
Mine which products are frequently bought together from transaction history. Generates suggestions like *"Customers who bought the Emerald Satin Midi Dress also frequently bought the Basic Ribbed Crop Tops."* Surfaced when a seller logs a sale.

**Endpoint:** `GET /analytics/recommendations/{shop_id}?product=`  
**Library:** `mlxtend` (`apriori`, `association_rules`)

### 5. Customer sentiment — NaijaSenti classifier
Apply a sentiment classifier fine-tuned for Nigerian English (building on NaijaSenti) to customer messages parsed from WhatsApp exports. Flag negative-sentiment conversations for follow-up: *"3 of your recent customer conversations contained negative sentiment."*

**Endpoint:** Runs at parse time; flags stored alongside sales records  
**Library:** `transformers` (fine-tuned on NaijaSenti dataset)

---

## Deployment

Both services are deployed on **Render**.

| Service | Type | URL |
|---|---|---|
| Backend | Web service (Python) | `https://veevak-backend.onrender.com` |
| Frontend | Static site (React/Vite) | Render static hosting |

To deploy your own instance:
1. Fork this repository.
2. Create a Render Web Service pointed at the repo root. Set build command to `pip install -r requirements.txt` and start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Add `GEMINI_API_KEY` and `DATABASE_URL` as environment variables in the Render dashboard.
4. Create a separate Render Static Site for the frontend, with build command `npm install && npm run build` and publish directory `dist`, rooted at `veevak-frontend/`.

---

## Licence

MIT
