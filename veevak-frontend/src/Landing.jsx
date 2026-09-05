import { useState, useEffect, useRef } from "react";
// NOTE: veevak-logo.png intentionally removed — logo is inline SVG below
import heroIllustration from "./assets/hero-illustration.jpg";
import showcaseChatSales from "./assets/showcase-chat-sales.jpg";
import showcaseDashboard from "./assets/showcase-dashboard.jpg";
import showcaseHappyOwner from "./assets/showcase-happy-owner.jpg";
import showcasePlatforms from "./assets/showcase-platforms.jpg";

// ── Correct VeeVak logo SVG — W/double-V shape matching the brand logo ─
// Single compound path with evenodd fill so inner triangles are transparent
function VeevakLogoSVG({ size = 36, color = "#8b7ff5" }) {
  // Outer W shell + three inner cutout triangles in one path (evenodd rule)
  const d = [
    // Outer W shape (clockwise)
    "M5 5 H30 L50 35 L70 5 H95 V60 L78 78 H60 L50 62 L40 78 H22 L5 60 Z",
    // Left cutout triangle (counter-clockwise = hole)
    "M21 15 L31 15 L43 40 L34 56 Z",
    // Right cutout triangle (counter-clockwise = hole)
    "M79 15 L69 15 L57 40 L66 56 Z",
    // Centre V cutout (counter-clockwise = hole)
    "M39 18 L61 18 L50 50 Z",
  ].join(" ");
  return (
    <svg width={size} height={Math.round(size * 0.85)} viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" aria-label="VeeVak">
      <path d={d} fill={color} fillRule="evenodd"/>
    </svg>
  );
}

// ── Softer colour palette — comfortable contrast, not harsh ──────────
const L = {
  bg:            "#11111f",   // dark indigo, not pitch black
  surface:       "#181828",
  surface2:      "#1e1e34",
  border:        "#2e2e50",
  accent:        "#8b7ff5",   // slightly softer purple
  accentDim:     "#312c6e",
  accentLight:   "#c4bcff",   // softer lavender
  textPrimary:   "#e8e6ff",   // off-white, not stark white
  textSecondary: "#9898b8",   // muted lavender-grey
  textMuted:     "#5a5a7a",
  coral:         "#d9624a",   // slightly softer coral
  navBg:         "rgba(17,17,31,0.93)",
};

// ── SVG Social Icons ───────────────────────────────────────────────────
const InstagramSVG = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill={color}/>
  </svg>
);

const LinkedInSVG = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const XSVG = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.859L2.25 2.25h6.978l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
);

// ── Showcase carousel ──────────────────────────────────────────────────
const showcaseSlides = [
  { src: showcaseChatSales,  alt: "WhatsApp sales being tracked",      caption: "From chat conversations…"      },
  { src: showcasePlatforms,  alt: "Multiple platforms connected",       caption: "Across all your platforms…"    },
  { src: showcaseDashboard,  alt: "Business analytics dashboard",       caption: "Into clear business insights…" },
  { src: showcaseHappyOwner, alt: "Happy business owner",               caption: "Empowering your decisions"     },
];

function CinematicShowcase() {
  const [idx, setIdx]           = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 4000, TICK = 50;
  useEffect(() => {
    const pt = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 100 / (DURATION / TICK)), TICK);
    const st = setInterval(() => { setIdx(i => (i + 1) % showcaseSlides.length); setProgress(0); }, DURATION);
    return () => { clearInterval(pt); clearInterval(st); };
  }, []);
  const slide = showcaseSlides[idx];
  return (
    <section className="l-section" style={{ background: L.surface }}>
      <div className="l-container">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="l-badge">See It In Action</span>
          <h2 className="l-h2">The VeeVak Experience</h2>
        </div>
        <div style={{ borderRadius: 18, overflow: "hidden", position: "relative", aspectRatio: "16/9", background: L.surface2, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", gap: 6, padding: 12 }}>
            {showcaseSlides.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.18)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#fff", width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%", transition: "width 0.1s linear" }} />
              </div>
            ))}
          </div>
          <img src={slide.src} alt={slide.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,17,31,0.85) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 32px", zIndex: 10 }}>
            <p style={{ fontSize: "clamp(17px,3vw,24px)", fontWeight: 700, color: "#fff", margin: 0 }}>{slide.caption}</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          {showcaseSlides.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setProgress(0); }} className="l-dot" style={{ width: i === idx ? 24 : 8, background: i === idx ? L.accent : L.border }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Values marquee ─────────────────────────────────────────────────────
const VALUES = ["Human-first technology","Responsible use of AI","Building for real-world behaviour","Accessibility over complexity","Empowering small businesses"];
function ValuesMarquee() {
  const items = [...VALUES, ...VALUES, ...VALUES];
  return (
    <div style={{ overflow: "hidden", padding: "16px 0" }}>
      <div style={{ display: "flex", gap: 16, animation: "lmarquee 28s linear infinite", width: "max-content" }}>
        {items.map((v, i) => (
          <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: L.surface, border: `1px solid ${L.border}`, borderRadius: 30 }}>
            <span style={{ color: L.accent, fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: L.textPrimary, whiteSpace: "nowrap" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Solutions carousel ─────────────────────────────────────────────────
const SOLUTIONS = [
  { icon: "💰", title: "Accounting software",  desc: "Too complex for informal sellers" },
  { icon: "🏪", title: "POS systems",           desc: "Only work for stores with fixed locations" },
  { icon: "📱", title: "Ecommerce platforms",   desc: "Require full online shops" },
  { icon: "💬", title: "Platform tools",        desc: "Locked to a single app" },
];
function SolutionsCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % SOLUTIONS.length), 3500); return () => clearInterval(t); }, []);
  const s = SOLUTIONS[idx];
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", background: L.accentDim + "55", borderRadius: 16, padding: "28px 24px" }}>
      <div style={{ minHeight: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 38, marginBottom: 12 }}>{s.icon}</div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: L.textPrimary, margin: "0 0 8px" }}>{s.title}</h3>
        <p style={{ fontSize: 14, color: L.textSecondary, margin: 0 }}>{s.desc}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
        {SOLUTIONS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className="l-dot" style={{ width: i === idx ? 24 : 8, background: i === idx ? L.coral : L.border }} />
        ))}
      </div>
    </div>
  );
}

// ── Hero carousel ──────────────────────────────────────────────────────
const HERO_SLIDES = [
  { title: "Turn chat conversations into business insights", desc: "Millions of small businesses sell every day through chats and offline sales, yet most operate without clear visibility into their sales, customers, or growth." },
  { title: "VeeVak exists to change that", desc: "Simple tools designed for how you actually work. No spreadsheets, no accounting jargon. Just clarity for your business." },
];
function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 6000); return () => clearInterval(t); }, []);
  const s = HERO_SLIDES[idx];
  return (
    <div style={{ minHeight: 130, textAlign: "center", padding: "0 8px" }}>
      <h2 style={{ fontSize: "clamp(17px,3.2vw,24px)", fontWeight: 600, color: L.textPrimary, margin: "0 0 12px", lineHeight: 1.4 }}>{s.title}</h2>
      <p style={{ fontSize: "clamp(13px,1.8vw,15px)", color: L.textSecondary, margin: 0, lineHeight: 1.75, maxWidth: 580, marginInline: "auto" }}>{s.desc}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className="l-dot" style={{ width: i === idx ? 24 : 8, background: i === idx ? L.accent : L.border }} />
        ))}
      </div>
    </div>
  );
}

// ── FAQ accordion ──────────────────────────────────────────────────────
const FAQS = [
  { q: "Is VeeVak free to use?",                         a: "Yes — VeeVak is free to get started. Create an account and begin logging sales immediately. We plan to introduce optional paid features in the future, but your core tools will always be free." },
  { q: "Do I need any technical knowledge?",              a: "None at all. If you can send a WhatsApp message, you can use VeeVak. Just paste your chats or fill a quick form and VeeVak handles the rest." },
  { q: "How does the chat extraction work?",              a: "You paste or upload your WhatsApp, Instagram, or Facebook conversation. VeeVak's AI reads it and pulls out the sales — product names, prices, customer names, and payment info — into your dashboard automatically." },
  { q: "Is my business data safe?",                       a: "Your data is yours. VeeVak processes it only to give you insights. We do not sell, share, or publish your business data to any third party." },
  { q: "What platforms does VeeVak support?",             a: "WhatsApp, Instagram, Facebook, TikTok, and offline / in-person sales. You can also log sales manually via a quick form at any time." },
  { q: "Can I use VeeVak for any business type?",        a: "Yes. VeeVak works for fashion, food, beauty, electronics, services, and more. If you sell through conversations or offline, VeeVak is built for you." },
  { q: "Does VeeVak work for businesses outside Nigeria?",a: "Absolutely. VeeVak supports NGN, USD, and GBP and is designed for any informal or small business. While we started in Nigeria, the problem is global." },
];
function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth: 760, marginInline: "auto" }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${L.border}` }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", background: "none", border: "none", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: L.textPrimary, lineHeight: 1.4 }}>{faq.q}</span>
            <span style={{ fontSize: 20, color: L.accent, flexShrink: 0, display: "inline-block", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
          </button>
          {open === i && <div style={{ padding: "0 0 18px", fontSize: 14, color: L.textSecondary, lineHeight: 1.8 }}>{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Landing chat widget ────────────────────────────────────────────────
const CHAT_ANSWERS = {
  default:   "Good question! VeeVak is an AI business clarity tool for small business owners. You can ask me about features, pricing, how it works, or who it's built for.",
  what:      "VeeVak is an AI-powered sales clarity tool built for small and informal business owners in Nigeria. You log or paste your WhatsApp/Instagram chats and VeeVak automatically extracts your sales, expenses, and customer data — then shows you clear business insights.",
  free:      "Yes! VeeVak is completely free to get started. Click 'Get Started Free' to create your account now.",
  price:     "VeeVak is free to use. Premium features may be introduced later but core tools stay free for small business owners.",
  safe:      "Absolutely. Your data is used only to power your own insights. We never sell or share your business data with anyone.",
  work:      "VeeVak works in 3 steps: (1) paste or upload your WhatsApp/Instagram chat exports, (2) our AI extracts sales, expenses and customer names automatically, (3) you see it all on a clean dashboard with reports and forecasts.",
  instagram: "Yes! Paste your Instagram DM conversations into VeeVak and it will extract your orders automatically — no manual entry needed.",
  whatsapp:  "Yes! WhatsApp is VeeVak's primary platform. Export a chat (tap the chat → three dots → Export Chat) and paste it into VeeVak. Done.",
  nigeria:   "VeeVak was built in Nigeria and is optimised for Nigerian informal commerce — NGN currency, Ankara sellers, food businesses, beauty services, and local business patterns.",
  signup:    "Click 'Get Started Free' at the top of the page. It takes under 2 minutes to create an account — no credit card needed.",
  report:    "Yes! VeeVak's Reports page shows your revenue over time, top products, busiest days, and a 14-day AI revenue forecast so you can plan ahead.",
  forecast:  "VeeVak uses a machine learning model (Prophet) to forecast your revenue for the next 14 days based on your sales history. The more you log, the more accurate it gets.",
  customer:  "VeeVak automatically builds a customer list from your chat extractions. You can see who buys most often, their order history, and total spend.",
  inventory: "Yes! VeeVak has an inventory tracker. Log stock levels and it will alert you when items are running low.",
  expense:   "Yes! You can log expenses — materials, transport, rent, data — and VeeVak will show your net profit after costs.",
  ai:        "VeeVak uses Google Gemini AI to read and understand your sales conversations, then converts them into structured business data automatically.",
  mobile:    "VeeVak works in any mobile browser — no app download needed. Just open the link on your phone and it works like a native app.",
  support:   "You can reach us at info.veevak@gmail.com — we typically reply within 24 hours. We also have a growing help section in the app.",
};

function matchAnswer(msg) {
  const m = msg.toLowerCase();
  // "what is veevak" and general "what/who/tell me" questions
  if (m.includes("what is") || m.includes("what's") || m.includes("tell me about") || m.includes("who is") || (m.includes("what") && m.includes("veevak"))) return CHAT_ANSWERS.what;
  if (m.includes("forecast") || m.includes("predict") || m.includes("future")) return CHAT_ANSWERS.forecast;
  if (m.includes("report") || m.includes("analytic") || m.includes("insight") || m.includes("dashboard")) return CHAT_ANSWERS.report;
  if (m.includes("customer") || m.includes("client") || m.includes("buyer")) return CHAT_ANSWERS.customer;
  if (m.includes("inventory") || m.includes("stock") || m.includes("product")) return CHAT_ANSWERS.inventory;
  if (m.includes("expense") || m.includes("cost") && m.includes("track") || m.includes("profit")) return CHAT_ANSWERS.expense;
  if (m.includes("free") || (m.includes("cost") && !m.includes("track")) || m.includes("pay") || m.includes("charge") || m.includes("subscription")) return CHAT_ANSWERS.free;
  if (m.includes("price") || m.includes("pricing") || m.includes("plan") || m.includes("tier")) return CHAT_ANSWERS.price;
  if (m.includes("safe") || m.includes("secur") || m.includes("data") || m.includes("privacy") || m.includes("trust")) return CHAT_ANSWERS.safe;
  if ((m.includes("how") && (m.includes("work") || m.includes("use") || m.includes("start"))) || m.includes("explain")) return CHAT_ANSWERS.work;
  if (m.includes("ai") || m.includes("gemini") || m.includes("machine learning") || m.includes("model")) return CHAT_ANSWERS.ai;
  if (m.includes("instagram") || m.includes("ig ") || m.includes("ig,") || m.includes("dm")) return CHAT_ANSWERS.instagram;
  if (m.includes("whatsapp") || m.includes("wha")) return CHAT_ANSWERS.whatsapp;
  if (m.includes("nigeria") || m.includes("naira") || m.includes("ngn") || m.includes("lagos") || m.includes("abuja")) return CHAT_ANSWERS.nigeria;
  if (m.includes("sign") || m.includes("register") || m.includes("account") || m.includes("join") || m.includes("creat")) return CHAT_ANSWERS.signup;
  if (m.includes("phone") || m.includes("mobile") || m.includes("app") || m.includes("download")) return CHAT_ANSWERS.mobile;
  if (m.includes("help") || m.includes("support") || m.includes("contact") || m.includes("email")) return CHAT_ANSWERS.support;
  if (m.includes("start") || m.includes("begin") || m.includes("try")) return CHAT_ANSWERS.signup;
  return CHAT_ANSWERS.default;
}

function LandingChat() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [msgs, setMsgs]       = useState([{ from: "bot", text: "Hi! 👋 I'm VeeVak's assistant. Ask me anything about the product." }]);
  const [loading, setLoading] = useState(false);
  // Drag state — lets user reposition the launcher button
  const [pos, setPos]         = useState(null); // null = default bottom-right
  const dragRef               = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const didDragRef            = useRef(false);
  const bottomRef             = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMsgs(prev => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMsgs(prev => [...prev, { from: "bot", text: matchAnswer(text) }]);
      setLoading(false);
    }, 900);
  }

  // Drag logic for the launcher button
  function onPointerDown(e) {
    didDragRef.current = false;
    dragRef.current = {
      dragging: true,
      startX: e.clientX, startY: e.clientY,
      origX: pos ? pos.right : 24,
      origY: pos ? pos.bottom : 28,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    e.preventDefault();
  }
  function onPointerMove(e) {
    const d = dragRef.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragRef.current = true;
    // right/bottom relative to viewport edges
    setPos({ right: Math.max(8, d.origX - dx), bottom: Math.max(8, d.origY - dy) });
  }
  function onPointerUp() {
    dragRef.current.dragging = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  const btnRight  = pos ? pos.right  : 24;
  const btnBottom = pos ? pos.bottom : 28;
  // Chat panel anchors above the launcher button
  const panelRight  = btnRight;
  const panelBottom = btnBottom + 64;

  return (
    <>
      {open && (
        <div style={{ position: "fixed", right: panelRight, bottom: panelBottom, width: "min(360px,calc(100vw - 32px))", height: "min(480px,calc(100vh - 120px))", display: "flex", flexDirection: "column", background: L.surface, border: `1px solid ${L.border}`, borderRadius: 16, overflow: "hidden", zIndex: 999, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${L.border}`, background: L.surface2 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg,${L.accent},${L.accentDim})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <VeevakLogoSVG size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: L.textPrimary }}>VeeVak Assistant</div>
              <div style={{ fontSize: 11, color: L.textSecondary }}>Ask me anything about VeeVak</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: L.textSecondary, fontSize: 20, cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ maxWidth: "85%", padding: "10px 13px", borderRadius: 12, fontSize: 13, lineHeight: 1.6, alignSelf: m.from === "user" ? "flex-end" : "flex-start", background: m.from === "user" ? L.accentDim : L.surface2, color: L.textPrimary, borderBottomRightRadius: m.from === "user" ? 3 : 12, borderBottomLeftRadius: m.from === "bot" ? 3 : 12 }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: L.surface2, borderRadius: 12, borderBottomLeftRadius: 3, padding: "10px 16px", display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: L.textSecondary, display: "inline-block", animation: `lc-dot 1.2s ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px", borderTop: `1px solid ${L.border}` }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Type a question…"
              style={{ flex: 1, background: L.surface2, border: `1px solid ${L.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: L.textPrimary, outline: "none", fontFamily: "inherit" }} />
            <button onClick={send} disabled={!input.trim() || loading}
              style={{ width: 38, height: 38, borderRadius: 8, background: L.accent, border: "none", color: "#fff", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: !input.trim() ? 0.5 : 1, transition: "opacity 0.15s" }}>
              ➤
            </button>
          </div>
        </div>
      )}
      {/* Launcher button — draggable */}
      <button
        onPointerDown={onPointerDown}
        onClick={() => { if (didDragRef.current) return; setOpen(o => !o); }}
        aria-label={open ? "Close assistant" : "Chat with us"}
        style={{ position: "fixed", right: btnRight, bottom: btnBottom, width: 56, height: 56, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${L.accent},${L.accentDim})`, cursor: "grab", zIndex: 998, boxShadow: "0 8px 28px rgba(139,127,245,0.45)", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none", userSelect: "none" }}>
        {open ? <span style={{ fontSize: 22, color: "#fff", lineHeight: 1 }}>×</span> : <VeevakLogoSVG size={28} color="#fff" />}
      </button>
      <style>{`@keyframes lc-dot{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </>
  );
}

// ── Mobile menu ────────────────────────────────────────────────────────
function MobileMenu({ onGetStarted, onLogin, scrollTo }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "problem", label: "Problem" }, { id: "features", label: "Features" },
    { id: "solution", label: "Solution" }, { id: "faqs", label: "FAQs" }, { id: "contact", label: "Contact" },
  ];
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{ background: "transparent", border: `1px solid ${L.border}`, color: L.textPrimary, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 18 }}>
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, background: L.surface, borderBottom: `1px solid ${L.border}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4, zIndex: 200 }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={() => { scrollTo(l.id); setOpen(false); }}
              style={{ color: L.textSecondary, textDecoration: "none", fontSize: 15, fontWeight: 500, padding: "10px 0", borderBottom: `1px solid ${L.border}` }}>
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            <button onClick={() => { onGetStarted(); setOpen(false); }} style={{ background: L.coral, border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Get Started Free</button>
            <button onClick={() => { onLogin(); setOpen(false); }} style={{ background: "transparent", border: `1px solid ${L.border}`, borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 500, color: L.textSecondary, cursor: "pointer" }}>Log In</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Scroll-reveal hook ─────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("l-visible"); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".l-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ── Main Landing component ─────────────────────────────────────────────
export default function Landing({ onGetStarted, onLogin, onShowPrivacy, onShowTerms }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 900);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("scroll",  onScroll);
    window.addEventListener("resize",  onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }
  const handleLogin = onLogin || onGetStarted;

  const W   = { maxWidth: 1080, margin: "0 auto", padding: "0 28px" };
  const sec = (bg = L.bg) => ({ background: bg });
  const card = { background: L.surface, border: `1px solid ${L.border}`, borderRadius: 14, padding: "24px 28px" };
  const H2 = { fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: L.textPrimary, margin: "0 0 14px", lineHeight: 1.2 };
  const Sub = { fontSize: "clamp(14px,2vw,16px)", color: L.textSecondary, lineHeight: 1.75, maxWidth: 640, marginInline: "auto", margin: 0 };

  const checkItem = txt => (
    <li key={txt} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <span style={{ color: L.accent, fontSize: 15, marginTop: 2, flexShrink: 0 }}>✓</span>
      <span style={{ color: L.textSecondary, fontSize: 14, lineHeight: 1.65 }}>{txt}</span>
    </li>
  );

  const navLinks = [
    { id: "problem", label: "Problem" }, { id: "features", label: "Features" },
    { id: "solution", label: "Solution" }, { id: "faqs", label: "FAQs" }, { id: "contact", label: "Contact" },
  ];

  return (
    <div style={{ background: L.bg, color: L.textPrimary, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* ── Global styles ──────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        /* Marquee */
        @keyframes lmarquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }

        /* Scroll-reveal */
        .l-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .l-reveal.l-visible { opacity: 1; transform: translateY(0); }
        .l-reveal-left { opacity: 0; transform: translateX(-28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .l-reveal-left.l-visible { opacity: 1; transform: translateX(0); }
        .l-reveal-right { opacity: 0; transform: translateX(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .l-reveal-right.l-visible { opacity: 1; transform: translateX(0); }

        /* Section */
        .l-section { padding: 96px 0; }
        .l-section-lg { padding: 120px 0; }
        .l-container { max-width: 1080px; margin: 0 auto; padding: 0 28px; }

        /* Typography */
        .l-badge { display: inline-block; padding: 4px 14px; background: ${L.accentDim}; color: ${L.accentLight}; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 14px; }
        .l-h2 { font-size: clamp(22px,4vw,34px); font-weight: 700; color: ${L.textPrimary}; margin: 0 0 14px; line-height: 1.2; }
        .l-sub { font-size: clamp(14px,2vw,16px); color: ${L.textSecondary}; line-height: 1.75; max-width: 640px; margin-inline: auto; }

        /* Dot button */
        .l-dot { height: 8px; border-radius: 4px; border: none; cursor: pointer; padding: 0; transition: all 0.3s; }

        /* CTA buttons */
        .l-btn-primary { background: ${L.coral}; border: none; border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 700; color: #fff; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .l-btn-primary:hover { opacity: 0.88; transform: translateY(-2px); }
        .l-btn-outline { background: transparent; border: 1.5px solid ${L.border}; border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 500; color: ${L.textSecondary}; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .l-btn-outline:hover { border-color: ${L.accent}; color: ${L.textPrimary}; transform: translateY(-2px); }
        .l-btn-accent { background: ${L.accent}; border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .l-btn-accent:hover { opacity: 0.88; transform: translateY(-1px); }
        .l-btn-ghost { background: transparent; border: 1.5px solid ${L.border}; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 500; color: ${L.textSecondary}; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .l-btn-ghost:hover { border-color: ${L.accent}; color: ${L.textPrimary}; }

        /* Card hover */
        .l-card { background: ${L.surface}; border: 1px solid ${L.border}; border-radius: 14px; padding: 24px 28px; transition: border-color 0.2s, transform 0.2s; }
        .l-card:hover { border-color: ${L.accent}; transform: translateY(-2px); }

        /* Nav link */
        .l-navlink { color: ${L.textSecondary}; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; }
        .l-navlink:hover { color: ${L.textPrimary}; }

        /* Social icon */
        .l-soc { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid ${L.border}; background: ${L.surface}; display: flex; align-items: center; justify-content: center; color: ${L.textSecondary}; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .l-soc:hover { border-color: ${L.accent}; color: ${L.accentLight}; }

        /* Full-screen hero */
        .l-hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 0 80px; overflow: hidden; }

        /* Hero text pop-in */
        @keyframes lheroin { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .l-hero-h1 { animation: lheroin 0.7s ease both; }
        .l-hero-p  { animation: lheroin 0.7s ease 0.12s both; }
        .l-hero-cta { animation: lheroin 0.7s ease 0.22s both; }
        .l-hero-img { animation: lheroin 0.7s ease 0.34s both; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navScrolled ? L.navBg : "transparent", backdropFilter: navScrolled ? "blur(14px)" : "none", borderBottom: navScrolled ? `1px solid ${L.border}` : "none", transition: "all 0.25s" }}>
        <div style={{ ...W, display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
          {/* Inline SVG logo — fully transparent bg */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VeevakLogoSVG size={34} color={L.accent} />
            <span style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, letterSpacing: "-0.01em" }}>VeeVak</span>
          </div>

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {navLinks.map(({ id, label }) => (
                <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }} className="l-navlink">{label}</a>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isMobile && (
              <>
                <button onClick={handleLogin} className="l-btn-ghost">Log In</button>
                <button onClick={onGetStarted} className="l-btn-accent">Get Started Free</button>
                <button onClick={() => scrollTo("contact")} className="l-btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Contact Us</button>
              </>
            )}
            {isMobile && <MobileMenu onGetStarted={onGetStarted} onLogin={handleLogin} scrollTo={scrollTo} />}
          </div>
        </div>
      </nav>

      {/* ── HERO — full viewport height ──────────────────────────── */}
      <section className="l-hero" style={{ background: `linear-gradient(160deg, #0e0c22 0%, ${L.bg} 60%)` }}>
        <div className="l-container" style={{ textAlign: "center", width: "100%" }}>
          <h1 className="l-hero-h1" style={{ fontSize: "clamp(30px,5.5vw,58px)", fontWeight: 800, color: L.textPrimary, margin: "0 0 20px", lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            AI clarity for small businesses<br />that sell through chats
          </h1>
          <p className="l-hero-p" style={{ fontSize: "clamp(15px,2.2vw,18px)", color: L.textSecondary, lineHeight: 1.75, maxWidth: 580, marginInline: "auto", marginBottom: 40 }}>
            Turn WhatsApp, Instagram, Facebook, TikTok, and offline sales into clear business insights — no spreadsheets, no stress.
          </p>
          <div className="l-hero-cta" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 56 }}>
            <button onClick={onGetStarted} className="l-btn-primary" style={{ fontSize: 16, padding: "15px 34px" }}>Get Started Free →</button>
            <button onClick={handleLogin} className="l-btn-outline" style={{ fontSize: 16, padding: "15px 34px" }}>Already have an account? Log In</button>
          </div>
          <div className="l-hero-img" style={{ borderRadius: 18, overflow: "hidden", maxWidth: 760, marginInline: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", marginBottom: 44 }}>
            <img src={heroIllustration} alt="VeeVak dashboard" style={{ width: "100%", display: "block" }} />
          </div>
          <HeroCarousel />
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────────── */}
      <section id="problem" className="l-section" style={sec(L.surface)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="l-h2">Small businesses work hard but operate blindly</h2>
            <p className="l-sub">Across Nigeria and other emerging markets, many small businesses run entirely through messaging apps and offline sales.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { title: "Where sales live",      icon: "💬", items: ["WhatsApp & Instagram chats","Facebook & TikTok messages","Voice notes & screenshots","Notebooks & memory"], delay: "0s" },
              { title: "What owners can't see", icon: "📊", items: ["What actually sells best","Weekly/monthly earnings","Top-performing platforms","Growth trends"], delay: "0.1s" },
              { title: "What this causes",      icon: "⚠️", items: ["Poor business decisions","Financial stress","Missed opportunities","Preventable failures"], delay: "0.2s" },
            ].map((col, i) => (
              <div key={i} className={`l-card l-reveal`} style={{ transitionDelay: col.delay }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{col.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, margin: "0 0 14px" }}>{col.title}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {col.items.map((item, j) => (
                    <li key={j} style={{ fontSize: 14, color: L.textSecondary, padding: "6px 0", borderBottom: `1px solid ${L.border}` }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ────────────────────────────────────────────────── */}
      <div className="l-reveal"><CinematicShowcase /></div>

      {/* ── WHY TOOLS FAIL ──────────────────────────────────────────── */}
      <section className="l-section" style={sec(L.bg)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 className="l-h2">Why current solutions fall short</h2>
            <p className="l-sub">Most existing business tools are built for formal companies with websites, staff, and structured systems.</p>
          </div>
          <div className="l-reveal"><SolutionsCarousel /></div>
          <p className="l-reveal" style={{ textAlign: "center", fontSize: 14, color: L.textSecondary, maxWidth: 520, marginInline: "auto", marginTop: 28, lineHeight: 1.75 }}>
            These tools don't reflect how small businesses actually operate today across chats, platforms, and offline sales.
          </p>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="l-section" style={sec(L.surface)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 className="l-h2">What VeeVak Does Today</h2>
            <p className="l-sub">Simple tools designed for how you actually work.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
            {[
              { icon: "💬", title: "Extract sales from chats", desc: "Turn conversations into data", delay: "0s" },
              { icon: "📋", title: "Track offline sales",      desc: "Log offline sales easily",    delay: "0.08s" },
              { icon: "📈", title: "Revenue over time",        desc: "See your earnings trend",     delay: "0.16s" },
              { icon: "🏆", title: "Best-selling products",    desc: "Know what moves fastest",     delay: "0.24s" },
              { icon: "📊", title: "Platform performance",     desc: "Compare sales channels",      delay: "0.32s" },
            ].map((f, i) => (
              <div key={i} className="l-card l-reveal" style={{ textAlign: "center", transitionDelay: f.delay }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: L.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 14px" }}>{f.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: L.textPrimary, margin: "0 0 6px" }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: L.textSecondary, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ────────────────────────────────────────────────── */}
      <section id="solution" className="l-section" style={{ background: "linear-gradient(135deg, #18145a 0%, #0d0b2a 100%)" }}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="l-h2" style={{ color: "#fff" }}>Clarity without complexity</h2>
            <p className="l-sub" style={{ color: "rgba(232,230,255,0.8)" }}>VeeVak is an AI-powered operations assistant designed specifically for informal and small businesses.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { title: "With user permission, VeeVak:", items: ["Extracts sales data from chat conversations","Allows simple logging of offline sales","Organizes this into clear summaries"] },
              { title: "Business owners can see:",       items: ["Revenue over time","Best-selling products","Repeat customers","Performance across sales channels"] },
            ].map((col, i) => (
              <div key={i} className="l-reveal" style={{ ...card, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", transitionDelay: i === 0 ? "0s" : "0.1s" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>{col.title}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>{col.items.map(checkItem)}</ul>
              </div>
            ))}
          </div>
          <p className="l-reveal" style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "rgba(232,230,255,0.9)", marginTop: 44 }}>No spreadsheets. No accounting jargon. Just clarity.</p>
        </div>
      </section>

      {/* ── WHY AI ──────────────────────────────────────────────────── */}
      <section className="l-section" style={sec(L.bg)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="l-h2">Why AI Is Necessary and Used Responsibly</h2>
            <p className="l-sub">Sales conversations are informal, unstructured, and scattered. Manually tracking this is time-consuming and inaccurate.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className="l-card l-reveal">
              <h3 style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, margin: "0 0 18px" }}>VeeVak uses AI to:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Identify sales-related messages (products, prices, quantities)","Structure that information into summaries","Reduce manual record-keeping for business owners"].map(checkItem)}
              </ul>
            </div>
            <div className="l-card l-reveal" style={{ border: `2px solid ${L.accentDim}`, transitionDelay: "0.1s" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, margin: "0 0 18px" }}>VeeVak's AI is designed responsibly:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Works only with explicit user permission","Processes data for the user's own insights","Does not sell or publicly share data","Assists decision-making, does not replace human judgment"].map(checkItem)}
              </ul>
              <p style={{ fontSize: 13, fontWeight: 700, color: L.accent, marginTop: 14 }}>Clarity, not surveillance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION ──────────────────────────────────────────────────── */}
      <section className="l-section" style={sec(L.surface)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", maxWidth: 700, marginInline: "auto" }}>
            <h2 className="l-h2">How VeeVak Grows</h2>
            <p className="l-sub" style={{ marginBottom: 36 }}>VeeVak starts by helping small businesses clearly understand their sales.</p>
            <div className="l-card l-reveal" style={{ transitionDelay: "0.1s" }}>
              <p style={{ fontSize: 14, color: L.textSecondary, lineHeight: 1.8, marginBottom: 22 }}>As sales data becomes structured over time, VeeVak plans to expand into:</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {["Financial health alerts","Cash flow warnings","Early signals when a business may be at risk"].map((t, i) => (
                  <span key={i} style={{ padding: "8px 16px", background: L.accentDim, borderRadius: 20, fontSize: 13, fontWeight: 600, color: L.accentLight }}>{t}</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: L.textPrimary, fontWeight: 600, marginTop: 22 }}>
                Internally, we refer to this as <span style={{ color: L.accent }}>BizSentry</span> — our vision for proactive business health insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────────────── */}
      <section id="values" className="l-section" style={{ background: L.bg, overflow: "hidden" }}>
        <div className="l-container l-reveal" style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="l-h2">What we stand for</h2>
        </div>
        <ValuesMarquee />
      </section>

      {/* ── FAQs ────────────────────────────────────────────────────── */}
      <section id="faqs" className="l-section" style={sec(L.surface)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="l-h2">Frequently Asked Questions</h2>
            <p className="l-sub">Everything you need to know before getting started.</p>
          </div>
          <div className="l-reveal"><FAQAccordion /></div>
          <div className="l-reveal" style={{ textAlign: "center", marginTop: 44 }}>
            <p style={{ fontSize: 14, color: L.textSecondary, marginBottom: 16 }}>Still have questions?</p>
            <a href="mailto:info.veevak@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: L.accentDim, border: `1px solid ${L.border}`, borderRadius: 10, textDecoration: "none", color: L.accentLight, fontSize: 14, fontWeight: 600 }}>
              ✉️ Email us at info.veevak@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────────── */}
      <section className="l-section-lg" style={{ background: "linear-gradient(135deg, #18145a 0%, #0d0b2a 100%)" }}>
        <div className="l-container l-reveal" style={{ textAlign: "center" }}>
          <h2 className="l-h2" style={{ color: "#fff", marginBottom: 18 }}>Clarity shouldn't be a luxury</h2>
          <p style={{ fontSize: 16, color: "rgba(232,230,255,0.8)", lineHeight: 1.75, maxWidth: 520, marginInline: "auto", marginBottom: 40 }}>
            Every small business deserves to understand its own performance. Start for free — no credit card, no setup, no jargon.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <button onClick={onGetStarted} className="l-btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>Get Started Free →</button>
            <button onClick={handleLogin} className="l-btn-outline" style={{ fontSize: 16, padding: "16px 36px", borderColor: "rgba(255,255,255,0.25)", color: "rgba(232,230,255,0.8)" }}>Already have an account? Log In</button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────── */}
      <section id="contact" className="l-section" style={sec(L.bg)}>
        <div className="l-container">
          <div className="l-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="l-h2">Get in touch</h2>
            <p className="l-sub">For general enquiries, partnerships, and support — we're here.</p>
          </div>

          <div className="l-reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <a href="mailto:info.veevak@gmail.com"
              style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 32px", background: L.surface, border: `1px solid ${L.border}`, borderRadius: 14, textDecoration: "none", color: L.textPrimary, fontSize: 16, fontWeight: 600, transition: "border-color 0.2s" }}>
              <span style={{ fontSize: 22 }}>✉️</span> info.veevak@gmail.com
            </a>
          </div>

          <div className="l-reveal" style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <a href="https://www.linkedin.com/company/veevak-official" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="l-soc">
              <LinkedInSVG size={18} color="currentColor" />
            </a>
            <a href="https://www.instagram.com/veevak.official" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="l-soc">
              <InstagramSVG size={18} color="currentColor" />
            </a>
            <a href="https://x.com/VeeVak_official" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="l-soc">
              <XSVG size={16} color="currentColor" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${L.border}`, background: L.surface, padding: "60px 0 32px" }}>
        <div className="l-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 52 }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <VeevakLogoSVG size={28} color={L.accent} />
                <span style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary }}>VeeVak</span>
              </div>
              <p style={{ fontSize: 13, color: L.textSecondary, lineHeight: 1.75, margin: "0 0 18px", maxWidth: 200 }}>
                AI-powered sales clarity for small businesses that sell through chats.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { href: "https://x.com/VeeVak_official",                   icon: <XSVG size={14} color="currentColor" />,         label: "X" },
                  { href: "https://www.linkedin.com/company/veevak-official", icon: <LinkedInSVG size={14} color="currentColor" />,  label: "LinkedIn" },
                  { href: "https://www.instagram.com/veevak.official",        icon: <InstagramSVG size={14} color="currentColor" />, label: "Instagram" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="l-soc" style={{ width: 34, height: 34 }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Quick Links</p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[{ label: "Problem", id: "problem" }, { label: "Features", id: "features" }, { label: "Solution", id: "solution" }, { label: "Values", id: "values" }, { label: "FAQs", id: "faqs" }].map(l => (
                  <li key={l.id}><a href={`#${l.id}`} onClick={e => { e.preventDefault(); scrollTo(l.id); }} className="l-navlink" style={{ fontSize: 13 }}>{l.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Product</p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Dashboard","Log Sale","Expenses","Inventory","Reports","AI Assistant"].map(p => (
                  <li key={p}><button onClick={onGetStarted} className="l-navlink" style={{ background: "none", border: "none", padding: 0, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{p}</button></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Get in Touch</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>General enquiries, partnerships & support</p>
              <a href="mailto:info.veevak@gmail.com" className="l-navlink" style={{ fontSize: 13 }}>info.veevak@gmail.com</a>
            </div>
          </div>

          {/* SDGs */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, padding: "22px 0", borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}`, marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://sdgs.un.org/goals/goal8" target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: 8, background: "#A21942", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none" }}>8</a>
              <a href="https://sdgs.un.org/goals/goal9" target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: 8, background: "#FD6925", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none" }}>9</a>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Supporting UN SDGs</p>
              <p style={{ margin: 0, fontSize: 13, color: L.textSecondary }}>Decent Work & Economic Growth · Industry, Innovation & Infrastructure</p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: L.textMuted }}>© {new Date().getFullYear()} VeeVak. All rights reserved.</p>
            <div style={{ display: "flex", gap: 20 }}>
              <button onClick={() => onShowPrivacy && onShowPrivacy()} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:L.textSecondary,fontFamily:"inherit",padding:0 }} className="l-navlink">Privacy</button>
              <button onClick={() => onShowTerms && onShowTerms()} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:L.textSecondary,fontFamily:"inherit",padding:0 }} className="l-navlink">Terms</button>
              <a href="mailto:info.veevak@gmail.com" className="l-navlink" style={{ fontSize:12, color:L.textSecondary, textDecoration:"none" }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Landing chat widget ─────────────────────────────────── */}
      <LandingChat />
    </div>
  );
}
