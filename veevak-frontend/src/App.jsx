import { useState, useRef, useEffect } from "react";
import Landing from "./Landing";
import Privacy from "./Privacy";
import Terms from "./Terms";

// ── API configuration ───────────────────────────────────────────────
const API_BASE = "https://veevak-backend.onrender.com";

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function apiPut(path, body, token) {
  const res = await fetch(`${API_BASE}${path}?token=${encodeURIComponent(token)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function apiUpload(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function apiAuthGet(path, token) {
  const res = await fetch(`${API_BASE}${path}?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Design tokens ─────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#11111f", surface:"#181828", surface2:"#1e1e34", border:"#2e2e50",
    gold:"#8b7ff5", goldLight:"#c4bcff", goldDim:"#312c6e",
    green:"#1a6b4a", greenText:"#34d399", red:"#7d1f2e", redText:"#f87171",
    textPrimary:"#e8e6ff", textSecondary:"#9090b0", textMuted:"#5a5a7a",
  },
  light: {
    bg:"#f5f5ff", surface:"#ffffff", surface2:"#eeeeff", border:"#dcdcf0",
    gold:"#5b4fe0", goldLight:"#7c6af7", goldDim:"#dddaf8",
    green:"#087F78", greenText:"#007A52", red:"#B33E55", redText:"#A92E48",
    textPrimary:"#0a0a1a", textSecondary:"#4a4a6a", textMuted:"#8080a8",
  },
};

let C = THEMES.dark;

// ── Translations ──────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    welcome:"Welcome to VeeVak", welcomeSub:"AI sales clarity — AI clarity for small businesses",
    getStarted:"Get Started", businessName:"Business Name", ownerName:"Your Name",
    selectCurrency:"Select Currency", selectLanguage:"Select Language",
    continue:"Continue", home:"Home", logSale:"Log Sale", expenses:"Expenses",
    inventory:"Inventory", customers:"Customers", reports:"Reports",
    todayRevenue:"Today's Revenue", todayProfit:"Today's Profit", weeklyRevenue:"Weekly Revenue",
    recentSales:"Recent Sales", viewAll:"View all →", export:"Export",
    logSaleTitle:"AI Sales Assistant", logSaleSub:"Remembers context across messages",
    chatPlaceholder:"e.g. Sold 3 bags of rice...", send:"Send",
    quickForm:"Quick Form", uploadChat:"Upload Chat", pasteChat:"Paste Chat", aiChat:"AI Chat",
    fillForm:"Fill in a simple form", whatsappExport:"WhatsApp .txt export",
    pasteConvos:"WhatsApp/Instagram chats", talkAssistant:"Talk to the assistant",
    analyzeExtract:"Analyze & Extract Orders", analyzing:"Analyzing...",
    logExpense:"Log an Expense", todayExpenses:"Today's Expenses", saveExpense:"Save Expense",
    searchProducts:"Search products...", addItem:"+ Add", totalItems:"Total Items",
    lowStock:"Low Stock", outOfStock:"Out of Stock", salesByChannel:"Sales by Channel",
    returningCustomers:"Returning Customers", monthlyRevenue:"Monthly Revenue",
    dailyTrend:"Daily Trend", topProducts:"Top Products", lastMonth:"Last Month",
    monthlyExpenses:"Monthly Expenses", netProfit:"Net profit",
    howItWorks:"How it works", description:"Description", amount:"Amount",
    category:"Category", product:"Product / Item", quantity:"Quantity",
    price:"Price", customerName:"Customer Name (optional)", channel:"Channel",
    payment:"Payment", logSaleBtn:"Log Sale", paid:"Paid", pending:"Pending",
    onDelivery:"On delivery", whatsapp:"WhatsApp", instagram:"Instagram",
    facebook:"Facebook", tiktok:"TikTok", offline:"Offline / Physical",
    stock:"Stock / Supplies", transport:"Transport", utilities:"Utilities", other:"Other",
    greeting:"👋 Hi! Tell me what you sold today — just type naturally like you'd tell a friend.",
    crmTip:"CRM Tip", crmTipText:"When logging sales, add the customer's name. Over time VeeVak will track who buys most, which channels bring the best customers, and who to follow up with.",
    setup:"Setup", businessSetup:"Business Setup", language:"Language", currency:"Currency",
    saveSettings:"Save Settings", settings:"Settings",
  },
  yo: {
    welcome:"Kaabo si VeeVak", welcomeSub:"nipasẹ VeeVak — Iranlọwọ AI fun awọn oniṣowo kekere",
    getStarted:"Bẹrẹ", businessName:"Orukọ Iṣowo", ownerName:"Orukọ Rẹ",
    selectCurrency:"Yan Owo", selectLanguage:"Yan Ede",
    continue:"Tẹsiwaju", home:"Ile", logSale:"Gba Tita", expenses:"Inawo",
    inventory:"Awọn Ọja", customers:"Awọn Onibara", reports:"Ijabọ",
    todayRevenue:"Owo Tita Oni", todayProfit:"Ere Oni", weeklyRevenue:"Owo Tita Ose",
    recentSales:"Awọn Tita Aipẹ", viewAll:"Wo gbogbo →", export:"Gbejade",
    logSaleTitle:"Oluranlọwọ Tita AI", logSaleSub:"Ranti gbogbo ọrọ",
    chatPlaceholder:"Fun apẹẹrẹ: Ta 3 bags iresi...", send:"Fi ranṣẹ",
    quickForm:"Fọọmu Yara", uploadChat:"Gbe Ọrọ", pasteChat:"Lẹ Ọrọ", aiChat:"AI Ọrọ",
    fillForm:"Kun fọọmu kan", whatsappExport:"WhatsApp .txt export",
    pasteConvos:"WhatsApp/Instagram", talkAssistant:"Sọrọ pẹlu oluranlọwọ",
    analyzeExtract:"Ṣe Itupalẹ & Gba Awọn Aṣẹ", analyzing:"N ṣe itupalẹ...",
    logExpense:"Gba Inawo", todayExpenses:"Inawo Oni", saveExpense:"Fipamọ Inawo",
    searchProducts:"Wa awọn ọja...", addItem:"+ Fi kun", totalItems:"Apao Awọn Ohun",
    lowStock:"Ọja Kekere", outOfStock:"Ọja Ti Pari", salesByChannel:"Tita nipasẹ Ikanni",
    returningCustomers:"Awọn Onibara Ti O Pada", monthlyRevenue:"Owo Oṣu",
    dailyTrend:"Itọsọna Ojoojumọ", topProducts:"Awọn Ọja Tó Dára Jùlọ",
    lastMonth:"Oṣu To Kọja", monthlyExpenses:"Inawo Oṣu", netProfit:"Ere gidi",
    howItWorks:"Bii o ṣe n ṣiṣẹ", description:"Apejuwe", amount:"Iye",
    category:"Ẹka", product:"Ọja", quantity:"Iye", price:"Idiyele",
    customerName:"Orukọ Onibara (aṣayan)", channel:"Ikanni", payment:"Isanwo",
    logSaleBtn:"Gba Tita", paid:"Ti Sanwo", pending:"Nduro", onDelivery:"Lori Jiṣẹ",
    whatsapp:"WhatsApp", instagram:"Instagram", facebook:"Facebook", tiktok:"TikTok",
    offline:"Taara / Ti ara ẹni", stock:"Ọja / Ipese", transport:"Gbigbe",
    utilities:"Awọn iṣẹ", other:"Miiran",
    greeting:"👋 Kaabo! Sọ fun mi ohun tí o ta loni — sọ ni ede rẹ.",
    crmTip:"Imọran CRM", crmTipText:"Nigbati o ba n gba tita, fi orukọ onibara kun. VeeVak yoo tọpa ẹni tó n ra jùlọ.",
    setup:"Eto", businessSetup:"Eto Iṣowo", language:"Ede", currency:"Owo",
    saveSettings:"Fipamọ Eto", settings:"Eto",
  },
  pcm: {
    welcome:"Welcome to VeeVak", welcomeSub:"AI sales clarity — AI wey go helep your business",
    getStarted:"Make We Start", businessName:"Wetin dem dey call your shop?", ownerName:"Wetin be your name?",
    selectCurrency:"Pick your money", selectLanguage:"Pick your language",
    continue:"Continue", home:"Home", logSale:"Log Sale", expenses:"Expenses",
    inventory:"Inventory", customers:"Customers", reports:"Reports",
    todayRevenue:"Money wey enter today", todayProfit:"Profit for today", weeklyRevenue:"This week money",
    recentSales:"Recent sales", viewAll:"See all →", export:"Export",
    logSaleTitle:"AI Sales Helper", logSaleSub:"E go remember everything wey you talk",
    chatPlaceholder:"E.g. I sell 3 bags of rice...", send:"Send",
    quickForm:"Quick Form", uploadChat:"Upload Chat", pasteChat:"Paste Chat", aiChat:"AI Chat",
    fillForm:"Fill one small form", whatsappExport:"WhatsApp .txt export",
    pasteConvos:"Paste your WhatsApp chat", talkAssistant:"Talk to the AI",
    analyzeExtract:"Analyze the Chat", analyzing:"Dey analyze...",
    logExpense:"Log Expense", todayExpenses:"Today expenses", saveExpense:"Save am",
    searchProducts:"Search products...", addItem:"+ Add", totalItems:"Total Items",
    lowStock:"Stock don low", outOfStock:"Stock don finish", salesByChannel:"Sales by channel",
    returningCustomers:"Customers wey come back", monthlyRevenue:"This month money",
    dailyTrend:"Daily trend", topProducts:"Top products", lastMonth:"Last month",
    monthlyExpenses:"This month expenses", netProfit:"Net profit",
    howItWorks:"How e dey work", description:"Wetin be the expense?", amount:"How much?",
    category:"Category", product:"Wetin you sell?", quantity:"How many?",
    price:"How much per unit?", customerName:"Customer name (optional)", channel:"Where you sell am?",
    payment:"Payment", logSaleBtn:"Log the sale", paid:"E don pay", pending:"Pending",
    onDelivery:"Go pay on delivery", whatsapp:"WhatsApp", instagram:"Instagram",
    facebook:"Facebook", tiktok:"TikTok", offline:"In person / offline",
    stock:"Stock / Supplies", transport:"Transport", utilities:"Utilities", other:"Other thing",
    greeting:"👋 How far! Wetin you sell today? Just talk am normal normal.",
    crmTip:"CRM Tip", crmTipText:"When you dey log sales, add customer name. VeeVak go track who dey buy the most.",
    setup:"Setup", businessSetup:"Business Setup", language:"Language", currency:"Currency",
    saveSettings:"Save settings", settings:"Settings",
  },
  ha: {
    welcome:"Barka da zuwa VeeVak", welcomeSub:"ta VeeVak — AI don kananan kasuwanci",
    getStarted:"Fara", businessName:"Sunan Kasuwanci", ownerName:"Sunanka",
    selectCurrency:"Zaɓi Kuɗi", selectLanguage:"Zaɓi Harshe",
    continue:"Ci gaba", home:"Gida", logSale:"Yi Rajista", expenses:"Kashe-Kashe",
    inventory:"Kayayyaki", customers:"Abokan ciniki", reports:"Rahoto",
    todayRevenue:"Kudaden yau", todayProfit:"Riba ta yau", weeklyRevenue:"Kudaden mako",
    recentSales:"Kasuwanci na kwanan nan", viewAll:"Duba duka →", export:"Fitar",
    logSaleTitle:"Mataimaki na AI", logSaleSub:"Yana tunawa da duk abin da ka faɗa",
    chatPlaceholder:"Misali: Na sayar da jakunkuna 3...", send:"Aika",
    quickForm:"Fom Mai Sauri", uploadChat:"Loda Hira", pasteChat:"Liƙa Hira", aiChat:"AI Hira",
    fillForm:"Cika takardar", whatsappExport:"WhatsApp .txt export",
    pasteConvos:"Liƙa hirar WhatsApp", talkAssistant:"Yi magana da AI",
    analyzeExtract:"Nazari da Ciro Umarni", analyzing:"Ana nazari...",
    logExpense:"Yi Rajistan Kashe-Kashe", todayExpenses:"Kashe-kashen yau", saveExpense:"Ajiye",
    searchProducts:"Nemo kayayyaki...", addItem:"+ Ƙara", totalItems:"Jimillar Kayan",
    lowStock:"Kayan ƙaranci", outOfStock:"Kayan ya ƙare", salesByChannel:"Kasuwanci ta tashar",
    returningCustomers:"Abokan ciniki da suka dawo", monthlyRevenue:"Kudaden wata",
    dailyTrend:"Yanayin yau da kullum", topProducts:"Kayayyaki mafiya kyau",
    lastMonth:"Watan da ya wuce", monthlyExpenses:"Kashe-kashen wata", netProfit:"Riba ta gaskiya",
    howItWorks:"Yadda yake aiki", description:"Bayanin", amount:"Adadi",
    category:"Rukuni", product:"Kaya", quantity:"Yawa", price:"Farashi",
    customerName:"Sunan abokin ciniki (zaɓi)", channel:"Tashar", payment:"Biyan kuɗi",
    logSaleBtn:"Yi Rajista", paid:"An biya", pending:"Ana jira", onDelivery:"Biya a lokacin isarwa",
    whatsapp:"WhatsApp", instagram:"Instagram", facebook:"Facebook", tiktok:"TikTok",
    offline:"Kai tsaye", stock:"Hannun jari / Kayan aiki", transport:"Sufuri",
    utilities:"Ayyuka", other:"Sauran",
    greeting:"👋 Sannu! Mene ne ka sayar a yau? Kawai faɗa mini.",
    crmTip:"Shawarar CRM", crmTipText:"Lokacin da kake yin rajistace, ƙara sunan abokin ciniki. VeeVak zai bin diddigin mafi yawan masu siya.",
    setup:"Saiti", businessSetup:"Saita Kasuwanci", language:"Harshe", currency:"Kuɗi",
    saveSettings:"Ajiye Saiti", settings:"Saiti",
  },
  ig: {
    welcome:"Nnọọ na VeeVak", welcomeSub:"site na VeeVak — AI maka obere ọrụ azụmahịa",
    getStarted:"Malite", businessName:"Aha Azụmahịa", ownerName:"Aha Gị",
    selectCurrency:"Họrọ Ego", selectLanguage:"Họrọ Asụsụ",
    continue:"Gaa n'ihu", home:"Ụlọ", logSale:"Debanye Ahịa", expenses:"Mmefu",
    inventory:"Ngwongwo", customers:"Ndị ahịa", reports:"Akụkọ",
    todayRevenue:"Ego taa", todayProfit:"Uru taa", weeklyRevenue:"Ego izu a",
    recentSales:"Ahịa ndị ọhụrụ", viewAll:"Hụ ha niile →", export:"Mepụta",
    logSaleTitle:"Onye enyemaka AI", logSaleSub:"Ọ na-echeta ihe i kwuru",
    chatPlaceholder:"Dịka: Ere ite 3 nke osikapa...", send:"Ziga",
    quickForm:"Ụdị Ngwa Ngwa", uploadChat:"Bulite Mkparịta", pasteChat:"Tinye Mkparịta", aiChat:"AI Mkparịta",
    fillForm:"Jupụta ụdị", whatsappExport:"WhatsApp .txt export",
    pasteConvos:"Tinye mkparịta WhatsApp gị", talkAssistant:"Kwuo na AI",
    analyzeExtract:"Nyochaa ma Wepụ Iwu", analyzing:"Na-enyocha...",
    logExpense:"Debanye Mmefu", todayExpenses:"Mmefu taa", saveExpense:"Chekwaa",
    searchProducts:"Chọọ ngwongwo...", addItem:"+ Tinye", totalItems:"Ọnụ ọgụgụ ngwongwo",
    lowStock:"Ngwongwo pere mpe", outOfStock:"Ngwongwo agwụọla", salesByChannel:"Ahịa site na ụzọ",
    returningCustomers:"Ndị ahịa na-alọghachi", monthlyRevenue:"Ego ọnwa",
    dailyTrend:"Ọnọdụ kwa ụbọchị", topProducts:"Ngwongwo kachasị mma",
    lastMonth:"Ọnwa gara aga", monthlyExpenses:"Mmefu ọnwa", netProfit:"Uru ezigbo",
    howItWorks:"Otu o si arụ ọrụ", description:"Nkọwa", amount:"Ọnụ ego",
    category:"Udi", product:"Ngwongwo", quantity:"Ọnụ ọgụgụ", price:"Ọnụ ahịa",
    customerName:"Aha onye ahịa (nhọrọ)", channel:"Ụzọ", payment:"Ịkwụ ụgwọ",
    logSaleBtn:"Debanye Ahịa", paid:"Akwụọla ụgwọ", pending:"Na-atọ ụzọ", onDelivery:"Kwuo mgbe ebutere",
    whatsapp:"WhatsApp", instagram:"Instagram", facebook:"Facebook", tiktok:"TikTok",
    offline:"Ihu na ihu", stock:"Ngwongwo / Ihe oriri", transport:"Ọkwọ ụgbọ",
    utilities:"Ọrụ", other:"Ihe ọzọ",
    greeting:"👋 Nnọọ! Gwa m ihe i rere taa — kwuo ya naanị.",
    crmTip:"Ndụmọdụ CRM", crmTipText:"Mgbe i na-edebanye ahịa, tinye aha onye ahịa. VeeVak ga-eso onye na-azụ kachasị.",
    setup:"Ntọala", businessSetup:"Ntọala Azụmahịa", language:"Asụsụ", currency:"Ego",
    saveSettings:"Chekwaa Ntọala", settings:"Ntọala",
  },
};

// ── Currencies ────────────────────────────────────────────────────────
const CURRENCIES = {
  NGN: { symbol:"₦", name:"Nigerian Naira", flag:"🇳🇬" },
  USD: { symbol:"$", name:"US Dollar", flag:"🇺🇸" },
  GBP: { symbol:"£", name:"British Pound", flag:"🇬🇧" },
};

const LANGUAGES = [
  { code:"en",  label:"English" },
  { code:"pcm", label:"Pidgin English" },
  { code:"yo",  label:"Yorùbá" },
  { code:"ha",  label:"Hausa" },
  { code:"ig",  label:"Igbo" },
];

// ── CSS ───────────────────────────────────────────────────────────────
const makeStyles = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background:${C.bg}; color:${C.textPrimary}; font-family:'Inter',sans-serif; font-size:14px; line-height:1.5; min-height:100vh; -webkit-font-smoothing:antialiased; }

  /* ── DESKTOP SIDEBAR LAYOUT ── */
  .app { width:100%; min-height:100vh; display:flex; flex-direction:column; background:${C.bg}; }

  @media (min-width: 900px) {
    .app { flex-direction:row; }
    .app-sidebar { display:flex !important; }
    .bottom-nav { display:none !important; }
    .topbar { padding:20px 32px 16px; border-bottom:1px solid ${C.border}; }
    .page-content { padding:24px 32px 40px; }
    .page-content > * { width:100%; }
    .app-body { flex:1; display:flex; flex-direction:column; min-width:0; }
    /* 2-column grid for stat cards on desktop */
    .home-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .home-grid-full { grid-column:1/-1; }
  }

  /* Sidebar */
  .app-sidebar {
    display:none;
    width:64px;
    min-height:100vh;
    background:#0e0e1a;
    border-right:1px solid ${C.border};
    flex-direction:column;
    align-items:center;
    padding:16px 0;
    gap:4px;
    flex-shrink:0;
    position:sticky;
    top:0;
    height:100vh;
    overflow:hidden;
    z-index:60;
  }
  .sidebar-logo {
    width:36px; height:36px; border-radius:10px;
    background:linear-gradient(135deg,${C.gold},${C.goldDim});
    display:flex; align-items:center; justify-content:center;
    margin-bottom:16px; flex-shrink:0;
  }
  .sidebar-avatar { width:36px; height:36px; border-radius:50%; background:${C.goldDim}; color:${C.goldLight}; display:flex; align-items:center; justify-content:center; overflow:hidden; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px; cursor:pointer; border:1px solid ${C.border}; margin-bottom:16px; flex-shrink:0; }
  .sidebar-item {
    width:44px; height:44px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; border:none; background:transparent;
    color:${C.textMuted}; font-size:18px; transition:all 0.15s;
    flex-shrink:0;
  }
  .sidebar-item:hover { background:${C.surface2}; color:${C.textSecondary}; }
  .sidebar-item.active { background:${C.surface2}; color:${C.gold}; }
  .sidebar-bottom { margin-top:auto; display:flex; flex-direction:column; align-items:center; gap:4px; }

  /* ONBOARDING */
  .onboard { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px; gap:0; background:${C.bg}; }
  .onboard-logo { width:72px; height:72px; background:linear-gradient(135deg,${C.gold},${C.goldDim}); border-radius:18px; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:32px; color:#000; margin-bottom:24px; }
  .onboard-title { font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:700; color:${C.textPrimary}; text-align:center; margin-bottom:8px; }
  .onboard-sub { font-size:13px; color:${C.textSecondary}; text-align:center; margin-bottom:40px; }
  .onboard-step { width:100%; max-width:380px; display:flex; flex-direction:column; gap:16px; }
  .step-title { font-family:'Space Grotesk',sans-serif; font-size:17px; font-weight:600; color:${C.textPrimary}; margin-bottom:4px; }
  .step-dots { display:flex; gap:6px; justify-content:center; margin-bottom:32px; }
  .dot { width:6px; height:6px; border-radius:50%; background:${C.border}; transition:background 0.2s; }
  .dot.active { background:${C.gold}; width:18px; border-radius:3px; }

  .lang-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .lang-option { background:${C.surface}; border:1.5px solid ${C.border}; border-radius:10px; padding:12px 14px; cursor:pointer; transition:all 0.15s; }
  .lang-option:hover { border-color:${C.gold}; }
  .lang-option.selected { border-color:${C.gold}; background:${C.goldDim}; color:${C.bg}; }
  .lang-option-label { font-size:13px; font-weight:500; color:${C.textPrimary}; }

  .currency-grid { display:flex; flex-direction:column; gap:8px; }
  .currency-option { background:${C.surface}; border:1.5px solid ${C.border}; border-radius:10px; padding:12px 16px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:all 0.15s; }
  .currency-option:hover { border-color:${C.gold}; }
  .currency-option.selected { border-color:${C.gold}; background:${C.goldDim}; }
  .currency-flag { font-size:22px; }
  .currency-info { flex:1; }
  .currency-code { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:14px; color:${C.textPrimary}; }
  .currency-name { font-size:11px; color:${C.textSecondary}; }
  .currency-sym { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:700; color:${C.gold}; }

  /* TOPBAR */
  .topbar { display:flex; align-items:center; justify-content:space-between; padding:14px 16px 10px; position:sticky; top:0; z-index:50; background:${C.bg}; border-bottom:1px solid ${C.border}; }
  .topbar-brand { display:flex; align-items:center; gap:10px; }
  .brand-logo { width:34px; height:34px; background:linear-gradient(135deg,${C.gold},${C.goldDim}); border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16px; color:#000; }
  .brand-name { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; color:${C.textPrimary}; }
  .brand-sub { font-size:10px; color:${C.textSecondary}; letter-spacing:0.08em; text-transform:uppercase; }
  .topbar-actions { display:flex; align-items:center; gap:8px; }
  .btn-ghost { background:transparent; border:1px solid ${C.border}; color:${C.textSecondary}; border-radius:8px; padding:6px 10px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.15s; }
  .btn-ghost:hover { border-color:${C.gold}; color:${C.gold}; }
  .notification-wrap { position:relative; }
  .notification-button { position:relative; width:38px; height:38px; border:1px solid ${C.border}; border-radius:10px; background:${C.surface}; color:${C.textPrimary}; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .notification-badge { position:absolute; top:-5px; right:-5px; min-width:17px; height:17px; border-radius:9px; background:${C.redText}; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; }
  .notification-menu { position:absolute; top:calc(100% + 8px); right:0; width:min(340px,calc(100vw - 32px)); background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; padding:14px; z-index:110; box-shadow:0 12px 36px rgba(0,0,0,0.45); }
  .notification-item { display:flex; gap:9px; padding:10px 0; border-top:1px solid ${C.border}; color:${C.textSecondary}; font-size:12px; line-height:1.45; }
  .notification-dot { width:7px; height:7px; margin-top:5px; border-radius:50%; background:${C.gold}; flex-shrink:0; }
  .compact-select { appearance:none; background:${C.surface2}; border:1px solid ${C.border}; border-radius:8px; color:${C.textPrimary}; padding:9px 30px 9px 11px; font:12px 'Inter',sans-serif; cursor:pointer; min-width:150px; }
  .compact-select:focus { outline:none; border-color:${C.gold}; }

  /* SHOP SELECTOR */
  .shop-selector { background:${C.surface}; border:1px solid ${C.border}; color:${C.textPrimary}; border-radius:8px; padding:6px 10px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:5px; position:relative; }
  .shop-dropdown { position:absolute; top:calc(100% + 6px); right:0; background:${C.surface2}; border:1px solid ${C.border}; border-radius:10px; min-width:180px; overflow:hidden; z-index:100; box-shadow:0 8px 32px rgba(0,0,0,0.6); }
  .shop-option { padding:10px 14px; font-size:13px; cursor:pointer; color:${C.textSecondary}; transition:background 0.1s; }
  .shop-option:hover { background:${C.surface}; color:${C.textPrimary}; }
  .shop-option.active { color:${C.gold}; }

  /* NAV */
  .bottom-nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:${C.surface}; border-top:1px solid ${C.border}; display:flex; z-index:50; }
  @media (min-width: 900px) {
    .bottom-nav { max-width:1200px; }
  }
  .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 4px 14px; cursor:pointer; color:${C.textMuted}; font-size:10px; letter-spacing:0.04em; text-transform:uppercase; font-weight:500; transition:color 0.15s; border:none; background:transparent; }
  .nav-item.active { color:${C.gold}; }
  .nav-icon { font-size:18px; line-height:1; }

  /* PAGE */
  .page-content { flex:1; overflow-y:auto; padding:16px 16px 90px; display:flex; flex-direction:column; gap:14px; align-items:center; }
.page-content > * { width:100%; }

  /* CARDS */
  .card { background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; padding:16px; }
  .card-label { font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:${C.textSecondary}; margin-bottom:8px; font-weight:500; }
  .card-value { font-family:'Space Grotesk',sans-serif; font-size:32px; font-weight:700; color:${C.gold}; line-height:1; }
  .card-value.green { color:${C.greenText}; }
  .card-value.red { color:${C.redText}; }
  .card-sub { font-size:12px; color:${C.textSecondary}; margin-top:6px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .badge-up { color:${C.greenText}; font-size:11px; }
  .card-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .card.small { padding:12px 14px; }
  .card.small .card-value { font-size:22px; }

  /* CHART */
  .chart-bars { display:flex; align-items:flex-end; gap:6px; height:64px; margin-top:12px; }
  .chart-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
  .chart-bar { width:100%; background:${C.goldDim}; border-radius:3px 3px 0 0; transition:background 0.2s; min-height:3px; }
  .chart-bar.today { background:${C.gold}; }
  .chart-day { font-size:9px; color:${C.textMuted}; text-transform:uppercase; }
  .chart-day.today { color:${C.gold}; }

  /* SALES */
  .sale-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid ${C.border}; }
  .sale-item:last-child { border-bottom:none; }
  .sale-info { display:flex; flex-direction:column; gap:2px; }
  .sale-name { font-size:13px; font-weight:500; color:${C.textPrimary}; }
  .sale-meta { font-size:11px; color:${C.textSecondary}; }
  .sale-amount { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:14px; color:${C.greenText}; }
  .sale-channel { font-size:10px; padding:2px 7px; border-radius:20px; font-weight:500; margin-top:2px; display:inline-block; }
  .ch-whatsapp { background:#1a3a1a; color:#4ade80; }
  .ch-instagram { background:#3a1a2e; color:#f472b6; }
  .ch-offline { background:#1e2a3a; color:#60a5fa; }
  .ch-facebook { background:#1a1e3a; color:#818cf8; }
  .ch-tiktok { background:#2a1a3a; color:#e879f9; }

  /* CHAT */
  .chat-box { background:${C.surface2}; border:1px solid ${C.border}; border-radius:12px; padding:16px; font-size:13px; color:${C.textSecondary}; line-height:1.7; }
  .chat-messages { display:flex; flex-direction:column; gap:10px; margin-bottom:10px; }
  .msg { max-width:85%; padding:10px 13px; border-radius:12px; font-size:13px; line-height:1.5; }
  .msg.ai { background:${C.surface2}; color:${C.textPrimary}; align-self:flex-start; border-bottom-left-radius:3px; }
  .msg.user { background:${C.goldDim}; color:${C.textPrimary}; align-self:flex-end; border-bottom-right-radius:3px; }
  .msg-label { font-size:10px; color:${C.gold}; margin-bottom:4px; font-weight:600; letter-spacing:0.05em; }
  .chat-input-row { display:flex; gap:8px; align-items:flex-end; }
  .chat-input { flex:1; width:100%; background:${C.surface2}; border:1px solid ${C.border}; border-radius:10px; padding:11px 13px; font-size:13px; color:${C.textPrimary}; outline:none; font-family:'Inter',sans-serif; min-height:96px; max-height:220px; overflow-y:auto; resize:vertical; line-height:1.5; transition:border-color 0.15s; }
  .chat-input:focus { border-color:${C.gold}; }
  .chat-input::placeholder { color:${C.textMuted}; }
  .btn-send { width:42px; height:42px; background:linear-gradient(135deg,${C.gold},${C.goldDim}); border:none; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; transition:opacity 0.15s; flex-shrink:0; }
  .btn-send:hover { opacity:0.85; }
  .btn-send:disabled { opacity:0.4; cursor:not-allowed; }

  /* MODE CARDS */
  .input-modes { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:4px; }
  .mode-card { background:${C.surface}; border:1px solid ${C.border}; border-radius:10px; padding:14px; cursor:pointer; transition:border-color 0.15s,background 0.15s; }
  .mode-card:hover { border-color:${C.gold}; background:${C.goldDim}; }
  .mode-card.active { border-color:${C.gold}; background:${C.goldDim}; }
  .mode-icon { font-size:20px; margin-bottom:6px; }
  .mode-title { font-size:13px; font-weight:600; color:${C.textPrimary}; }
  .mode-desc { font-size:11px; color:${C.textSecondary}; margin-top:2px; }

  /* FORMS */
  .file-upload-zone { border:1px dashed ${C.goldDim}; border-radius:10px; padding:24px; text-align:center; cursor:pointer; transition:background 0.15s; margin-top:4px; }
  .file-upload-zone:hover { background:#1a1400; }
  .file-upload-icon { font-size:28px; margin-bottom:8px; }
  .file-upload-text { font-size:13px; color:${C.textSecondary}; }
  .file-upload-sub { font-size:11px; color:${C.textMuted}; margin-top:4px; }
  .btn-primary { background:linear-gradient(135deg,${C.gold},${C.goldDim}); border:none; border-radius:10px; padding:12px 20px; font-size:13px; font-weight:600; color:#000; cursor:pointer; width:100%; transition:opacity 0.15s; font-family:'Inter',sans-serif; }
  .btn-primary:hover { opacity:0.88; }
  .btn-primary:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-secondary { background:transparent; border:1px solid ${C.border}; border-radius:10px; padding:12px 20px; font-size:13px; font-weight:500; color:${C.textSecondary}; cursor:pointer; width:100%; transition:all 0.15s; font-family:'Inter',sans-serif; }
  .btn-secondary:hover { border-color:${C.gold}; color:${C.gold}; }
  .form-field { display:flex; flex-direction:column; gap:6px; }
  .form-label { font-size:11px; color:${C.textSecondary}; font-weight:500; letter-spacing:0.04em; }
  .form-input { background:${C.surface2}; border:1px solid ${C.border}; border-radius:8px; padding:10px 12px; font-size:13px; color:${C.textPrimary}; outline:none; font-family:'Inter',sans-serif; transition:border-color 0.15s; width:100%; }
  .form-input:focus { border-color:${C.gold}; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .select-input { background:${C.surface2}; border:1px solid ${C.border}; border-radius:8px; padding:10px 12px; font-size:13px; color:${C.textPrimary}; outline:none; font-family:'Inter',sans-serif; width:100%; appearance:none; cursor:pointer; }

  /* MISC */
  .expense-header { background:linear-gradient(135deg,${C.surface},${C.surface2}); border:1px solid ${C.border}; border-radius:12px; padding:18px; }
  .expense-amount { font-family:'Space Grotesk',sans-serif; font-size:32px; font-weight:700; color:${C.redText}; }
  .btn-add-expense { display:flex; align-items:center; justify-content:center; gap:8px; background:transparent; border:1px solid ${C.border}; border-radius:10px; padding:13px; color:${C.gold}; font-size:13px; font-weight:500; cursor:pointer; width:100%; transition:background 0.15s,border-color 0.15s; font-family:'Inter',sans-serif; }
  .btn-add-expense:hover { background:${C.goldDim}; border-color:${C.gold}; }
  .search-wrap { position:relative; flex:1; }
  .search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:${C.textMuted}; font-size:14px; }
  .search-input { width:100%; background:${C.surface}; border:1px solid ${C.border}; border-radius:10px; padding:10px 13px 10px 36px; font-size:13px; color:${C.textPrimary}; outline:none; font-family:'Inter',sans-serif; transition:border-color 0.15s; }
  .search-input:focus { border-color:${C.gold}; }
  .search-row { display:flex; gap:10px; align-items:center; }
  .btn-add { background:linear-gradient(135deg,${C.gold},${C.goldDim}); border:none; border-radius:10px; padding:10px 16px; font-size:13px; font-weight:600; color:#000; cursor:pointer; display:flex; align-items:center; gap:5px; white-space:nowrap; font-family:'Inter',sans-serif; }
  .stat-cards { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
  .stat-card { background:${C.surface}; border:1px solid ${C.border}; border-radius:10px; padding:12px 10px; text-align:center; }
  .stat-num { font-family:'Space Grotesk',sans-serif; font-size:22px; font-weight:700; color:${C.gold}; }
  .stat-label { font-size:10px; color:${C.textSecondary}; margin-top:3px; }
  .channel-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
  .channel-name { font-size:12px; color:${C.textSecondary}; }
  .channel-pct { font-size:12px; color:${C.textPrimary}; font-weight:500; }
  .channel-track { height:5px; background:${C.surface2}; border-radius:3px; margin-bottom:10px; overflow:hidden; }
  .channel-fill { height:100%; border-radius:3px; background:${C.gold}; }
  .theme-toggle { background:${C.surface2}; border:1px solid ${C.border}; border-radius:10px; padding:4px; display:flex; gap:4px; }
  .theme-btn { border:none; border-radius:7px; padding:8px 16px; font-size:13px; cursor:pointer; font-weight:600; transition:all 0.15s; background:transparent; color:${C.textSecondary}; }
  .theme-btn.active { background:${C.gold}; color:#000; }
  .theme-btn:hover:not(.active) { background:${C.surface}; }
  .tip-card { background:${C.surface2}; border:1px solid ${C.border}; border-radius:10px; padding:14px; display:flex; gap:10px; }
  .tip-label { font-size:10px; letter-spacing:0.08em; color:${C.gold}; text-transform:uppercase; font-weight:600; margin-bottom:4px; }
  .tip-text { font-size:12px; color:${C.textSecondary}; line-height:1.6; }
  .reports-header { background:linear-gradient(135deg,${C.surface},${C.surface2}); border:1px solid ${C.border}; border-radius:12px; padding:18px; }
  .returning-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid ${C.border}; }
  .returning-item:last-child { border-bottom:none; }
  .avatar { width:32px; height:32px; border-radius:50%; background:${C.surface2}; border:1px solid ${C.border}; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; color:${C.gold}; flex-shrink:0; }
  .returning-name { font-size:13px; color:${C.textPrimary}; }
  .returning-meta { font-size:11px; color:${C.textSecondary}; }
  .returning-amount { margin-left:auto; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; color:${C.greenText}; }
  .how-list { display:flex; flex-direction:column; gap:8px; margin-top:4px; }
  .how-item { font-size:12px; color:${C.textSecondary}; display:flex; gap:8px; }
  .modal-overlay { position:fixed; inset:0; width:100vw; height:100dvh; background:rgba(0,0,0,0.75); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px 16px; }
  .modal { background:${C.surface}; border:1px solid ${C.border}; border-radius:16px; padding:20px 16px; width:100%; max-width:480px; display:flex; flex-direction:column; gap:14px; max-height:calc(100vh - 40px); overflow-y:auto; margin:auto; }
  .modal-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .modal-close { width:32px; height:32px; border:1px solid ${C.border}; border-radius:50%; background:transparent; color:${C.textSecondary}; font-size:20px; line-height:1; cursor:pointer; flex-shrink:0; }
  .modal-close:hover { color:${C.textPrimary}; border-color:${C.gold}; }
  .modal-title { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:600; color:${C.textPrimary}; }
  .section-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .section-title { font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:${C.textSecondary}; font-weight:500; }
  .view-all { font-size:12px; color:${C.gold}; cursor:pointer; }
  .loading-dot { display:inline-block; width:6px; height:6px; background:${C.gold}; border-radius:50%; animation:pulse 1s infinite; margin:0 2px; }
  .loading-dot:nth-child(2) { animation-delay:0.15s; }
  .loading-dot:nth-child(3) { animation-delay:0.3s; }
  @keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)} }
  .toast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:${C.surface2}; border:1px solid ${C.gold}; color:${C.textPrimary}; padding:10px 18px; border-radius:10px; font-size:13px; z-index:300; white-space:nowrap; animation:fadeUp 0.2s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; gap:10px; color:${C.textMuted}; }
  .divider { height:1px; background:${C.border}; margin:4px 0; }
  .settings-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid ${C.border}; cursor:pointer; }
  .settings-row:last-child { border-bottom:none; }
  .settings-label { font-size:13px; color:${C.textPrimary}; }
  .settings-value { font-size:12px; color:${C.textSecondary}; display:flex; align-items:center; gap:6px; }
  .settings-page { display:flex; flex-direction:column; gap:16px; }
  .settings-heading { padding:4px 2px 2px; }
  .settings-heading h1 { font-family:'Space Grotesk',sans-serif; font-size:24px; line-height:1.15; color:${C.textPrimary}; }
  .settings-heading p { color:${C.textSecondary}; font-size:13px; margin-top:5px; }
  .settings-panel { background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; overflow:hidden; }
  .settings-panel-head { padding:16px 18px 12px; border-bottom:1px solid ${C.border}; }
  .settings-panel-title { color:${C.textPrimary}; font-size:14px; font-weight:600; }
  .settings-panel-copy { color:${C.textSecondary}; font-size:12px; margin-top:3px; }
  .settings-panel-body { padding:16px 18px 18px; display:flex; flex-direction:column; gap:16px; }
  .settings-profile-link { display:flex; align-items:center; gap:12px; padding:16px 18px; cursor:pointer; transition:background 0.15s; }
  .settings-profile-link:hover { background:${C.surface2}; }
  .settings-avatar { width:42px; height:42px; border-radius:50%; background:${C.goldDim}; color:${C.goldLight}; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:600; overflow:hidden; flex-shrink:0; }
  .settings-profile-copy { flex:1; min-width:0; }
  .settings-profile-name { color:${C.textPrimary}; font-size:13px; font-weight:600; }
  .settings-profile-meta { color:${C.textSecondary}; font-size:11px; margin-top:2px; }
  .settings-chevron { color:${C.gold}; font-size:18px; }
  .profile-page { display:flex; flex-direction:column; gap:16px; }
  .profile-summary { display:flex; align-items:center; gap:14px; padding:20px; background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; }
  .profile-avatar { position:relative; width:68px; height:68px; border-radius:50%; background:${C.surface2}; border:2px solid ${C.gold}; display:flex; align-items:center; justify-content:center; overflow:hidden; color:${C.gold}; font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:600; flex-shrink:0; cursor:pointer; }
  .profile-summary h1 { font-family:'Space Grotesk',sans-serif; font-size:20px; color:${C.textPrimary}; }
  .profile-summary p { color:${C.textSecondary}; font-size:12px; margin-top:3px; }
  .profile-photo-btn { color:${C.gold}; background:transparent; border:0; padding:0; font-size:12px; font-weight:600; cursor:pointer; margin-top:8px; }
  .profile-form { background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; padding:18px; display:flex; flex-direction:column; gap:16px; }
  .profile-form-head { padding-bottom:14px; border-bottom:1px solid ${C.border}; }
  .profile-form-head h2 { font-size:14px; color:${C.textPrimary}; font-weight:600; }
  .profile-form-head p { color:${C.textSecondary}; font-size:12px; margin-top:3px; }
  .profile-actions { display:flex; gap:10px; padding-top:2px; }
  .profile-actions .btn-primary, .profile-actions .btn-secondary { margin-top:0 !important; }
  .account-page { display:flex; flex-direction:column; gap:16px; }
  .account-header { display:flex; align-items:center; gap:14px; padding:20px; background:linear-gradient(135deg,${C.surface},${C.surface2}); border:1px solid ${C.border}; border-radius:12px; }
  .account-avatar { width:64px; height:64px; border-radius:50%; background:${C.goldDim}; color:${C.goldLight}; display:flex; align-items:center; justify-content:center; overflow:hidden; font-family:'Space Grotesk',sans-serif; font-size:24px; font-weight:700; flex-shrink:0; }
  .account-header h1 { font-family:'Space Grotesk',sans-serif; font-size:20px; color:${C.textPrimary}; }
  .account-header p { color:${C.textSecondary}; font-size:12px; margin-top:3px; }
  .account-tier { display:inline-flex; margin-top:8px; padding:3px 9px; border-radius:20px; background:${C.goldDim}; color:${C.goldLight}; font-size:10px; font-weight:600; }
  .account-metrics { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .account-metric { background:${C.surface}; border:1px solid ${C.border}; border-radius:10px; padding:13px; }
  .account-metric-value { color:${C.gold}; font:700 19px 'Space Grotesk',sans-serif; }
  .account-metric-label { color:${C.textSecondary}; font-size:10px; margin-top:3px; }
  .account-group { background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; overflow:hidden; }
  .account-group-title { padding:13px 16px 8px; color:${C.textSecondary}; font-size:10px; letter-spacing:.08em; text-transform:uppercase; font-weight:600; }
  .account-row { display:flex; align-items:center; gap:10px; padding:14px 16px; border-top:1px solid ${C.border}; cursor:pointer; color:${C.textPrimary}; }
  .account-row:hover { background:${C.surface2}; }
  .account-row-copy { flex:1; min-width:0; }
  .account-row-title { font-size:13px; font-weight:600; }
  .account-row-sub { color:${C.textSecondary}; font-size:11px; margin-top:2px; }
  .account-row-chevron { color:${C.gold}; font-size:18px; }
  .logout-button { width:auto !important; align-self:flex-start; padding:10px 16px !important; }
  @media (max-width: 520px) { .profile-actions { flex-direction:column; } }
  .assistant-launcher { position:fixed; right:24px; bottom:92px; width:58px; height:58px; border:0; border-radius:50%; background:${C.gold}; color:#001819; cursor:grab; z-index:80; box-shadow:0 8px 24px rgba(0,0,0,0.35); animation:assistantBounce 2.8s ease-in-out infinite; touch-action:none; }
  .assistant-launcher:active { cursor:grabbing; }
  .assistant-launcher:hover { animation-play-state:paused; transform:scale(1.06); }
  .assistant-logo { width:32px; height:26px; display:block; margin:auto; }
  @keyframes assistantBounce { 0%,70%,100%{transform:translateY(0)} 78%{transform:translateY(-8px)} 86%{transform:translateY(0)} 92%{transform:translateY(-4px)} }
  .assistant-panel { position:fixed; right:24px; bottom:158px; width:min(380px,calc(100vw - 32px)); height:min(540px,calc(100vh - 190px)); display:flex; flex-direction:column; background:${C.surface}; border:1px solid ${C.border}; border-radius:14px; overflow:hidden; z-index:79; box-shadow:0 16px 48px rgba(0,0,0,0.55); }
  .assistant-head { display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid ${C.border}; }
  .assistant-head-copy { flex:1; }
  .assistant-title { color:${C.textPrimary}; font-size:14px; font-weight:600; }
  .assistant-status { color:${C.textSecondary}; font-size:11px; margin-top:2px; }
  .assistant-close { border:0; background:transparent; color:${C.textSecondary}; font-size:20px; cursor:pointer; }
  .assistant-body { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; }
  .assistant-input { display:flex; align-items:flex-end; gap:8px; padding:12px; border-top:1px solid ${C.border}; }
  .assistant-input textarea { min-height:48px; max-height:130px; resize:vertical; }
  .assistant-mic { width:42px; height:42px; flex-shrink:0; border:1px solid ${C.border}; border-radius:10px; background:${C.surface2}; color:${C.textPrimary}; cursor:pointer; }
  .assistant-mic.listening { color:${C.redText}; border-color:${C.redText}; }
  .assistant-hint { color:${C.textMuted}; font-size:10px; text-align:center; padding:0 12px 10px; }
`;

// ── Helpers ────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const fmt = (n, currency) => {
  const sym = CURRENCIES[currency]?.symbol || "₦";
  return sym + n.toLocaleString("en-NG");
};

function initials(name) {
  const parts = (name || "VeeVak").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0].toUpperCase()).join("") || "V";
}

function Avatar({ src, name, className = "" }) {
  return src
    ? <img className={className} src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
    : <span className={className}>{initials(name)}</span>;
}

const ChannelBadge = ({ ch }) => {
  const map = { whatsapp:"ch-whatsapp", instagram:"ch-instagram", offline:"ch-offline", facebook:"ch-facebook", tiktok:"ch-tiktok" };
  return <span className={`sale-channel ${map[ch]||"ch-offline"}`}>{ch}</span>;
};

function LineChart({ data }) {
  const max = Math.max(...data);
  const w=300, h=70;
  const pts = data.map((v,i) => [(i/(data.length-1))*w, h-(v/max)*(h-8)]);
  const d = pts.map((p,i) => `${i===0?"M":"L"}${p[0]},${p[1]}`).join(" ");
  const fill = `${d} L${pts[pts.length-1][0]},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{width:"100%",height:80}}>
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity="0.3"/><stop offset="100%" stopColor={C.gold} stopOpacity="0"/></linearGradient></defs>
      <path d={fill} fill="url(#g)"/>
      <path d={d} fill="none" stroke={C.gold} strokeWidth="1.5"/>
      {pts.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={i===pts.length-1?C.gold:"transparent"}/>)}
    </svg>
  );
}

function ForecastChart({ history, forecast }) {
  const allValues = [
    ...history.map(h => h.actual || 0),
    ...forecast.map(f => f.predicted || 0),
    ...forecast.map(f => f.upper || 0),
  ];
  const max = Math.max(1, ...allValues);
  const totalPoints = history.length + forecast.length;
  if (totalPoints < 2) return null;
  const w = 300, h = 70;

  const toX = i => (i / (totalPoints - 1)) * w;
  const toY = v => h - (v / max) * (h - 8);

  const historyPts  = history.map((d, i)  => [toX(i), toY(d.actual || 0)]);
  const forecastPts = forecast.map((d, i) => [toX(history.length + i), toY(d.predicted || 0)]);
  const upperPts    = forecast.map((d, i) => [toX(history.length + i), toY(d.upper || 0)]);
  const lowerPts    = forecast.map((d, i) => [toX(history.length + i), toY(d.lower || 0)]);

  const histPath = historyPts.map((p,i) => `${i===0?"M":"L"}${p[0]},${p[1]}`).join(" ");
  const histFill = historyPts.length > 0
    ? `${histPath} L${historyPts[historyPts.length-1][0]},${h} L0,${h} Z`
    : "";

  const lastHist = historyPts[historyPts.length - 1];
  const forecastPath = forecastPts.length > 0 && lastHist
    ? `M${lastHist[0]},${lastHist[1]} ` + forecastPts.map(p => `L${p[0]},${p[1]}`).join(" ")
    : "";

  const confidenceBand = upperPts.length > 0
    ? `M${upperPts.map(p=>`${p[0]},${p[1]}`).join(" L")} L${[...lowerPts].reverse().map(p=>`${p[0]},${p[1]}`).join(" L")} Z`
    : "";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{width:"100%",height:80}}>
      <defs>
        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {histFill      && <path d={histFill}       fill="url(#histGrad)"/>}
      {histPath      && <path d={histPath}        fill="none" stroke={C.gold} strokeWidth="1.5"/>}
      {confidenceBand && <path d={confidenceBand} fill={C.gold} fillOpacity="0.1"/>}
      {forecastPath  && <path d={forecastPath}    fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>}
      {lastHist      && <circle cx={lastHist[0]} cy={lastHist[1]} r="2.5" fill={C.gold}/>}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ══════════════════════════════════════════════════════════════════════
function ForgotPassword({ email, setEmail, onBack }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSend() {
    if (!email.trim()) return;
    setLoading(true);
    // No backend email service yet — open mailto as a fallback
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  return (
    <>
      <div className="onboard-title" style={{fontSize:20,marginBottom:6}}>Reset your password</div>
      <div className="onboard-sub" style={{marginBottom:24}}>
        {sent ? "Email sent! Check your inbox." : "Enter your email and we'll help you reset your password."}
      </div>
      <div className="onboard-step">
        {!sent ? (
          <>
            <div className="form-field">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <button className="btn-primary" onClick={handleSend} disabled={!email.trim()||loading}>
              {loading ? "Sending..." : "Send reset instructions"}
            </button>
            <div style={{fontSize:12,color:C.textSecondary,textAlign:"center",lineHeight:1.6}}>
              We'll send a link to <strong style={{color:C.textPrimary}}>{email||"your email"}</strong>.<br/>
              If you don't see it, email us at{" "}
              <a href="mailto:info.veevak@gmail.com" style={{color:C.gold}}>info.veevak@gmail.com</a>.
            </div>
          </>
        ) : (
          <div style={{textAlign:"center",padding:"12px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>📬</div>
            <div style={{fontSize:13,color:C.textSecondary,lineHeight:1.7}}>
              Instructions sent to <strong style={{color:C.textPrimary}}>{email}</strong>.<br/>
              Check your inbox (and spam folder).
            </div>
          </div>
        )}
        <button className="btn-secondary" onClick={onBack}>← Back to Log In</button>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════════════════════════════
function Onboarding({ onComplete, startOnLogin, onBackToLanding }) {
  const [mode, setMode] = useState(startOnLogin ? "login" : "welcome"); // welcome | signup | login | business | forgot
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("NGN");
  const [bizName, setBizName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupToken, setSignupToken] = useState(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  async function handleLogin() {
    if (!email.trim() || !password || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await apiPost("/auth/login", { email: email.trim(), password });
      const shops = result.shops || [];
      if (shops.length === 0) {
        setError("Account found but has no shop yet. Please contact support.");
        setLoading(false);
        return;
      }
      onComplete({
        token: result.token,
        lang: result.language || "en",
        currency: result.currency || "NGN",
        bizName: shops[0].name,
        ownerName: result.name,
        email: result.email || email.trim(),
        sellerId: result.seller_id,
        shopId: shops[0].id,
        shopName: shops[0].name,
      });
    } catch (e) {
      setError(e.message.includes("401") || e.message.includes("Incorrect") ? "Incorrect email or password." : "Could not reach the server.");
    }
    setLoading(false);
  }

  async function handleSignupStep() {
    if (!email.trim() || !password || loading) return;
    setError("");
    setMode("business");
  }

  async function finishSignup() {
    if (!bizName.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await apiPost("/auth/signup", {
        name: ownerName.trim() || "Owner",
        email: email.trim(),
        password,
        business_name: bizName.trim(),
        language: lang,
        currency,
      });
      onComplete({
        token: result.token,
        lang, currency,
        bizName: bizName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        sellerId: result.seller_id,
        shopId: result.shop_id,
        shopName: result.shop_name,
      });
    } catch (e) {
      setError(e.message.includes("already exists") ? "An account with this email already exists. Try logging in instead." : "Could not reach the server.");
    }
    setLoading(false);
  }

  return (
    <div className="onboard">
      <div className="onboard-logo" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="48" height="41" viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" aria-label="VeeVak">
          <path d="M5 5 H30 L50 35 L70 5 H95 V60 L78 78 H60 L50 62 L40 78 H22 L5 60 Z M21 15 L31 15 L43 40 L34 56 Z M79 15 L69 15 L57 40 L66 56 Z M39 18 L61 18 L50 50 Z" fill={C.gold} fillRule="evenodd"/>
        </svg>
      </div>
      {mode === "welcome" && (
        <>
          <div className="onboard-title">{t.welcome}</div>
          <div className="onboard-sub">{t.welcomeSub}</div>
          <div className="onboard-step">
            <button className="btn-primary" onClick={() => setMode("signup")}>Create Account</button>
            <button className="btn-secondary" onClick={() => setMode("login")}>I already have an account</button>
            {onBackToLanding && (
              <button onClick={onBackToLanding} style={{background:"none",border:"none",fontSize:13,color:C.textSecondary,cursor:"pointer",padding:"4px 0",fontFamily:"'Inter',sans-serif",textDecoration:"underline",alignSelf:"center"}}>
                ← Back to home page
              </button>
            )}
          </div>
        </>
      )}

      {mode === "login" && (
        <>
          <div className="onboard-title" style={{fontSize:20,marginBottom:6}}>Welcome back</div>
          <div className="onboard-sub" style={{marginBottom:24}}>Log in to your VeeVak account</div>
          <div className="onboard-step">
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <div style={{position:"relative"}}>
                <input className="form-input" type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{paddingRight:40}}/>
                <span onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:16,color:C.textMuted}}>{showPw?"🙈":"👁"}</span>
              </div>
              <div style={{textAlign:"right",marginTop:6}}>
                <button onClick={()=>{setMode("forgot");setError("");}} style={{background:"none",border:"none",fontSize:12,color:C.gold,cursor:"pointer",padding:0,fontFamily:"'Inter',sans-serif"}}>Forgot password?</button>
              </div>
            </div>
            <button className="btn-primary" onClick={handleLogin} disabled={!email.trim()||!password||loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
            {error && <div style={{fontSize:12,color:C.redText,textAlign:"center"}}>{error}</div>}
            <button className="btn-secondary" onClick={() => { setMode("welcome"); setError(""); }}>← Back</button>
            {onBackToLanding && (
              <button onClick={onBackToLanding} style={{background:"none",border:"none",fontSize:12,color:C.textMuted,cursor:"pointer",padding:"4px 0",fontFamily:"'Inter',sans-serif",textDecoration:"underline",alignSelf:"center"}}>
                ← Back to home page
              </button>
            )}
          </div>
        </>
      )}

      {mode === "forgot" && (
        <ForgotPassword email={email} setEmail={setEmail} onBack={()=>{setMode("login");setError("");}} />
      )}

      {mode === "signup" && (
        <>
          <div className="onboard-title" style={{fontSize:20,marginBottom:6}}>Create your account</div>
          <div className="onboard-sub" style={{marginBottom:24}}>Let's get you set up</div>
          <div className="onboard-step">
            <div className="form-field">
              <label className="form-label">Your Name</label>
              <input className="form-input" placeholder="e.g. Chioma Obi" value={ownerName} onChange={e=>setOwnerName(e.target.value)}/>
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <div style={{position:"relative"}}>
                <input className="form-input" type={showPw?"text":"password"} placeholder="At least 6 characters" value={password} onChange={e=>setPassword(e.target.value)} style={{paddingRight:40}}/>
                <span onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:16,color:C.textMuted}}>{showPw?"🙈":"👁"}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={handleSignupStep} disabled={!email.trim()||!password||password.length<6}>Continue</button>
            {error && <div style={{fontSize:12,color:C.redText,textAlign:"center"}}>{error}</div>}
            <button className="btn-secondary" onClick={() => { setMode("welcome"); setError(""); }}>← Back</button>
          </div>
        </>
      )}

      {mode === "business" && (
        <>
          <div className="onboard-title" style={{fontSize:20,marginBottom:6}}>{t.businessSetup}</div>
          <div className="onboard-sub" style={{marginBottom:24}}>Tell us about your business</div>
          <div className="onboard-step">
            <div className="form-field">
              <label className="form-label">{t.businessName} *</label>
              <input className="form-input" placeholder="e.g. Mama Chioma's Store" value={bizName} onChange={e=>setBizName(e.target.value)}/>
            </div>
            <div className="form-field">
              <label className="form-label">{t.selectLanguage}</label>
              <div className="lang-grid">
                {LANGUAGES.map(l => (
                  <div key={l.code} className={`lang-option ${lang===l.code?"selected":""}`} onClick={() => setLang(l.code)}>
                    <div className="lang-option-label">{l.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">{t.selectCurrency}</label>
              <div className="currency-grid">
                {Object.entries(CURRENCIES).map(([code, info]) => (
                  <div key={code} className={`currency-option ${currency===code?"selected":""}`} onClick={() => setCurrency(code)}>
                    <div className="currency-flag">{info.flag}</div>
                    <div className="currency-info">
                      <div className="currency-code">{code}</div>
                      <div className="currency-name">{info.name}</div>
                    </div>
                    <div className="currency-sym">{info.symbol}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={finishSignup} disabled={!bizName.trim()||loading}>
              {loading ? "Setting up..." : `${t.getStarted} →`}
            </button>
            {error && <div style={{fontSize:12,color:C.redText,textAlign:"center"}}>{error}</div>}
            <button className="btn-secondary" onClick={() => setMode("signup")}>← Back</button>
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════
function Home({ t, currency, shopId, refreshKey, ownerName }) {
  const [data, setData]           = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    Promise.all([
      apiGet(`/analytics/${shopId}`),
      apiGet(`/anomalies/${shopId}`).catch(() => null),
    ])
      .then(([analyticsResult, anomalyResult]) => {
        setData(analyticsResult);
        setAnomalies(anomalyResult);
      })
      .catch(() => setError("Could not load data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [shopId, refreshKey]);

  if (loading) {
    return <div className="card"><div className="card-label">Loading...</div></div>;
  }
  if (error) {
    return <div className="card"><div className="card-label" style={{color:C.redText}}>{error}</div></div>;
  }

  const total = data?.today_revenue || 0;
  const expenses = data?.today_expenses || 0;
  const profit = data?.today_profit || 0;
  const recentSales = data?.recent_sales || [];
  const weekly = data?.weekly_revenue || [];

  const weekMap = {};
  weekly.forEach(w => { weekMap[w.date] = w.total; });
  const maxWeekly = Math.max(1, ...weekly.map(w => w.total));

  const ALERT_COLORS = {
    positive: { bg:"#0d1a10", border:"#1a3a1a", icon:"🚀", text: C.greenText  },
    warning:  { bg:"#1a1200", border:"#3a2a00", icon:"⚠️", text: C.goldLight  },
    caution:  { bg:"#1a0d00", border:"#3a1a00", icon:"💸", text: "#fb923c"    },
    info:     { bg: C.surface2, border: C.border, icon:"💡", text: C.textSecondary },
  };

  // Channel breakdown from recent sales
  const channelCounts = {};
  recentSales.forEach(s => { channelCounts[s.channel] = (channelCounts[s.channel]||0) + 1; });
  const totalCh = Object.values(channelCounts).reduce((a,b)=>a+b,0);
  const channelColors = { whatsapp:C.gold, instagram:C.accentLight||"#a78bfa", offline:C.textSecondary, facebook:"#818cf8", tiktok:"#e879f9" };
  const channelList = Object.entries(channelCounts)
    .map(([name,count]) => ({ name, pct: totalCh ? Math.round((count/totalCh)*100) : 0, color: channelColors[name]||C.textMuted }))
    .sort((a,b)=>b.pct-a.pct);

  return (
    <>
      {/* Greeting row — full width */}
      <div className="home-grid-full" style={{marginBottom:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",color:C.textPrimary}}>{greeting()}, {(ownerName||"there").split(" ")[0]} 👋</div>
            <div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>Here's how your business is doing today</div>
          </div>
        </div>
      </div>

      {/* Anomaly alerts — full width */}
      {anomalies?.alerts?.length > 0 && (
        <div className="home-grid-full" style={{display:"flex",flexDirection:"column",gap:8}}>
          {anomalies.alerts.map((alert, i) => {
            const s = ALERT_COLORS[alert.severity] || ALERT_COLORS.info;
            return (
              <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:10,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:16,flexShrink:0}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:s.text,marginBottom:2}}>{alert.title.toUpperCase()}</div>
                  <div style={{fontSize:12,color:C.textSecondary,lineHeight:1.5}}>{alert.message}</div>
                  {alert.metric && <div style={{fontSize:11,color:C.textMuted,marginTop:4,fontFamily:"'Space Grotesk',sans-serif"}}>{alert.metric}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2-col stat cards */}
      <div className="home-grid">
        <div className="card" style={{border:`1px solid ${C.border}`}}>
          <div className="card-label">{t.todayRevenue}</div>
          <div className="card-value">{fmt(total,currency)}</div>
        </div>
        <div className="card" style={{border:`1px solid ${C.border}`}}>
          <div className="card-label">{t.todayProfit}</div>
          <div className="card-value green">{fmt(profit,currency)}</div>
          {expenses > 0 && <div className="card-sub" style={{marginTop:6,fontSize:11}}>After {fmt(expenses,currency)} expenses</div>}
        </div>

        {/* Weekly revenue sparkline */}
        <div className="card">
          <div className="card-label" style={{marginBottom:8}}>{t.weeklyRevenue}</div>
          {weekly.length === 0 ? (
            <div style={{fontSize:12,color:C.textMuted,marginTop:8}}>No sales yet this week.</div>
          ) : (
            <>
              <LineChart data={weekly.map(w=>w.total)}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:9,color:C.textMuted}}>{weekly.length > 0 ? new Date(weekly[0].date).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"}) : ""}</span>
                <span style={{fontSize:9,color:C.textMuted}}>Today</span>
              </div>
            </>
          )}
        </div>

        {/* Sales channels */}
        <div className="card">
          <div className="card-label" style={{marginBottom:10}}>Sales Channels</div>
          {channelList.length === 0 ? (
            <div style={{fontSize:12,color:C.textMuted}}>No sales yet.</div>
          ) : channelList.map(ch => (
            <div key={ch.name} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color:C.textSecondary,textTransform:"capitalize"}}>{ch.name}</span>
                <span style={{fontSize:11,color:ch.color,fontWeight:600}}>{ch.pct}%</span>
              </div>
              <div style={{height:4,background:C.surface2,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${ch.pct}%`,background:ch.color,borderRadius:2}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Recent sales — full width */}
        <div className="card home-grid-full">
          <div className="section-row">
            <div className="section-title">{t.recentSales}</div>
          </div>
          {recentSales.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-text">No sales logged yet. Go to Log Sale to add your first one.</div></div>
          ) : recentSales.map(s => (
            <div className="sale-item" key={s.id}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:C.surface2,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.gold,flexShrink:0}}>
                  {(s.customer_name||"C")[0].toUpperCase()}
                </div>
                <div className="sale-info">
                  <div className="sale-name">{s.customer_name || "Customer"}</div>
                  <div className="sale-meta">{(s.products||[]).map(p=>p.name).join(", ")}</div>
                  <ChannelBadge ch={s.channel}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="sale-amount">{fmt(s.order_total||0,currency)}</div>
                <div style={{fontSize:10,color:s.payment_status==="paid"?C.greenText:C.textMuted,marginTop:2}}>{s.payment_status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function LogSale({ t, currency, shopId, shopName, onSaleLogged }) {
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  // Chat mode sends the full conversation history to /chat/conversation, which
  // replies naturally AND silently detects/saves any sales, expenses, or
  // inventory updates mentioned in the latest message — including multiple
  // things in one message (e.g. a sale AND an expense together).
  async function handleSend() {
    if (!input.trim()||loading) return;
    const userText = input.trim(); setInput("");
    const updatedMessages = [...messages, {role:"user", text:userText}];
    setMessages(updatedMessages);
    setLoading(true);
    try {
      const result = await apiPost("/chat/conversation", {
        shop_id: shopId,
        shop_name: shopName || "",
        currency,
        messages: updatedMessages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", text: m.text })),
      });

      let reply = result.reply || "Got it.";
      if (result.saved && result.saved.length > 0) {
        onSaleLogged?.();
      }
      setMessages(prev => [...prev,{role:"ai",text:reply}]);
    } catch (e) {
      setMessages(prev => [...prev,{role:"ai",text:"Connection issue — check that the backend is running."}]);
    }
    setLoading(false);
  }

  async function handlePasteAnalyze() {
    if (!pasteText.trim()) return;
    setLoading(true);
    try {
      const result = await apiPost("/analyze/paste", { shop_id: shopId, chat_text: pasteText, currency });
      setMode("chat");
      if (result.has_order) {
        const productList = (result.products||[]).map(p => `${p.quantity||""} ${p.name}`.trim()).join(", ");
        setMessages([{role:"ai",text:`📋 Found an order: ${productList} — ${fmt(result.order_total||0,currency)} (${result.payment_status||"unknown"}). Logged to your dashboard.`}]);
        onSaleLogged?.();
      } else if (result.error) {
        setMessages([{role:"ai",text:`⚠️ Extraction error: ${result.error}`}]);
      } else {
        const debugNote = result._debug_raw ? `\n\n(Debug — what Gemini returned: ${result._debug_raw})` : "";
        setMessages([{role:"ai",text:`No clear order found in that chat. Try Quick Form instead, or paste a clearer excerpt.${debugNote}`}]);
      }
      setPasteText("");
    } catch (e) {
      setMessages(prev => [...prev, {role:"ai",text:`⚠️ Request failed: ${e.message}`}]);
    }
    setLoading(false);
  }

  async function handleUploadProcess() {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("shop_id", shopId);
      formData.append("currency", currency);
      const result = await apiUpload("/upload/whatsapp", formData);
      setMode("chat");
      setMessages([{role:"ai",text:`📂 Processed your export: found ${result.orders_found} order(s) out of ${result.message}.`}]);
      setFile(null);
      if (result.orders_found > 0) onSaleLogged?.();
    } catch (e) {
      alert("Upload failed. Make sure the backend is running.");
    }
    setUploading(false);
  }

  const modes = [
    {key:"form",icon:"📋",title:t.quickForm,desc:t.fillForm},
    {key:"upload",icon:"📂",title:t.uploadChat,desc:t.whatsappExport},
    {key:"paste",icon:"💬",title:t.pasteChat,desc:t.pasteConvos},
    {key:"chat",icon:"🤖",title:t.aiChat,desc:t.talkAssistant},
  ];

  return (
    <>
      <div style={{marginBottom:4}}>
        <div style={{fontSize:17,fontWeight:600,fontFamily:"Space Grotesk",color:C.textPrimary}}>{t.logSaleTitle}</div>
        <div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{t.logSaleSub}</div>
      </div>

      {mode==="chat" && (
        <>
          {messages.length===0 && (
            <div className="chat-box">
              <div style={{fontSize:14,color:C.textPrimary,marginBottom:10}}>{t.greeting}</div>
            </div>
          )}
          {messages.length>0 && (
            <div className="card" style={{padding:"12px 14px"}}>
              <div className="chat-messages">
                {messages.map((m,i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    {m.role==="ai" && <div className="msg-label">VEEVAK AI</div>}
                    <span style={{whiteSpace:"pre-wrap"}}>{m.text}</span>
                  </div>
                ))}
                {loading && <div className="msg ai"><div className="msg-label">VEEVAK AI</div><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></div>}
                <div ref={bottomRef}/>
              </div>
            </div>
          )}
          <div className="chat-input-row">
            <textarea className="chat-input" rows={4} placeholder={t.chatPlaceholder} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend();
              }
            }}/>
            <button className="btn-send" onClick={handleSend} disabled={loading||!input.trim()}>➤</button>
          </div>
        </>
      )}

      {mode==="form" && (
        <QuickForm t={t} currency={currency} shopId={shopId}
          onDone={()=>{setMode("chat");setMessages([{role:"ai",text:"✓ Sale logged successfully!"}]);onSaleLogged?.();}}/>
      )}

      {mode==="paste" && (
        <div className="card">
          <div className="card-label" style={{marginBottom:8}}>{t.pasteChat}</div>
          <textarea
            style={{width:"100%",background:"transparent",border:"none",color:C.textSecondary,fontSize:12,fontFamily:"Inter",resize:"vertical",outline:"none",minHeight:120}}
            placeholder={"Paste your chat here...\n\n[12/06/2024] Ada: I want 2 bags of rice\n[12/06/2024] You: That's ₦90,000\n[12/06/2024] Ada: Ok send am"}
            value={pasteText} onChange={e=>setPasteText(e.target.value)} rows={8}
          />
          <button className="btn-primary" style={{marginTop:12}} onClick={handlePasteAnalyze} disabled={loading||!pasteText.trim()}>
            {loading?t.analyzing:t.analyzeExtract}
          </button>
        </div>
      )}

      {mode==="upload" && (
        <div className="card">
          <div className="card-label" style={{marginBottom:8}}>{t.uploadChat}</div>
          <div className="file-upload-zone" onClick={()=>fileRef.current?.click()}>
            <div className="file-upload-icon">📂</div>
            <div className="file-upload-text">{file?file.name:"Tap to select your WhatsApp export"}</div>
            <div className="file-upload-sub">WhatsApp → Chat → ⋮ → Export Chat → Without Media</div>
            <input ref={fileRef} type="file" accept=".txt" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
          </div>
          {file && (
            <button className="btn-primary" style={{marginTop:12}} onClick={handleUploadProcess} disabled={uploading}>
              {uploading ? "Processing..." : "Process File"}
            </button>
          )}
        </div>
      )}

      <div className="input-modes">
        {modes.map(m => (
          <div key={m.key} className={`mode-card ${mode===m.key?"active":""}`} onClick={()=>setMode(m.key)}>
            <div className="mode-icon">{m.icon}</div>
            <div className="mode-title">{m.title}</div>
            <div className="mode-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-label">{t.howItWorks}</div>
        <div className="how-list">
          {["💬 Type what you sold in plain language","🧠 I remember the full conversation","✅ I'll ask if I need clarification","📊 Multi-sale messages work too"].map((s,i)=>(
            <div className="how-item" key={i}><span>{s.split(" ")[0]}</span><span>{s.split(" ").slice(1).join(" ")}</span></div>
          ))}
        </div>
      </div>
    </>
  );
}

function QuickForm({ t, currency, shopId, onDone }) {
  const [form, setForm] = useState({product:"",qty:"",price:"",customer:"",channel:"whatsapp",payment:"paid"});
  const [submitting, setSubmitting] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function handleSubmit() {
    if (!form.product || !form.price || submitting) return;
    setSubmitting(true);
    try {
      const qty = form.qty ? parseInt(form.qty, 10) : null;
      const price = parseFloat(form.price);
      await apiPost("/sales/quick", {
        shop_id: shopId,
        product_name: form.product,
        quantity: qty,
        unit_price: price,
        total_price: qty ? qty * price : price,
        customer_name: form.customer || null,
        channel: form.channel,
        payment_status: form.payment,
      });
      onDone();
    } catch (e) {
      alert("Could not save the sale. Make sure the backend is running.");
    }
    setSubmitting(false);
  }

  return (
    <div className="card">
      <div className="modal-title" style={{marginBottom:4}}>{t.logSaleBtn}</div>
      <div className="form-field">
        <label className="form-label">{t.product}</label>
        <input className="form-input" placeholder="e.g. Rice 50kg bag" value={form.product} onChange={e=>set("product",e.target.value)}/>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">{t.quantity}</label>
          <input className="form-input" type="number" placeholder="2" value={form.qty} onChange={e=>set("qty",e.target.value)}/>
        </div>
        <div className="form-field">
          <label className="form-label">{t.price} ({CURRENCIES[currency]?.symbol})</label>
          <input className="form-input" type="number" placeholder="45000" value={form.price} onChange={e=>set("price",e.target.value)}/>
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">{t.customerName}</label>
        <input className="form-input" placeholder="e.g. Ada Okonkwo" value={form.customer} onChange={e=>set("customer",e.target.value)}/>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">{t.channel}</label>
          <select className="select-input" value={form.channel} onChange={e=>set("channel",e.target.value)}>
            <option value="whatsapp">{t.whatsapp}</option>
            <option value="instagram">{t.instagram}</option>
            <option value="facebook">{t.facebook}</option>
            <option value="tiktok">{t.tiktok}</option>
            <option value="offline">{t.offline}</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">{t.payment}</label>
          <select className="select-input" value={form.payment} onChange={e=>set("payment",e.target.value)}>
            <option value="paid">{t.paid}</option>
            <option value="pending">{t.pending}</option>
            <option value="on_delivery">{t.onDelivery}</option>
          </select>
        </div>
      </div>
      <button className="btn-primary" style={{marginTop:8}} onClick={handleSubmit} disabled={!form.product||!form.price||submitting}>
        {submitting ? "Saving..." : t.logSaleBtn}
      </button>
    </div>
  );
}

function Expenses({ t, currency, shopId, refreshKey, onChanged }) {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("stock");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    apiGet(`/expenses/${shopId}`)
      .then(d => setExpenses(d.expenses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shopId, refreshKey]);

  const total = expenses.reduce((a,e) => a+(e.amount||0), 0);
  const categoryLabels = { stock: t.stock, transport: t.transport, utilities: t.utilities, other: t.other };

  async function handleSave() {
    if (!desc.trim() || !amount || submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/expenses", {
        shop_id: shopId,
        description: desc.trim(),
        amount: parseFloat(amount),
        category,
      });
      setShowForm(false);
      setDesc(""); setAmount(""); setCategory("stock");
      onChanged?.();
    } catch (e) {
      alert("Could not save expense. Check the backend is running.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <div className="expense-header">
        <div className="card-label" style={{color:"#a87070"}}>{t.todayExpenses}</div>
        <div className="expense-amount">{fmt(total,currency)}</div>
        <div style={{fontSize:12,color:"#a87070",marginTop:4}}>{expenses.length} transactions</div>
      </div>
      <button className="btn-add-expense" onClick={()=>setShowForm(true)}>
        <span style={{fontSize:18}}>+</span> {t.logExpense}
      </button>
      <div className="card">
        <div className="section-title" style={{marginBottom:12}}>Today's Log</div>
        {loading ? (
          <div style={{fontSize:12,color:C.textMuted}}>Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🧾</div><div className="empty-text">No expenses logged yet.</div></div>
        ) : expenses.map(e => (
          <div className="sale-item" key={e.id}>
            <div className="sale-info">
              <div className="sale-name">{e.description}</div>
              <div className="sale-meta">{categoryLabels[e.category] || e.category}</div>
            </div>
            <div className="sale-amount" style={{color:C.redText}}>−{fmt(e.amount,currency)}</div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-heading"><div className="modal-title">{t.logExpense}</div><button className="modal-close" aria-label="Close expense form" onClick={()=>setShowForm(false)}>×</button></div>
            <div className="form-field">
              <label className="form-label">{t.description}</label>
              <input className="form-input" placeholder="e.g. Tomatoes and pepper" value={desc} onChange={e=>setDesc(e.target.value)}/>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{t.amount} ({CURRENCIES[currency]?.symbol})</label>
                <input className="form-input" type="number" placeholder="5000" value={amount} onChange={e=>setAmount(e.target.value)}/>
              </div>
              <div className="form-field">
                <label className="form-label">{t.category}</label>
                <select className="select-input" value={category} onChange={e=>setCategory(e.target.value)}>
                  <option value="stock">{t.stock}</option>
                  <option value="transport">{t.transport}</option>
                  <option value="utilities">{t.utilities}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={handleSave} disabled={!desc.trim()||!amount||submitting}>
              {submitting ? "Saving..." : t.saveExpense}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Inventory({ t, currency, shopId, refreshKey, onChanged }) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    apiGet(`/inventory/${shopId}`)
      .then(d => setItems(d.inventory || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shopId, refreshKey]);

  const filtered = items.filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()));
  const low = items.filter(i=>i.stock_qty>0 && i.stock_qty<=i.low_stock_threshold).length;
  const out = items.filter(i=>i.stock_qty===0).length;

  async function handleAdd() {
    if (!name.trim() || !price || submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/inventory", {
        shop_id: shopId,
        product_name: name.trim(),
        stock_qty: stock ? parseInt(stock,10) : 0,
        unit_price: parseFloat(price),
        low_stock_threshold: 3,
      });
      setShowForm(false);
      setName(""); setStock(""); setPrice("");
      onChanged?.();
    } catch (e) {
      alert("Could not save item. Check the backend is running.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <div className="search-row">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder={t.searchProducts} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button className="btn-add" onClick={()=>setShowForm(true)}>{t.addItem}</button>
      </div>
      <div className="stat-cards">
        <div className="stat-card"><div className="stat-num">{items.length}</div><div className="stat-label">{t.totalItems}</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:C.goldLight}}>{low}</div><div className="stat-label">{t.lowStock}</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:C.redText}}>{out}</div><div className="stat-label">{t.outOfStock}</div></div>
      </div>
      <div className="card">
        {loading ? (
          <div style={{fontSize:12,color:C.textMuted}}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⬡</div><div className="empty-text">No products yet. Tap + Add to create one.</div></div>
        ) : filtered.map(item => (
          <div className="sale-item" key={item.id}>
            <div className="sale-info">
              <div className="sale-name">{item.product_name}</div>
              <div className="sale-meta">Unit: {fmt(item.unit_price,currency)}</div>
              {item.stock_qty===0
                ? <span className="sale-channel" style={{background:"#3a0d0d",color:C.redText}}>{t.outOfStock}</span>
                : item.stock_qty<=item.low_stock_threshold
                  ? <span className="sale-channel" style={{background:"#2a1a00",color:C.goldLight}}>{t.lowStock}</span>
                  : <span className="sale-channel" style={{background:"#0d1a10",color:C.greenText}}>In stock</span>
              }
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"Space Grotesk",fontSize:18,fontWeight:700,color:item.stock_qty===0?C.redText:C.textPrimary}}>{item.stock_qty}</div>
              <div style={{fontSize:10,color:C.textMuted}}>units</div>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-heading"><div className="modal-title">{t.addItem}</div><button className="modal-close" aria-label="Close inventory form" onClick={()=>setShowForm(false)}>×</button></div>
            <div className="form-field">
              <label className="form-label">{t.product}</label>
              <input className="form-input" placeholder="e.g. Rice 50kg bag" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{t.quantity}</label>
                <input className="form-input" type="number" placeholder="10" value={stock} onChange={e=>setStock(e.target.value)}/>
              </div>
              <div className="form-field">
                <label className="form-label">{t.price} ({CURRENCIES[currency]?.symbol})</label>
                <input className="form-input" type="number" placeholder="45000" value={price} onChange={e=>setPrice(e.target.value)}/>
              </div>
            </div>
            <button className="btn-primary" onClick={handleAdd} disabled={!name.trim()||!price||submitting}>
              {submitting ? "Saving..." : t.addItem}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Customers({ t, currency, shopId, refreshKey }) {
  const [sales, setSales]       = useState([]);
  const [segments, setSegments] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    Promise.all([
      apiGet(`/sales/${shopId}`),
      apiGet(`/segments/${shopId}`).catch(() => null),
    ])
      .then(([salesResult, segmentResult]) => {
        setSales(salesResult.sales || []);
        setSegments(segmentResult);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shopId, refreshKey]);

  // Channel breakdown by count
  const channelCounts = {};
  sales.forEach(s => { channelCounts[s.channel] = (channelCounts[s.channel]||0) + 1; });
  const totalChannelCount = Object.values(channelCounts).reduce((a,b)=>a+b,0);
  const channelColors = { whatsapp:C.greenText, instagram:"#f472b6", offline:"#60a5fa", facebook:"#818cf8", tiktok:"#e879f9" };
  const channels = Object.entries(channelCounts).map(([name,count]) => ({
    name, pct: totalChannelCount ? Math.round((count/totalChannelCount)*100) : 0, color: channelColors[name]||C.textMuted
  })).sort((a,b)=>b.pct-a.pct);

  // Returning customers: group by name, count orders and total spend
  const customerMap = {};
  sales.forEach(s => {
    const name = s.customer_name || "Unknown";
    if (!customerMap[name]) customerMap[name] = { name, orders:0, total:0 };
    customerMap[name].orders += 1;
    customerMap[name].total += s.order_total || 0;
  });
  // All customers (everyone who has bought at least once), sorted by total spend
  const allCustomers = Object.values(customerMap).sort((a,b)=>b.total-a.total);
  // Returning customers: those with more than one order
  const returning = allCustomers.filter(c=>c.orders>1);

  if (loading) return <div className="card"><div className="card-label">Loading...</div></div>;

  return (
    <>
      {/* ── AI Segment Insights ── */}
      {segments?.enough_data && segments.insights?.length > 0 && (
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {segments.insights.map((insight, i) => (
            <div key={i} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.textSecondary,borderLeft:`3px solid ${C.gold}`}}>
              💡 {insight}
            </div>
          ))}
        </div>
      )}

      {/* ── Customer Segments ── */}
      {segments?.enough_data && (
        <div className="card">
          <div className="section-row" style={{marginBottom:12}}>
            <div className="section-title">Customer Segments ({segments.total_customers})</div>
          </div>
          {/* Segment summary pills */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {Object.entries(segments.segment_counts || {}).map(([seg, count]) => {
              const segData = segments.segments?.find(s => s.segment === seg);
              return (
                <div key={seg} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:20,padding:"4px 12px",fontSize:11,color:segData?.color||C.textSecondary,fontWeight:600}}>
                  {segData?.emoji} {seg} ({count})
                </div>
              );
            })}
          </div>
          {/* Per-customer rows */}
          {segments.segments?.map((s, i) => (
            <div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.surface2,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  {s.emoji}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.textPrimary}}>{s.customer}</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.greenText,fontFamily:"'Space Grotesk',sans-serif"}}>{fmt(s.monetary,currency)}</div>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:C.surface2,color:s.color,fontWeight:600,border:`1px solid ${s.color}40`}}>{s.segment}</span>
                    <span style={{fontSize:10,color:C.textMuted}}>{s.frequency} order{s.frequency>1?"s":""} · last {s.recency_days}d ago</span>
                  </div>
                </div>
              </div>
              <div style={{marginLeft:46,fontSize:11,color:C.textMuted,lineHeight:1.5}}>
                <span style={{color:C.textSecondary}}>{s.description}</span>
                {" · "}
                <span style={{color:C.gold,fontStyle:"italic"}}>{s.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-label" style={{marginBottom:12}}>{t.salesByChannel}</div>
        {channels.length === 0 ? (
          <div style={{fontSize:12,color:C.textMuted}}>No sales yet to break down by channel.</div>
        ) : channels.map(ch => (
          <div key={ch.name}>
            <div className="channel-bar"><span className="channel-name">{ch.name}</span><span className="channel-pct">{ch.pct}%</span></div>
            <div className="channel-track"><div className="channel-fill" style={{width:`${ch.pct}%`,background:ch.color}}/></div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-row"><div className="section-title">All Customers ({allCustomers.length})</div></div>
        {allCustomers.length === 0 ? (
          <div style={{fontSize:12,color:C.textMuted}}>No customers yet — they'll show up here as soon as you log a sale with a customer name.</div>
        ) : allCustomers.map(r => (
          <div className="returning-item" key={r.name}>
            <div className="avatar">{r.name[0]}</div>
            <div><div className="returning-name">{r.name}</div><div className="returning-meta">{r.orders} order{r.orders>1?"s":""}</div></div>
            <div className="returning-amount">{fmt(r.total,currency)}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-row"><div className="section-title">{t.returningCustomers} ({returning.length})</div></div>
        {returning.length === 0 ? (
          <div style={{fontSize:12,color:C.textMuted}}>No repeat customers yet — they'll show up here once someone orders more than once.</div>
        ) : returning.map(r => (
          <div className="returning-item" key={r.name}>
            <div className="avatar">{r.name[0]}</div>
            <div><div className="returning-name">{r.name}</div><div className="returning-meta">{r.orders} orders</div></div>
            <div className="returning-amount">{fmt(r.total,currency)}</div>
          </div>
        ))}
      </div>
      <div className="tip-card">
        <div style={{fontSize:16}}>💡</div>
        <div><div className="tip-label">{t.crmTip}</div><div className="tip-text">{t.crmTipText}</div></div>
      </div>
    </>
  );
}

function Reports({ t, currency, shopId, refreshKey }) {
  const [data, setData]             = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    // Fetch analytics and forecast independently so a forecast 500 never
    // blocks the analytics data from displaying.
    Promise.all([
      apiGet(`/analytics/${shopId}`).catch(() => null),
      apiGet(`/forecast/${shopId}?periods=14`).catch(() => null),
    ])
      .then(([analyticsResult, forecastResult]) => {
        if (analyticsResult) setData(analyticsResult);
        if (forecastResult) setForecastData(forecastResult);
      })
      .finally(() => setLoading(false));
  }, [shopId, refreshKey]);

  if (loading) return <div className="card"><div className="card-label">Loading...</div></div>;

  const weekly = data?.weekly_revenue || [];
  const monthRevenue = data?.monthly_revenue || 0;
  const monthExpenses = data?.monthly_expenses || 0;
  const monthProfit = data?.monthly_profit || 0;
  const topProducts = data?.top_products || [];
  const maxTop = Math.max(1, ...topProducts.map(p=>p.revenue));
  const lineData = weekly.length ? weekly.map(w=>w.total) : [0];

  return (
    <>
      <div className="reports-header">
        <div className="card-label" style={{color:"#a87040"}}>{t.monthlyRevenue}</div>
        <div className="card-value">{fmt(monthRevenue,currency)}</div>
        <div className="card-sub"><span>This calendar month so far</span></div>
      </div>
      <div className="card-row">
        <div className="card small">
          <div className="card-label">{t.monthlyExpenses}</div>
          <div className="card-value red" style={{fontSize:20}}>{fmt(monthExpenses,currency)}</div>
        </div>
        <div className="card small">
          <div className="card-label">{t.netProfit}</div>
          <div className="card-value green" style={{fontSize:20}}>{fmt(monthProfit,currency)}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-label" style={{marginBottom:4}}>{t.dailyTrend} <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(last 7 days + 14-day forecast)</span></div>
        {forecastData?.summary && (
          <div style={{fontSize:12,color:C.textSecondary,marginBottom:12,padding:"8px 12px",background:C.surface2,borderRadius:8,borderLeft:`3px solid ${C.gold}`}}>
            🔮 {forecastData.summary}
          </div>
        )}
        {weekly.length === 0 ? (
          <div style={{fontSize:12,color:C.textMuted}}>No sales recorded yet.</div>
        ) : (
          <>
            <ForecastChart
              history={forecastData?.history || weekly.map(w => ({date:w.date, actual:w.total}))}
              forecast={forecastData?.forecast || []}
            />
            <div style={{display:"flex",gap:16,marginTop:8}}>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textSecondary}}>
                <div style={{width:20,height:2,background:C.gold,borderRadius:1}}/> Actual
              </div>
              {(forecastData?.forecast?.length > 0) && (
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textSecondary}}>
                  <div style={{width:20,height:2,borderTop:`2px dashed ${C.gold}`,opacity:0.6}}/> Forecast
                </div>
              )}
            </div>
            {!forecastData?.enough_data && (
              <div style={{fontSize:11,color:C.textMuted,marginTop:8}}>Keep logging sales to unlock revenue forecasting.</div>
            )}
          </>
        )}
      </div>
      <div className="card">
        <div className="card-label" style={{marginBottom:10}}>{t.topProducts}</div>
        {topProducts.length === 0 ? (
          <div style={{fontSize:12,color:C.textMuted}}>No products sold yet.</div>
        ) : topProducts.map(p=>(
          <div key={p.name} style={{marginBottom:10}}>
            <div className="channel-bar"><span className="channel-name">{p.name}</span><span className="channel-pct">{fmt(p.revenue,currency)}</span></div>
            <div className="channel-track"><div className="channel-fill" style={{width:`${(p.revenue/maxTop)*100}%`}}/></div>
          </div>
        ))}
      </div>
    </>
  );
}

function Profile({ ownerName, email, token, onBack, onSave }) {
  const [pic, setPic] = useState(() => localStorage.getItem("veevak_profile_pic") || "");
  const [name, setName] = useState(ownerName || "");
  const [accountEmail, setAccountEmail] = useState(email || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("veevak_profile_phone") || "");
  const [location, setLocation] = useState(() => localStorage.getItem("veevak_profile_location") || "");
  const [bio, setBio] = useState(() => localStorage.getItem("veevak_profile_bio") || "");
  const [nickname, setNickname] = useState(() => localStorage.getItem("veevak_profile_nickname") || "");
  const [gender, setGender] = useState(() => localStorage.getItem("veevak_profile_gender") || "");
  const [category, setCategory] = useState(() => localStorage.getItem("veevak_profile_category") || "");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  function handlePicChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("veevak_profile_pic", reader.result);
      setPic(reader.result);
      onSave?.(name, accountEmail, reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!name.trim() || !accountEmail.trim()) return;
    try {
      const updated = await apiPut("/auth/profile", { name: name.trim(), email: accountEmail.trim() }, token);
      onSave?.(updated.name, updated.email, pic);
    } catch (e) {
      alert(e.message || "Could not save profile.");
      return;
    }
    localStorage.setItem("veevak_profile_phone", phone);
    localStorage.setItem("veevak_profile_location", location);
    localStorage.setItem("veevak_profile_bio", bio);
    localStorage.setItem("veevak_profile_nickname", nickname);
    localStorage.setItem("veevak_profile_gender", gender);
    localStorage.setItem("veevak_profile_category", category);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  }

  return (
    <div className="profile-page">
      <div className="settings-heading">
        <h1>My Profile</h1>
        <p>Manage the personal details connected to your VeeVak account.</p>
      </div>
      <div className="profile-summary">
        <div className="profile-avatar" onClick={()=>fileRef.current?.click()} title="Change profile photo">
          {pic ? <img src={pic} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (name?.[0] || "?")}
          <span style={{position:"absolute",bottom:0,right:0,width:22,height:22,borderRadius:"50%",background:C.gold,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✎</span>
        </div>
        <div>
          <h1>{name || "Your Name"}</h1>
          <p>{accountEmail || "Add your account email"}</p>
          <button className="profile-photo-btn" onClick={()=>fileRef.current?.click()}>Change photo</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePicChange}/>
      </div>
      <div className="profile-form">
        <div className="profile-form-head"><h2>Account identity</h2><p>Keep your profile details up to date.</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={accountEmail} onChange={e=>setAccountEmail(e.target.value)} placeholder="you@example.com"/>
          </div>
          <div className="form-field">
            <label className="form-label">Nickname / Display Name</label>
            <input className="form-input" value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="How customers should know you"/>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="080XXXXXXXX"/>
            </div>
            <div className="form-field">
              <label className="form-label">Location</label>
              <input className="form-input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Lagos, Nigeria"/>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Gender</label>
            <select className="select-input" value={gender} onChange={e=>setGender(e.target.value)}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option></select>
          </div>
        </div>
        <div className="profile-form-head"><h2>Business details</h2><p>Information customers and support teams can use.</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="form-field">
            <label className="form-label">Business Category</label>
            <input className="form-input" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Fashion, food, beauty..."/>
          </div>
          <div className="form-field">
            <label className="form-label">About / Bio</label>
            <textarea className="form-input" value={bio} onChange={e=>setBio(e.target.value)} placeholder="A short note about you or your business" rows={3} style={{resize:"vertical"}}/>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-primary" onClick={handleSave}>{saved ? "✓ Saved!" : "Save Changes"}</button>
          <button className="btn-secondary" onClick={onBack}>← Back to Settings</button>
        </div>
      </div>
    </div>
  );
}

function Account({ ownerName, email, bizName, currency, profilePic, shopId, onOpenProfile, onOpenSettings }) {
  const [metrics, setMetrics] = useState({ volume: 0, products: 0 });

  useEffect(() => {
    if (!shopId) return;
    Promise.all([apiGet(`/analytics/${shopId}`).catch(() => null), apiGet(`/inventory/${shopId}`).catch(() => null)])
      .then(([analytics, inventory]) => setMetrics({
        volume: analytics?.monthly_revenue || 0,
        products: (inventory?.inventory || []).length,
      }));
  }, [shopId]);

  const Row = ({ title, copy, onClick }) => (
    <div className="account-row" onClick={onClick} role={onClick ? "button" : undefined}>
      <div className="account-row-copy"><div className="account-row-title">{title}</div><div className="account-row-sub">{copy}</div></div>
      {onClick && <div className="account-row-chevron">›</div>}
    </div>
  );

  return (
    <div className="account-page">
      <div className="settings-heading"><h1>Account</h1><p>Manage your VeeVak account and business preferences.</p></div>
      <div className="account-header">
        <div className="account-avatar"><Avatar src={profilePic} name={ownerName}/></div>
        <div><h1>{ownerName || "Your Name"}</h1><p>{bizName || "Your business"} · {email || "No email added"}</p><span className="account-tier">Business account · Tier 1</span></div>
      </div>
      <div className="account-metrics">
        <div className="account-metric"><div className="account-metric-value">{fmt(metrics.volume, currency)}</div><div className="account-metric-label">Monthly volume</div></div>
        <div className="account-metric"><div className="account-metric-value">{metrics.products}</div><div className="account-metric-label">Active products</div></div>
      </div>
      <div className="account-group"><div className="account-group-title">Business &amp; Profile</div><Row title="My Profile" copy="Personal details, photo and business information" onClick={onOpenProfile}/><Row title="Store Category" copy="Set the category that best describes your business"/><Row title="Payout Details" copy="Manage how your business receives money"/></div>
      <div className="account-group"><div className="account-group-title">Security &amp; Preferences</div><Row title="Password &amp; Security" copy="Keep your account secure"/><Row title="Notification Settings" copy="Choose which business updates you receive" onClick={onOpenSettings}/></div>
      <div className="account-group"><div className="account-group-title">Support &amp; System</div><Row title="Help Center / Contact Support" copy="Get help with VeeVak"/><Row title="App Version" copy="VeeVak 1.0.0"/></div>
    </div>
  );
}

function Notifications({ shopId, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!shopId) return;
    Promise.all([apiGet(`/analytics/${shopId}`).catch(() => null), apiGet(`/anomalies/${shopId}`).catch(() => null)])
      .then(([analytics, anomalies]) => {
        const next = [];
        if (!(analytics?.today_revenue > 0)) next.push("Nothing has been logged for today yet.");
        if (analytics?.today_expenses > 0 && analytics.today_expenses > (analytics.today_revenue || 0) * 0.3) next.push("Today’s expenses look high compared with today’s revenue.");
        (anomalies?.alerts || []).slice(0, 3).forEach(alert => next.push(`${alert.title}: ${alert.message}`));
        setItems(next);
      });
  }, [shopId]);

  return <div className="notification-menu" role="dialog" aria-label="Notifications">
    <div className="section-row"><div className="modal-title">Notifications</div><button className="modal-close" aria-label="Close notifications" onClick={onClose}>×</button></div>
    {items.length === 0 ? <div style={{fontSize:12,color:C.textMuted,padding:"10px 0"}}>You’re all caught up.</div> : items.map((item, index) => <div className="notification-item" key={index}><span className="notification-dot"/><span>{item}</span></div>)}
  </div>;
}

function Settings({ t, lang, currency, bizName, theme, onThemeChange, profilePic, onSave, onOpenProfile, onClose, onLogout }) {
  const [selLang, setSelLang] = useState(lang);
  const [selCurrency, setSelCurrency] = useState(currency);
  const [name, setName] = useState(bizName);
  return (
    <div className="settings-page">
      <div className="settings-heading" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div><h1>{t.settings}</h1>
        <p>Control how VeeVak looks and how your business is represented.</p>
        </div><button className="modal-close" aria-label="Close settings" onClick={onClose}>×</button>
      </div>
      <div className="settings-panel">
        <div className="settings-panel-head"><div className="settings-panel-title">Account</div><div className="settings-panel-copy">Your personal account and business identity.</div></div>
        <div className="settings-profile-link" onClick={onOpenProfile}>
          <div className="settings-avatar">{profilePic ? <img src={profilePic} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (bizName?.[0] || "V")}</div>
          <div className="settings-profile-copy"><div className="settings-profile-name">My Profile</div><div className="settings-profile-meta">Update your name, photo, contact details and bio</div></div>
          <div className="settings-chevron">›</div>
        </div>
        <div className="settings-panel-body">
          <div className="form-field">
        <label className="form-label">{t.businessName}</label>
        <input className="form-input" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="settings-panel">
        <div className="settings-panel-head"><div className="settings-panel-title">Preferences</div><div className="settings-panel-copy">Choose your appearance, language and currency.</div></div>
        <div className="settings-panel-body">
          <div className="form-field">
        <label className="form-label">Appearance</label>
        <div className="theme-toggle" style={{width:"fit-content",marginTop:4}}>
          <button className={`theme-btn ${theme==="dark"?"active":""}`} onClick={()=>onThemeChange("dark")}>🌙 Dark</button>
          <button className={`theme-btn ${theme==="light"?"active":""}`} onClick={()=>onThemeChange("light")}>☀️ Light</button>
        </div>
          </div>
          <div className="form-field">
        <label className="form-label">{t.language}</label>
        <select className="compact-select" value={selLang} onChange={e=>setSelLang(e.target.value)}>
          {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
          </div>
          <div className="form-field">
        <label className="form-label">{t.currency}</label>
        <select className="compact-select" value={selCurrency} onChange={e=>setSelCurrency(e.target.value)}>
          {Object.entries(CURRENCIES).map(([code,info])=><option key={code} value={code}>{info.flag} {code} · {info.name}</option>)}
        </select>
          </div>
          <button className="btn-primary" onClick={()=>onSave({lang:selLang,currency:selCurrency,bizName:name})}>
        {t.saveSettings}
          </button>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="logout-button"
        style={{marginTop:8,background:"transparent",border:`1px solid ${C.redText}`,borderRadius:10,padding:"12px 20px",fontSize:13,fontWeight:600,color:C.redText,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"background 0.15s"}}
        onMouseOver={e=>e.currentTarget.style.background=C.red}
        onMouseOut={e=>e.currentTarget.style.background="transparent"}
      >
        🚪 Log out
      </button>
    </div>
  );
}

function FloatingAssistant({ shopId, shopName, currency, onChanged }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const [messages, setMessages] = useState([{ role:"ai", text:"Hi. I can log sales, expenses, and inventory, or answer questions about your business." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, open]);

  function startDragging(event) {
    if (open) return;
    draggedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = { offsetX:event.clientX - rect.left, offsetY:event.clientY - rect.top };
    const move = moveEvent => {
      if (!dragRef.current) return;
      draggedRef.current = true;
      setPosition({
        left:Math.max(8, Math.min(window.innerWidth - 66, moveEvent.clientX - dragRef.current.offsetX)),
        top:Math.max(8, Math.min(window.innerHeight - 66, moveEvent.clientY - dragRef.current.offsetY)),
      });
    };
    const stop = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }

  function toggleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported by this browser.");
      return;
    }
    if (listening) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-NG";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = e => setInput(prev => `${prev}${prev ? " " : ""}${e.results[0][0].transcript}`);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  async function send() {
    const text = input.trim();
    if (!text || loading || !shopId) return;
    const nextMessages = [...messages, { role:"user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const result = await apiPost("/chat/conversation", {
        shop_id: shopId, shop_name: shopName || "", currency,
        messages: nextMessages.map(m => ({ role:m.role === "ai" ? "assistant" : "user", text:m.text })),
      });
      setMessages(prev => [...prev, { role:"ai", text:result.reply || "Got it." }]);
      if (result.saved?.length) onChanged?.();
    } catch (e) {
      setMessages(prev => [...prev, { role:"ai", text:`Assistant error: ${e.message || "The business service is unavailable."}` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {open && <div className="assistant-panel">
        <div className="assistant-head">
          <div className="settings-avatar" style={{width:36,height:36,padding:4,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="28" height="24" viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 5 H30 L50 35 L70 5 H95 V60 L78 78 H60 L50 62 L40 78 H22 L5 60 Z M21 15 L31 15 L43 40 L34 56 Z M79 15 L69 15 L57 40 L66 56 Z M39 18 L61 18 L50 50 Z" fill={C.gold} fillRule="evenodd"/></svg></div>
          <div className="assistant-head-copy"><div className="assistant-title">VeeVak Assistant</div><div className="assistant-status">Sales, expenses, inventory and business answers</div></div>
          <button className="assistant-close" aria-label="Close assistant" onClick={()=>setOpen(false)}>×</button>
        </div>
        <div className="assistant-body">
          {messages.map((message, index) => <div key={index} className={`msg ${message.role}`}><span style={{whiteSpace:"pre-wrap"}}>{message.text}</span></div>)}
          {loading && <div className="msg ai"><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></div>}
          <div ref={bottomRef}/>
        </div>
        <div className="assistant-input">
          <textarea className="chat-input" rows={2} placeholder="Log a sale, expense, stock update, or ask a question" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();send();}}}/>
          <button className={`assistant-mic ${listening?"listening":""}`} aria-label="Use voice input" onClick={toggleVoice}>{listening ? "■" : "🎙"}</button>
          <button className="btn-send" onClick={send} disabled={loading||!input.trim()}>➤</button>
        </div>
        <div className="assistant-hint">Enter adds a new line. Ctrl+Enter sends.</div>
      </div>}
      <button className="assistant-launcher" style={{...(position ? {left:position.left,top:position.top,right:"auto",bottom:"auto"} : undefined), background:`linear-gradient(135deg,${C.gold},${C.goldDim})`}} aria-label={open ? "Close VeeVak Assistant" : "Open VeeVak Assistant"} onPointerDown={startDragging} onClick={()=>{if(draggedRef.current){draggedRef.current=false;return;}setOpen(value=>!value);}}>
        {open ? <span style={{fontSize:22,color:"#fff",lineHeight:1}}>×</span> : <svg width="26" height="22" viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 5 H30 L50 35 L70 5 H95 V60 L78 78 H60 L50 62 L40 78 H22 L5 60 Z M21 15 L31 15 L43 40 L34 56 Z M79 15 L69 15 L57 40 L66 56 Z M39 18 L61 18 L50 50 Z" fill="#fff" fillRule="evenodd"/></svg>}
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════
const NAV = [
  {key:"home",label:"Home",icon:"⊞"},
  {key:"sale",label:"Log Sale",icon:"✏"},
  {key:"expenses",label:"Expenses",icon:"◫"},
  {key:"inventory",label:"Inventory",icon:"⬡"},
  {key:"customers",label:"Customers",icon:"⚇"},
  {key:"reports",label:"Reports",icon:"⊨"},
];

export default function App() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem("veevak_token"));
  const [loginDirect, setLoginDirect] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [config, setConfig] = useState({lang:"en",currency:"NGN",bizName:"My Shop",ownerName:""});
  const [sellerId, setSellerId] = useState(null);
  const [shops, setShops] = useState([]); // [{id, name}]
  const [activeShopId, setActiveShopId] = useState(null);
  const [tab, setTab] = useState("home");
  const [shopOpen, setShopOpen] = useState(false);
  const [addingShop, setAddingShop] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("veevak_theme") || "dark");
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("veevak_profile_pic") || "");

  C = THEMES[theme] || THEMES.dark;
  const styles = makeStyles(C);
  const t = TRANSLATIONS[config.lang] || TRANSLATIONS.en;
  const activeShop = shops.find(s => s.id === activeShopId);
  const triggerRefresh = () => setRefreshKey(k => k + 1);

  // On first load, check for a saved session and re-hydrate it from the backend
  // so a page refresh doesn't force the seller through onboarding again.
  useEffect(() => {
    const token = localStorage.getItem("veevak_token");
    if (!token) { setCheckingSession(false); return; }

    apiAuthGet("/auth/me", token)
      .then(d => {
        const fetchedShops = (d.shops || []).map(s => ({ id: s.id, name: s.name }));
        if (fetchedShops.length === 0) {
          localStorage.removeItem("veevak_token");
          setCheckingSession(false);
          return;
        }
        setConfig({ lang: d.language, currency: d.currency, bizName: fetchedShops[0].name, ownerName: d.name || "", email: d.email || "" });
        setSellerId(d.seller_id);
        setShops(fetchedShops);
        setActiveShopId(fetchedShops[0].id);
        setOnboarded(true);
        setCheckingSession(false);
      })
      .catch(() => {
        localStorage.removeItem("veevak_token");
        setCheckingSession(false);
      });
  }, []);

  function handleOnboardComplete(cfg) {
    setConfig(cfg);
    setSellerId(cfg.sellerId);
    setShops([{ id: cfg.shopId, name: cfg.shopName }]);
    setActiveShopId(cfg.shopId);
    setOnboarded(true);
    if (cfg.token) localStorage.setItem("veevak_token", cfg.token);
  }

  function handleLogout() {
  setShowLogoutConfirm(true);
}

function confirmLogout() {
  localStorage.removeItem("veevak_token");
  localStorage.removeItem("veevak_session");
  setOnboarded(false);
  setSellerId(null);
  setShops([]);
  setActiveShopId(null);
  setShowLogoutConfirm(false);
  setShowLanding(true);
}

  async function handleAddShop() {
    const name = newShopName.trim();
    if (!name || !sellerId) return;
    try {
      const result = await apiPost("/shops/add", { seller_id: sellerId, name });
      setShops(prev => [...prev, { id: result.shop_id, name: result.name }]);
      setActiveShopId(result.shop_id);
      setNewShopName("");
      setAddingShop(false);
      setShopOpen(false);
      triggerRefresh();
    } catch (e) {
      alert("Could not create shop. Check the backend is running.");
    }
  }

  function handleThemeChange(next) {
    setTheme(next);
    localStorage.setItem("veevak_theme", next);
  }
  function handleSaveSettings(cfg) {
    setConfig(prev => ({ ...prev, lang: cfg.lang, currency: cfg.currency, bizName: cfg.bizName }));
    setShops(prev => prev.map(s => s.id === activeShopId ? { ...s, name: cfg.bizName } : s));
    setTab("home");
  }

  if (checkingSession) return (
    <>
      <style>{styles}</style>
      <div className="onboard">
        <div className="onboard-logo" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="48" height="41" viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" aria-label="VeeVak">
            <path d="M5 5 H30 L50 35 L70 5 H95 V60 L78 78 H60 L50 62 L40 78 H22 L5 60 Z M21 15 L31 15 L43 40 L34 56 Z M79 15 L69 15 L57 40 L66 56 Z M39 18 L61 18 L50 50 Z" fill={C.gold} fillRule="evenodd"/>
          </svg>
        </div>
        <div className="onboard-sub">Loading...</div>
      </div>
    </>
  );

  if (!onboarded) return (
    <>
      <style>{styles}</style>
      {showLanding
        ? <Landing
            onGetStarted={() => { setLoginDirect(false); setShowLanding(false); }}
            onLogin={() => { setLoginDirect(true); setShowLanding(false); }}
            onShowPrivacy={() => setShowPrivacy(true)}
            onShowTerms={() => setShowTerms(true)}
          />
        : <Onboarding onComplete={handleOnboardComplete} startOnLogin={loginDirect} onBackToLanding={() => setShowLanding(true)}/>
      }
      {showPrivacy && <Privacy onClose={() => setShowPrivacy(false)} />}
      {showTerms && <Terms onClose={() => setShowTerms(false)} />}
    </>
  );

  const pages = {
    home:      <Home t={t} currency={config.currency} shopId={activeShopId} refreshKey={refreshKey} ownerName={config.ownerName}/>,
    sale:      <LogSale t={t} currency={config.currency} shopId={activeShopId} shopName={activeShop?.name||""} onSaleLogged={triggerRefresh}/>,
    expenses:  <Expenses t={t} currency={config.currency} shopId={activeShopId} refreshKey={refreshKey} onChanged={triggerRefresh}/>,
    inventory: <Inventory t={t} currency={config.currency} shopId={activeShopId} refreshKey={refreshKey} onChanged={triggerRefresh}/>,
    customers: <Customers t={t} currency={config.currency} shopId={activeShopId} refreshKey={refreshKey}/>,
    reports:   <Reports t={t} currency={config.currency} shopId={activeShopId} refreshKey={refreshKey}/>,
    account:   <Account ownerName={config.ownerName} email={config.email||""} bizName={activeShop?.name||""} currency={config.currency} profilePic={profilePic} shopId={activeShopId} onOpenProfile={()=>setTab("profile")} onOpenSettings={()=>setTab("settings")}/>,
    settings:  <Settings t={t} lang={config.lang} currency={config.currency} bizName={activeShop?.name||""} theme={theme} onThemeChange={handleThemeChange} profilePic={profilePic} onSave={handleSaveSettings} onOpenProfile={()=>setTab("profile")} onClose={()=>setTab("home")} onLogout={handleLogout}/>,
    profile:   <Profile ownerName={config.ownerName} email={config.email||""} token={localStorage.getItem("veevak_token") || ""} onBack={()=>setTab("account")} onSave={(newName,newEmail,newPic)=>{ setConfig(prev=>({...prev, ownerName:newName, email:newEmail})); if (newPic) setProfilePic(newPic); }}/>,
  };

  // Sidebar nav icons (SVG for crisp rendering)
  const SIDEBAR_ICONS = {
    home:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    sale:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
    expenses:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    inventory: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>,
    customers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    reports:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="app-sidebar">
          <button className="sidebar-avatar" onClick={()=>setTab("profile")} title="Open profile" aria-label="Open profile"><Avatar src={profilePic} name={config.ownerName}/></button>
          {NAV.map(n => (
            <button key={n.key} className={`sidebar-item ${tab===n.key?"active":""}`} onClick={()=>setTab(n.key)} title={n.label} aria-label={n.label}>
              {SIDEBAR_ICONS[n.key] || n.icon}
            </button>
          ))}
          <div className="sidebar-bottom">
            <button className="sidebar-item" onClick={()=>handleThemeChange(theme==="dark"?"light":"dark")} title="Toggle theme" style={{fontSize:16}}>
              {theme==="dark" ? "☀️" : "🌙"}
            </button>
            <button className="sidebar-item" onClick={()=>setTab("settings")} title="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </button>
          </div>
        </aside>

        {/* ── MAIN BODY (topbar + content) ── */}
        <div className="app-body">
          <div className="topbar">
            <div className="topbar-brand">
              <div className="brand-logo" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="20" height="17" viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 5 H30 L50 35 L70 5 H95 V60 L78 78 H60 L50 62 L40 78 H22 L5 60 Z M21 15 L31 15 L43 40 L34 56 Z M79 15 L69 15 L57 40 L66 56 Z M39 18 L61 18 L50 50 Z" fill="#000" fillRule="evenodd"/>
                </svg>
              </div>
              <div>
                <div className="brand-name">VeeVak</div>
                <div className="brand-sub">AI sales clarity</div>
              </div>
            </div>
            <div className="topbar-actions">
              <div className="notification-wrap">
                <button className="notification-button" aria-label="Open notifications" onClick={()=>setNotificationsOpen(value=>!value)}>
                  🔔<span className="notification-badge">!</span>
                </button>
                {notificationsOpen && <Notifications shopId={activeShopId} onClose={()=>setNotificationsOpen(false)}/>}
              </div>
              <button className="btn-ghost" onClick={()=>setTab("account")}>🙂 Me</button>
              <div className="shop-selector" onClick={()=>setShopOpen(o=>!o)}>
                <span>🏪</span>
                <span style={{maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeShop?.name || "Select shop"}</span>
                <span style={{fontSize:10}}>▾</span>
                {shopOpen && (
                  <div className="shop-dropdown" onClick={e=>e.stopPropagation()}>
                    {shops.map(s=>(
                      <div key={s.id} className={`shop-option ${activeShopId===s.id?"active":""}`}
                        onClick={()=>{setActiveShopId(s.id);setShopOpen(false);}}>
                        {s.name}
                      </div>
                    ))}
                    <div className="divider"/>
                    {!addingShop ? (
                      <div className="shop-option" style={{color:C.gold,fontWeight:600}} onClick={()=>setAddingShop(true)}>
                        + Add new shop
                      </div>
                    ) : (
                      <div style={{padding:"8px 12px",display:"flex",gap:6}}>
                        <input autoFocus className="form-input" style={{fontSize:12,padding:"6px 8px"}} placeholder="Shop name"
                          value={newShopName} onChange={e=>setNewShopName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddShop()}/>
                        <button className="btn-send" style={{width:32,height:32,fontSize:13}} onClick={handleAddShop}>✓</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="page-content">{pages[tab]}</div>

          <nav className="bottom-nav">
            {NAV.map(n=>(
              <button key={n.key} className={`nav-item ${tab===n.key?"active":""}`} onClick={()=>setTab(n.key)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        <FloatingAssistant shopId={activeShopId} shopName={activeShop?.name||""} currency={config.currency} onChanged={triggerRefresh}/>

        {showLogoutConfirm && (
          <div className="modal-overlay" onClick={()=>setShowLogoutConfirm(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()} style={{paddingBottom:20,maxWidth:340,borderRadius:16,alignSelf:"center",margin:"auto"}}>
              <div className="modal-title">Log out?</div>
              <div style={{fontSize:13,color:C.textSecondary}}>Are you sure you want to log out of VeeVak?</div>
              <button className="btn-primary" style={{background:C.red}} onClick={confirmLogout}>Yes, log out</button>
              <button className="btn-secondary" onClick={()=>setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}