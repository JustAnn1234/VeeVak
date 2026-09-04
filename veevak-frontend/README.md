# VeeVak — Frontend

React + Vite single-page application for VeeVak. All UI lives in [`src/App.jsx`](src/App.jsx) — one file, no component library.

## Stack

- **React 18** (Vite)
- **Plain CSS** — inline styles + a generated `<style>` block; dark and light themes
- **No UI framework** — all components are hand-written

## Pages / views

| View | Description |
|---|---|
| **Home / Dashboard** | Today's revenue, expenses, and profit. Weekly trend chart. Top products. Recent sales feed. |
| **Log Sale** | Three modes: AI chat, paste-a-conversation, or upload a WhatsApp `.txt` export. |
| **Expenses** | Log and list business expenses. |
| **Inventory** | Add and track stock levels and unit prices. Low-stock warning. |
| **Customers** | All customers from sales history, with lifetime spend and order count. |
| **Reports** | Monthly revenue, expenses, and profit summary. |
| **Settings / Profile** | Language, currency, business name, theme, and profile photo. |
| **Floating Assistant** | Draggable AI chat bubble — available on every page. Supports voice input. |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
```

## Connecting to the API

The API base URL is set at the top of `src/App.jsx`:

```js
const API_BASE = "https://veevak-backend.onrender.com"
```

Change this to `http://localhost:8000` to develop against a local backend.

## Multi-language & multi-currency

Translation strings are defined in the `TRANSLATIONS` object inside `App.jsx`. Supported languages: English, Yoruba, Igbo, Hausa, Pidgin. Supported currencies: NGN (₦), USD ($), GBP (£).

## Themes

Two themes — `dark` and `light` — are defined in the `THEMES` object. The active theme is stored in `localStorage`.
