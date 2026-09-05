import { useState, useEffect } from "react";
import veevakLogo from "./assets/veevak-logo.png";
import heroIllustration from "./assets/hero-illustration.jpg";
import showcaseChatSales from "./assets/showcase-chat-sales.jpg";
import showcaseDashboard from "./assets/showcase-dashboard.jpg";
import showcaseHappyOwner from "./assets/showcase-happy-owner.jpg";
import showcasePlatforms from "./assets/showcase-platforms.jpg";

// ── Colour tokens ─────────────────────────────────────────────────────
const L = {
  bg:           "#07070f",
  surface:      "#0f0f1c",
  surface2:     "#16162a",
  border:       "#2a2a4a",
  accent:       "#7c6af7",
  accentDim:    "#2d2780",
  accentLight:  "#b8afff",
  textPrimary:  "#ffffff",
  textSecondary:"#b0b0d0",
  textMuted:    "#606080",
  coral:        "#e05a40",
  navBg:        "rgba(7,7,15,0.92)",
};

// ── Showcase carousel ─────────────────────────────────────────────────
const showcaseSlides = [
  { src: showcaseChatSales,   alt: "WhatsApp sales being tracked",      caption: "From chat conversations…"      },
  { src: showcasePlatforms,   alt: "Multiple platforms connected",       caption: "Across all your platforms…"    },
  { src: showcaseDashboard,   alt: "Business analytics dashboard",       caption: "Into clear business insights…" },
  { src: showcaseHappyOwner,  alt: "Happy business owner",               caption: "Empowering your decisions"     },
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
    <section style={{ padding: "72px 0", background: L.surface }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ display: "inline-block", padding: "4px 16px", background: L.accentDim, color: L.accentLight, borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12 }}>
            See It In Action
          </span>
          <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 700, color: L.textPrimary, margin: 0 }}>
            The VeeVak Experience
          </h2>
        </div>

        <div style={{ borderRadius: 18, overflow: "hidden", position: "relative", aspectRatio: "16/9", background: L.surface2, boxShadow: "0 32px 80px rgba(0,0,0,0.75)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", gap: 6, padding: 12 }}>
            {showcaseSlides.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: "#fff", width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%", transition: "width 0.1s linear" }} />
              </div>
            ))}
          </div>
          <img src={slide.src} alt={slide.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,7,15,0.88) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 32px", zIndex: 10 }}>
            <p style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, color: "#fff", margin: 0 }}>{slide.caption}</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
          {showcaseSlides.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setProgress(0); }}
              style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === idx ? L.accent : L.border, transition: "all 0.3s", padding: 0 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Values marquee ────────────────────────────────────────────────────
const VALUES = [
  "Human-first technology", "Responsible use of AI", "Building for real-world behaviour",
  "Accessibility over complexity", "Empowering small businesses",
];

function ValuesMarquee() {
  const items = [...VALUES, ...VALUES, ...VALUES];
  return (
    <div style={{ overflow: "hidden", padding: "16px 0" }}>
      <div style={{ display: "flex", gap: 16, animation: "marquee 28s linear infinite", width: "max-content" }}>
        {items.map((v, i) => (
          <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: L.surface, border: `1px solid ${L.border}`, borderRadius: 30 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: L.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: L.textPrimary, whiteSpace: "nowrap" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Solutions carousel ────────────────────────────────────────────────
const SOLUTIONS = [
  { icon: "💰", title: "Accounting software", desc: "Too complex for informal sellers" },
  { icon: "🏪", title: "POS systems",          desc: "Only work for stores with fixed locations" },
  { icon: "📱", title: "Ecommerce platforms",  desc: "Require full online shops" },
  { icon: "💬", title: "Platform tools",        desc: "Locked to a single app" },
];

function SolutionsCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SOLUTIONS.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = SOLUTIONS[idx];
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", background: L.accentDim + "55", borderRadius: 16, padding: "28px 24px" }}>
      <div style={{ minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>{s.icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: L.textPrimary, margin: "0 0 8px" }}>{s.title}</h3>
        <p style={{ fontSize: 14, color: L.textSecondary, margin: 0 }}>{s.desc}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
        {SOLUTIONS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === idx ? L.coral : L.border, transition: "all 0.3s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

// ── Hero carousel ─────────────────────────────────────────────────────
const HERO_SLIDES = [
  { title: "Turn chat conversations into business insights", desc: "Millions of small businesses sell every day through chats and offline sales, yet most operate without clear visibility into their sales, customers, or growth." },
  { title: "VeeVak exists to change that",                  desc: "Simple tools designed for how you actually work. No spreadsheets, no accounting jargon. Just clarity for your business." },
];

function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[idx];
  return (
    <div style={{ minHeight: 140, textAlign: "center", padding: "0 8px" }}>
      <h2 style={{ fontSize: "clamp(18px,3.5vw,26px)", fontWeight: 600, color: L.textPrimary, margin: "0 0 12px", lineHeight: 1.35 }}>{s.title}</h2>
      <p style={{ fontSize: "clamp(14px,2vw,16px)", color: L.textSecondary, margin: 0, lineHeight: 1.7, maxWidth: 600, marginInline: "auto" }}>{s.desc}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === idx ? L.accent : L.border, transition: "all 0.3s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────
const FAQS = [
  { q: "Is VeeVak free to use?",              a: "Yes — VeeVak is free to get started. Create an account and begin logging sales immediately. We plan to introduce optional paid features in the future, but your core tools will always be free." },
  { q: "Do I need any technical knowledge?",   a: "None at all. If you can send a WhatsApp message, you can use VeeVak. Just paste your chats or fill a quick form and VeeVak handles the rest." },
  { q: "How does the chat extraction work?",   a: "You paste or upload your WhatsApp, Instagram, or Facebook conversation. VeeVak's AI reads it and pulls out the sales — product names, prices, customer names, and payment info — into your dashboard automatically." },
  { q: "Is my business data safe?",            a: "Your data is yours. VeeVak processes it only to give you insights. We do not sell, share, or publish your business data to any third party." },
  { q: "What platforms does VeeVak support?",  a: "WhatsApp, Instagram, Facebook, TikTok, and offline / in-person sales. You can also log sales manually via a quick form at any time." },
  { q: "Can I use VeeVak for any business type?", a: "Yes. VeeVak works for fashion, food, beauty, electronics, services, and more. If you sell through conversations or offline, VeeVak is built for you." },
  { q: "Does VeeVak work for businesses outside Nigeria?", a: "Absolutely. VeeVak supports NGN, USD, and GBP and is designed for any informal or small business. While we started in Nigeria, the problem is global." },
];

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth: 760, marginInline: "auto" }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${L.border}` }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", background: "none", border: "none", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: L.textPrimary, lineHeight: 1.4 }}>{faq.q}</span>
            <span style={{ fontSize: 20, color: L.accent, flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 0 18px", fontSize: 14, color: L.textSecondary, lineHeight: 1.8 }}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Mobile menu ───────────────────────────────────────────────────────
function MobileMenu({ onGetStarted, onLogin, scrollTo }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "problem",  label: "Problem"  },
    { id: "features", label: "Features" },
    { id: "solution", label: "Solution" },
    { id: "faqs",     label: "FAQs"     },
    { id: "contact",  label: "Contact"  },
  ];
  return (
    <div style={{ display: "flex" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "transparent", border: `1px solid ${L.border}`, color: L.textPrimary, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 18 }}>
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
            <button onClick={() => { onGetStarted(); setOpen(false); }}
              style={{ background: L.coral, border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
              Get Started Free
            </button>
            <button onClick={() => { onLogin(); setOpen(false); }}
              style={{ background: "transparent", border: `1px solid ${L.border}`, borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 500, color: L.textSecondary, cursor: "pointer" }}>
              Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Landing component ────────────────────────────────────────────
export default function Landing({ onGetStarted, onLogin }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 900);

  useEffect(() => {
    const onScroll  = () => setNavScrolled(window.scrollY > 20);
    const onResize  = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("scroll",  onScroll);
    window.addEventListener("resize",  onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

  // if onLogin not passed, fall back to onGetStarted
  const handleLogin = onLogin || onGetStarted;

  const W = { maxWidth: 1040, margin: "0 auto", padding: "0 24px" };

  const sec = (bg = L.bg) => ({ padding: "80px 0", background: bg });

  const card = { background: L.surface, border: `1px solid ${L.border}`, borderRadius: 14, padding: "24px 28px" };

  const H2 = { fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: L.textPrimary, margin: "0 0 14px", lineHeight: 1.2 };

  const Sub = { fontSize: "clamp(14px,2vw,16px)", color: L.textSecondary, margin: 0, lineHeight: 1.75, maxWidth: 640, marginInline: "auto" };

  const checkItem = txt => (
    <li key={txt} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <span style={{ color: L.accent, fontSize: 16, marginTop: 2, flexShrink: 0 }}>✓</span>
      <span style={{ color: L.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{txt}</span>
    </li>
  );

  const navLinks = [
    { id: "problem",  label: "Problem"  },
    { id: "features", label: "Features" },
    { id: "solution", label: "Solution" },
    { id: "faqs",     label: "FAQs"     },
    { id: "contact",  label: "Contact"  },
  ];

  return (
    <div style={{ background: L.bg, color: L.textPrimary, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* ── Global styles ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .lfi  { animation: fadeUp 0.65s ease both; }
        .lfi1 { animation: fadeUp 0.65s ease 0.12s both; }
        .lfi2 { animation: fadeUp 0.65s ease 0.24s both; }
        .lcta { transition: all 0.18s !important; }
        .lcta:hover { opacity: 0.88 !important; transform: translateY(-2px) !important; }
        .lnav { transition: color 0.15s; }
        .lnav:hover { color: #ffffff !important; }
        .lsoc:hover { border-color: #7c6af7 !important; color: #b8afff !important; }
        .lcard-hover:hover { border-color: #7c6af7 !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navScrolled ? L.navBg : "transparent", backdropFilter: navScrolled ? "blur(14px)" : "none", borderBottom: navScrolled ? `1px solid ${L.border}` : "none", transition: "all 0.25s" }}>
        <div style={{ ...W, display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>

          {/* Logo — mix-blend-mode makes white bg transparent on dark bg */}
          <img src={veevakLogo} alt="VeeVak" style={{ height: 38, width: "auto", mixBlendMode: "screen" }} />

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {navLinks.map(({ id, label }) => (
                <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}
                  className="lnav"
                  style={{ color: L.textSecondary, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  {label}
                </a>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isMobile && (
              <>
                <button onClick={handleLogin} className="lcta"
                  style={{ background: "transparent", border: `1px solid ${L.border}`, borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 500, color: L.textSecondary, cursor: "pointer" }}>
                  Log In
                </button>
                <button onClick={onGetStarted} className="lcta"
                  style={{ background: L.accent, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                  Get Started Free
                </button>
                <button onClick={() => scrollTo("contact")} className="lcta"
                  style={{ background: L.coral, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                  Contact Us
                </button>
              </>
            )}
            {isMobile && <MobileMenu onGetStarted={onGetStarted} onLogin={handleLogin} scrollTo={scrollTo} />}
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 126, paddingBottom: 88, background: `linear-gradient(180deg, #08061a 0%, ${L.bg} 100%)`, overflow: "hidden" }}>
        <div style={{ ...W, textAlign: "center" }}>
          <h1 className="lfi" style={{ fontSize: "clamp(30px,5.5vw,56px)", fontWeight: 800, color: "#ffffff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            AI clarity for small businesses<br />that sell through chats
          </h1>
          <p className="lfi1" style={{ fontSize: "clamp(15px,2.5vw,19px)", color: L.textSecondary, lineHeight: 1.75, maxWidth: 620, marginInline: "auto", marginBottom: 40 }}>
            VeeVak helps informal sellers turn WhatsApp, Instagram, Facebook, TikTok, and offline sales into clear business insights — no spreadsheets, no accounting stress.
          </p>

          <div className="lfi1" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 52 }}>
            <button onClick={onGetStarted} className="lcta"
              style={{ background: L.coral, border: "none", borderRadius: 10, padding: "15px 32px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Get Started Free →
            </button>
            <button onClick={handleLogin} className="lcta"
              style={{ background: "transparent", border: `1px solid ${L.border}`, borderRadius: 10, padding: "15px 32px", fontSize: 16, fontWeight: 500, color: L.textSecondary, cursor: "pointer" }}>
              Already have an account? Log In
            </button>
          </div>

          <div className="lfi2" style={{ borderRadius: 18, overflow: "hidden", maxWidth: 740, marginInline: "auto", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", marginBottom: 44 }}>
            <img src={heroIllustration} alt="VeeVak helps small businesses" style={{ width: "100%", display: "block" }} />
          </div>

          <HeroCarousel />
        </div>
      </section>

      {/* ── PROBLEM ───────────────────────────────────────────────── */}
      <section id="problem" style={sec(L.surface)}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={H2}>Small businesses work hard but operate blindly</h2>
            <p style={Sub}>Across Nigeria and other emerging markets, many small businesses run entirely through messaging apps and offline sales.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { title: "Where sales live",        icon: "💬", items: ["WhatsApp & Instagram chats", "Facebook & TikTok messages", "Voice notes & screenshots", "Notebooks & memory"] },
              { title: "What owners can't see",   icon: "📊", items: ["What actually sells best", "Weekly/monthly earnings", "Top-performing platforms", "Growth trends"] },
              { title: "What this causes",        icon: "⚠️", items: ["Poor business decisions", "Financial stress", "Missed opportunities", "Preventable failures"] },
            ].map((col, i) => (
              <div key={i} className="lcard-hover" style={card}>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{col.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, margin: "0 0 14px" }}>{col.title}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {col.items.map((item, j) => (
                    <li key={j} style={{ fontSize: 14, color: L.textSecondary, padding: "6px 0", borderBottom: `1px solid ${L.border}`, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC SHOWCASE ────────────────────────────────────── */}
      <CinematicShowcase />

      {/* ── WHY CURRENT TOOLS FAIL ────────────────────────────────── */}
      <section style={sec(L.bg)}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={H2}>Why current solutions fall short</h2>
            <p style={Sub}>Most existing business tools are built for formal companies with websites, staff, and structured systems.</p>
          </div>
          <SolutionsCarousel />
          <p style={{ textAlign: "center", fontSize: 14, color: L.textSecondary, maxWidth: 520, marginInline: "auto", marginTop: 28, lineHeight: 1.75 }}>
            These tools don't reflect how small businesses actually operate today across chats, platforms, and offline sales.
          </p>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" style={sec(L.surface)}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={H2}>What VeeVak Does Today</h2>
            <p style={Sub}>Simple tools designed for how you actually work. No spreadsheets, no accounting jargon.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
            {[
              { icon: "💬", title: "Extract sales from chats",  desc: "Turn conversations into data" },
              { icon: "📋", title: "Track offline sales",       desc: "Log offline sales easily" },
              { icon: "📈", title: "Revenue over time",         desc: "See your earnings trend" },
              { icon: "🏆", title: "Best-selling products",     desc: "Know what moves fastest" },
              { icon: "📊", title: "Platform performance",      desc: "Compare sales channels" },
            ].map((f, i) => (
              <div key={i} className="lcard-hover" style={{ ...card, textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: L.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: L.textPrimary, margin: "0 0 6px" }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: L.textSecondary, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 14, color: L.textSecondary, marginTop: 28 }}>All without spreadsheets, accounting tools, or complex setup.</p>
        </div>
      </section>

      {/* ── SOLUTION ──────────────────────────────────────────────── */}
      <section id="solution" style={{ padding: "80px 0", background: "linear-gradient(135deg, #1a1460 0%, #0a0a20 100%)" }}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ ...H2, color: "#fff" }}>Clarity without complexity</h2>
            <p style={{ ...Sub, color: "rgba(255,255,255,0.75)" }}>VeeVak is an AI-powered operations assistant designed specifically for informal and small businesses.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { title: "With user permission, VeeVak:", items: ["Extracts sales data from chat conversations", "Allows simple logging of offline sales", "Organizes this into clear summaries"] },
              { title: "Business owners can see:",       items: ["Revenue over time", "Best-selling products", "Repeat customers", "Performance across sales channels"] },
            ].map((col, i) => (
              <div key={i} style={{ ...card, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>{col.title}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {col.items.map(checkItem)}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 44 }}>No spreadsheets. No accounting jargon. Just clarity.</p>
        </div>
      </section>

      {/* ── WHY AI ────────────────────────────────────────────────── */}
      <section style={sec(L.bg)}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={H2}>Why AI Is Necessary and Used Responsibly</h2>
            <p style={Sub}>Sales conversations are informal, unstructured, and scattered across platforms. Manually tracking this is time-consuming and often inaccurate.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className="lcard-hover" style={card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, margin: "0 0 18px" }}>VeeVak uses AI to:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Identify sales-related messages (products, prices, quantities)", "Structure that information into summaries", "Reduce manual record-keeping for business owners"].map(checkItem)}
              </ul>
            </div>
            <div className="lcard-hover" style={{ ...card, border: `2px solid ${L.accentDim}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: L.textPrimary, margin: "0 0 18px" }}>VeeVak's AI is designed responsibly:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Works only with explicit user permission", "Processes data for the user's own insights", "Does not sell or publicly share data", "Assists decision-making, does not replace human judgment"].map(checkItem)}
              </ul>
              <p style={{ fontSize: 13, fontWeight: 700, color: L.accent, marginTop: 14 }}>Clarity, not surveillance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION ────────────────────────────────────────────────── */}
      <section style={sec(L.surface)}>
        <div style={W}>
          <div style={{ textAlign: "center", maxWidth: 700, marginInline: "auto" }}>
            <h2 style={H2}>How VeeVak Grows</h2>
            <p style={{ ...Sub, marginBottom: 36 }}>VeeVak starts by helping small businesses clearly understand their sales.</p>
            <div className="lcard-hover" style={card}>
              <p style={{ fontSize: 14, color: L.textSecondary, lineHeight: 1.8, marginBottom: 22 }}>As sales data becomes structured over time, VeeVak plans to expand into:</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {["Financial health alerts", "Cash flow warnings", "Early signals when a business may be at risk"].map((t, i) => (
                  <span key={i} style={{ padding: "8px 16px", background: L.accentDim, borderRadius: 20, fontSize: 13, fontWeight: 600, color: L.accentLight }}>{t}</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: L.textSecondary, lineHeight: 1.8, marginTop: 22 }}>This long-term vision helps small businesses act early, not when it's already too late.</p>
              <p style={{ fontSize: 14, color: L.textPrimary, fontWeight: 600, marginTop: 12 }}>
                Internally, we refer to this future expansion as <span style={{ color: L.accent }}>BizSentry</span> — our vision for proactive business health insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────── */}
      <section id="values" style={{ padding: "80px 0", background: L.bg, overflow: "hidden" }}>
        <div style={{ ...W, textAlign: "center", marginBottom: 36 }}>
          <h2 style={H2}>What we stand for</h2>
        </div>
        <ValuesMarquee />
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────── */}
      <section id="faqs" style={sec(L.surface)}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={H2}>Frequently Asked Questions</h2>
            <p style={Sub}>Everything you need to know before getting started.</p>
          </div>
          <FAQAccordion />
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <p style={{ fontSize: 14, color: L.textSecondary, marginBottom: 16 }}>Still have questions?</p>
            <a href="mailto:info.veevak@gmail.com"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: L.accentDim, border: `1px solid ${L.border}`, borderRadius: 10, textDecoration: "none", color: L.accentLight, fontSize: 14, fontWeight: 600 }}>
              ✉️ Email us at info.veevak@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────────── */}
      <section style={{ padding: "88px 0", background: "linear-gradient(135deg, #1a1460 0%, #0a0a20 100%)" }}>
        <div style={{ ...W, textAlign: "center" }}>
          <h2 style={{ ...H2, color: "#fff", marginBottom: 18 }}>Clarity shouldn't be a luxury</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, maxWidth: 540, marginInline: "auto", marginBottom: 40 }}>
            Every small business deserves to understand its own performance. Start for free — no credit card, no setup, no jargon.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <button onClick={onGetStarted} className="lcta"
              style={{ background: L.coral, border: "none", borderRadius: 10, padding: "16px 36px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Get Started Free →
            </button>
            <button onClick={handleLogin} className="lcta"
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "16px 36px", fontSize: 16, fontWeight: 500, color: "#f0eeff", cursor: "pointer" }}>
              Already have an account? Log In
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section id="contact" style={sec(L.bg)}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={H2}>Get in touch</h2>
            <p style={Sub}>Have questions or want to learn more? We're happy to hear from you.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 48 }}>
            {[
              { label: "General Enquiries", icon: "✉️", value: "info.veevak@gmail.com", href: "mailto:info.veevak@gmail.com" },
              { label: "Partnerships",       icon: "🤝", value: "info.veevak@gmail.com", href: "mailto:info.veevak@gmail.com?subject=Partnership" },
              { label: "Support",            icon: "🛠️", value: "info.veevak@gmail.com", href: "mailto:info.veevak@gmail.com?subject=Support" },
            ].map(c => (
              <a key={c.label} href={c.href} className="lcard-hover"
                style={{ ...card, textDecoration: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: L.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.icon}</div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{c.label}</p>
                  <p style={{ margin: 0, fontSize: 14, color: L.textPrimary, fontWeight: 500 }}>{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            {[
              { label: "LinkedIn",  href: "https://www.linkedin.com/company/veevak-official", text: "in" },
              { label: "Instagram", href: "https://www.instagram.com/veevak.official",        text: "ig" },
              { label: "X",        href: "https://x.com/VeeVak_official",                    text: "𝕏"  },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="lsoc"
                style={{ width: 46, height: 46, borderRadius: "50%", border: `1px solid ${L.border}`, background: L.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: L.textSecondary, textDecoration: "none", transition: "all 0.2s" }}>
                {s.text}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${L.border}`, background: L.surface, padding: "60px 0 32px" }}>
        <div style={W}>

          {/* 4-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 56 }}>

            {/* Brand column */}
            <div>
              <img src={veevakLogo} alt="VeeVak" style={{ height: 36, width: "auto", mixBlendMode: "screen", marginBottom: 14 }} />
              <p style={{ fontSize: 13, color: L.textSecondary, lineHeight: 1.75, margin: "0 0 18px", maxWidth: 220 }}>
                AI-powered sales clarity for small businesses that sell through chats.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { href: "https://x.com/VeeVak_official",                    text: "𝕏"  },
                  { href: "https://www.linkedin.com/company/veevak-official",  text: "in" },
                  { href: "https://www.instagram.com/veevak.official",         text: "ig" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="lsoc"
                    style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${L.border}`, background: L.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: L.textSecondary, textDecoration: "none", transition: "all 0.2s" }}>
                    {s.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Quick Links</p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Problem",  id: "problem"  },
                  { label: "Features", id: "features" },
                  { label: "Solution", id: "solution" },
                  { label: "Values",   id: "values"   },
                  { label: "FAQs",     id: "faqs"     },
                ].map(l => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} onClick={e => { e.preventDefault(); scrollTo(l.id); }}
                      className="lnav"
                      style={{ fontSize: 13, color: L.textSecondary, textDecoration: "none" }}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Product</p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Dashboard", "Log Sale", "Expenses", "Inventory", "Reports", "AI Assistant"].map(p => (
                  <li key={p}>
                    <button onClick={onGetStarted}
                      style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: L.textSecondary, cursor: "pointer", fontFamily: "inherit" }}
                      className="lnav">{p}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get in touch */}
            <div>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Get in Touch</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "GENERAL ENQUIRIES", value: "info.veevak@gmail.com", href: "mailto:info.veevak@gmail.com" },
                  { label: "PARTNERSHIPS",       value: "info.veevak@gmail.com", href: "mailto:info.veevak@gmail.com?subject=Partnership" },
                  { label: "SUPPORT",            value: "info.veevak@gmail.com", href: "mailto:info.veevak@gmail.com?subject=Support" },
                ].map(c => (
                  <div key={c.label}>
                    <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: L.textMuted, letterSpacing: "0.07em" }}>{c.label}</p>
                    <a href={c.href} className="lnav" style={{ fontSize: 13, color: L.textSecondary, textDecoration: "none" }}>{c.value}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SDGs */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, padding: "24px 0", borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}`, marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://sdgs.un.org/goals/goal8" target="_blank" rel="noopener noreferrer"
                style={{ width: 40, height: 40, borderRadius: 8, background: "#A21942", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none" }}>8</a>
              <a href="https://sdgs.un.org/goals/goal9" target="_blank" rel="noopener noreferrer"
                style={{ width: 40, height: 40, borderRadius: 8, background: "#FD6925", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none" }}>9</a>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Supporting UN SDGs</p>
              <p style={{ margin: 0, fontSize: 13, color: L.textSecondary }}>Decent Work & Economic Growth · Industry, Innovation & Infrastructure</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: L.textMuted }}>© {new Date().getFullYear()} VeeVak. All rights reserved.</p>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="mailto:info.veevak@gmail.com" className="lnav" style={{ fontSize: 12, color: L.textMuted, textDecoration: "none" }}>Privacy</a>
              <a href="mailto:info.veevak@gmail.com" className="lnav" style={{ fontSize: 12, color: L.textMuted, textDecoration: "none" }}>Terms</a>
              <a href="mailto:info.veevak@gmail.com" className="lnav" style={{ fontSize: 12, color: L.textMuted, textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
