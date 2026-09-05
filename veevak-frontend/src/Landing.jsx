import { useState, useEffect } from "react";
import veevakLogo from "./assets/veevak-logo.png";
import heroIllustration from "./assets/hero-illustration.jpg";
import showcaseChatSales from "./assets/showcase-chat-sales.jpg";
import showcaseDashboard from "./assets/showcase-dashboard.jpg";
import showcaseHappyOwner from "./assets/showcase-happy-owner.jpg";
import showcasePlatforms from "./assets/showcase-platforms.jpg";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfymXSQbDN_r1KQffryRvsHxRE0ZmkkD3BViMDz9GBV5NY7qA/viewform";

// ── Colour tokens (dark navy / indigo — professional) ─────────────────
const L = {
  bg: "#06060d",
  surface: "#0e0e1a",
  surface2: "#15152b",
  border: "#24244a",
  accent: "#7c6af7",
  accentDim: "#2d2780",
  accentLight: "#9d8ff9",
  textPrimary: "#f0eeff",
  textSecondary: "#8080a8",
  textMuted: "#4a4a6a",
  coral: "#e05a40",
  coralBg: "#2a1510",
  navBg: "rgba(6,6,13,0.88)",
};

// ── Showcase carousel ─────────────────────────────────────────────────
const showcaseSlides = [
  { src: showcaseChatSales, alt: "WhatsApp sales conversations being tracked", caption: "From chat conversations…" },
  { src: showcasePlatforms, alt: "Multiple platforms connected", caption: "Across all your platforms…" },
  { src: showcaseDashboard, alt: "Business analytics dashboard", caption: "Into clear business insights…" },
  { src: showcaseHappyOwner, alt: "Happy business owner", caption: "Empowering your decisions" },
];

function CinematicShowcase() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 4000;
  const TICK = 50;

  useEffect(() => {
    const pt = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 100 / (DURATION / TICK))), TICK);
    const st = setInterval(() => { setIdx(i => (i + 1) % showcaseSlides.length); setProgress(0); }, DURATION);
    return () => { clearInterval(pt); clearInterval(st); };
  }, []);

  const slide = showcaseSlides[idx];
  return (
    <section style={{ padding: "64px 0", background: L.surface }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ display: "inline-block", padding: "4px 14px", background: L.accentDim, color: L.accentLight, borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12 }}>
            See It In Action
          </span>
          <h2 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 700, color: L.textPrimary, margin: 0 }}>
            The VeeVak Experience
          </h2>
        </div>

        <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", aspectRatio: "16/9", background: L.surface2, boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
          {/* Progress bars */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", gap: 6, padding: 12 }}>
            {showcaseSlides.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: "#fff", width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%", transition: "width 0.1s linear" }} />
              </div>
            ))}
          </div>

          <img src={slide.src} alt={slide.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,6,13,0.85) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 28px", zIndex: 10 }}>
            <p style={{ fontSize: "clamp(16px,3vw,24px)", fontWeight: 600, color: "#fff", margin: 0 }}>{slide.caption}</p>
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
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

// ── Solutions mini-carousel ───────────────────────────────────────────
const SOLUTIONS = [
  { icon: "💰", title: "Accounting software", desc: "Too complex for informal sellers" },
  { icon: "🏪", title: "POS systems", desc: "Only work for stores with fixed locations" },
  { icon: "📱", title: "Ecommerce platforms", desc: "Require full online shops" },
  { icon: "💬", title: "Platform tools", desc: "Locked to a single app" },
];

function SolutionsCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SOLUTIONS.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = SOLUTIONS[idx];
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", background: L.accentDim + "60", borderRadius: 16, padding: "24px 20px" }}>
      <div style={{ minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: L.textPrimary, margin: "0 0 8px" }}>{s.title}</h3>
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
  { title: "VeeVak exists to change that", desc: "Simple tools designed for how you actually work. No spreadsheets, no accounting jargon. Just clarity for your business." },
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

// ── Mobile menu ───────────────────────────────────────────────────────
function MobileMenu({ onGetStarted, scrollTo }) {
  const [open, setOpen] = useState(false);
  const links = ["problem", "features", "solution", "values"];
  return (
    <div style={{ display: "flex" }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: "transparent", border: `1px solid ${L.border}`, color: L.textSecondary, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18 }}>
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, background: L.surface, borderBottom: `1px solid ${L.border}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12, zIndex: 200 }}>
          {links.map(l => (
            <a key={l} href={`#${l}`} onClick={() => { scrollTo(l); setOpen(false); }}
              style={{ color: L.textSecondary, textDecoration: "none", fontSize: 15, fontWeight: 500, textTransform: "capitalize", padding: "8px 0", borderBottom: `1px solid ${L.border}` }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
          <button onClick={() => { onGetStarted(); setOpen(false); }}
            style={{ background: L.coral, border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", marginTop: 4 }}>
            Get Started Free
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Landing component ────────────────────────────────────────────
export default function Landing({ onGetStarted }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", handleResize); };
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const sectionStyle = (bg = L.bg) => ({
    padding: "72px 0",
    background: bg,
  });

  const container = { maxWidth: 1040, margin: "0 auto", padding: "0 24px" };

  const card = {
    background: L.surface,
    border: `1px solid ${L.border}`,
    borderRadius: 14,
    padding: "24px 28px",
  };

  const sectionTitle = {
    fontSize: "clamp(22px,4vw,32px)",
    fontWeight: 700,
    color: L.textPrimary,
    margin: "0 0 14px",
    lineHeight: 1.25,
  };

  const sectionSub = {
    fontSize: "clamp(14px,2vw,16px)",
    color: L.textSecondary,
    margin: 0,
    lineHeight: 1.7,
    maxWidth: 640,
    marginInline: "auto",
  };

  const checkItem = (text) => (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <span style={{ color: L.accent, fontSize: 16, marginTop: 2, flexShrink: 0 }}>✓</span>
      <span style={{ color: L.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{text}</span>
    </li>
  );

  return (
    <div style={{ background: L.bg, color: L.textPrimary, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .landing-fadein { animation: fadeInUp 0.7s ease both; }
        .landing-fadein-delay { animation: fadeInUp 0.7s ease 0.15s both; }
        .landing-fadein-delay2 { animation: fadeInUp 0.7s ease 0.3s both; }
        .landing-cta-btn:hover { opacity: 0.88 !important; transform: translateY(-1px); }
        .landing-cta-btn { transition: all 0.18s !important; }
        .landing-nav-link { transition: color 0.15s; }
        .landing-nav-link:hover { color: #f0eeff !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navScrolled ? L.navBg : "transparent", backdropFilter: navScrolled ? "blur(12px)" : "none", borderBottom: navScrolled ? `1px solid ${L.border}` : "none", transition: "all 0.25s" }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <img src={veevakLogo} alt="VeeVak" style={{ height: 40, width: "auto" }} />
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {["problem", "features", "solution", "values"].map(id => (
                <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}
                  className="landing-nav-link"
                  style={{ color: L.textSecondary, textDecoration: "none", fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isMobile && (
              <button onClick={() => scrollTo("waitlist")}
                className="landing-cta-btn"
                style={{ background: L.accent, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                Join Waitlist
              </button>
            )}
            {isMobile && <MobileMenu onGetStarted={onGetStarted} scrollTo={scrollTo} />}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 80, background: `linear-gradient(180deg, #0a0815 0%, ${L.bg} 100%)`, overflow: "hidden" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <h1 className="landing-fadein" style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, color: L.textPrimary, margin: "0 0 18px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            AI clarity for small businesses<br />that sell through chats
          </h1>
          <p className="landing-fadein-delay" style={{ fontSize: "clamp(15px,2.5vw,18px)", color: L.textSecondary, lineHeight: 1.7, maxWidth: 620, marginInline: "auto", marginBottom: 36 }}>
            VeeVak helps informal sellers turn WhatsApp, Instagram, Facebook, TikTok, and offline sales into clear insights — without complex tools or accounting stress.
          </p>

          <div className="landing-fadein-delay" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            <button onClick={onGetStarted} className="landing-cta-btn"
              style={{ background: L.coral, border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Get Started Free →
            </button>
            <button onClick={() => scrollTo("features")} className="landing-cta-btn"
              style={{ background: "transparent", border: `1px solid ${L.border}`, borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, color: L.textSecondary, cursor: "pointer" }}>
              How VeeVak works ↓
            </button>
          </div>

          <div className="landing-fadein-delay2" style={{ borderRadius: 16, overflow: "hidden", maxWidth: 720, marginInline: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.7)", marginBottom: 40 }}>
            <img src={heroIllustration} alt="VeeVak helps small businesses" style={{ width: "100%", display: "block" }} />
          </div>

          <HeroCarousel />
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" style={sectionStyle(L.surface)}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={sectionTitle}>Small businesses work hard but operate blindly</h2>
            <p style={sectionSub}>Across Nigeria and other emerging markets, many small businesses run entirely through messaging apps and offline sales.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { title: "Where sales live", icon: "💬", items: ["WhatsApp & Instagram chats", "Facebook & TikTok messages", "Voice notes & screenshots", "Notebooks & memory"] },
              { title: "What owners can't see", icon: "📊", items: ["What actually sells best", "Weekly/monthly earnings", "Top-performing platforms", "Growth trends"] },
              { title: "What this causes", icon: "⚠️", items: ["Poor business decisions", "Financial stress", "Missed opportunities", "Preventable failures"] },
            ].map((col, i) => (
              <div key={i} style={card}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{col.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: L.textPrimary, margin: "0 0 12px" }}>{col.title}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {col.items.map((item, j) => (
                    <li key={j} style={{ fontSize: 13, color: L.textSecondary, padding: "5px 0", borderBottom: `1px solid ${L.border}`, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC SHOWCASE */}
      <CinematicShowcase />

      {/* WHY CURRENT TOOLS FAIL */}
      <section style={sectionStyle(L.bg)}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={sectionTitle}>Why current solutions fall short</h2>
            <p style={sectionSub}>Most existing business tools are built for formal companies with websites, staff, and structured systems.</p>
          </div>
          <SolutionsCarousel />
          <p style={{ textAlign: "center", fontSize: 14, color: L.textSecondary, maxWidth: 520, marginInline: "auto", marginTop: 28, lineHeight: 1.7 }}>
            These tools don't reflect how small businesses actually operate today across chats, platforms, and offline sales.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={sectionStyle(L.surface)}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={sectionTitle}>What VeeVak Does (Today)</h2>
            <p style={sectionSub}>Simple tools designed for how you actually work. No spreadsheets, no accounting jargon.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
            {[
              { icon: "💬", title: "Extract sales from chats", desc: "Turn conversations into data" },
              { icon: "📋", title: "Track offline sales", desc: "Log offline sales easily" },
              { icon: "📈", title: "Revenue over time", desc: "See your earnings trend" },
              { icon: "🏆", title: "Best-selling products", desc: "Know what moves fastest" },
              { icon: "📊", title: "Platform performance", desc: "Compare sales channels" },
            ].map((f, i) => (
              <div key={i} style={{ ...card, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: L.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 14px" }}>{f.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: L.textPrimary, margin: "0 0 6px" }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: L.textSecondary, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: L.textSecondary, marginTop: 24 }}>All without spreadsheets, accounting tools, or complex setup.</p>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" style={{ ...sectionStyle(L.accentDim), background: "linear-gradient(135deg, #1a1460 0%, #0a0a20 100%)" }}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ ...sectionTitle, color: "#fff" }}>Clarity without complexity</h2>
            <p style={{ ...sectionSub, color: "rgba(240,238,255,0.8)" }}>VeeVak is an AI-powered operations assistant designed specifically for informal and small businesses.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div style={{ ...card, background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.12)` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0eeff", margin: "0 0 16px" }}>With user permission, VeeVak:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Extracts sales data from chat conversations", "Allows simple logging of offline sales", "Organizes this information into clear summaries"].map(checkItem)}
              </ul>
            </div>
            <div style={{ ...card, background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.12)` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0eeff", margin: "0 0 16px" }}>Business owners can see:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Revenue over time", "Best-selling products", "Repeat customers", "Performance across sales channels"].map(checkItem)}
              </ul>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 17, fontWeight: 600, color: "rgba(240,238,255,0.9)", marginTop: 40 }}>No spreadsheets. No accounting jargon. Just clarity.</p>
        </div>
      </section>

      {/* WHY AI */}
      <section style={sectionStyle(L.bg)}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={sectionTitle}>Why AI Is Necessary and Used Responsibly</h2>
            <p style={sectionSub}>Sales conversations are informal, unstructured, and scattered across platforms. Manually tracking this information is time-consuming and often inaccurate.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div style={card}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: L.textPrimary, margin: "0 0 16px" }}>VeeVak uses AI to:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Identify sales-related messages (products, prices, quantities)", "Structure that information into summaries", "Reduce manual record-keeping for business owners"].map(checkItem)}
              </ul>
            </div>
            <div style={{ ...card, border: `2px solid ${L.accentDim}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: L.textPrimary, margin: "0 0 16px" }}>VeeVak's AI is designed responsibly:</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {["Works only with explicit user permission", "Processes data for the user's own insights", "Does not sell or publicly share data", "Assists decision-making, not replaces human judgment"].map(checkItem)}
              </ul>
              <p style={{ fontSize: 13, fontWeight: 600, color: L.accent, marginTop: 12 }}>Clarity, not surveillance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section style={sectionStyle(L.surface)}>
        <div style={container}>
          <div style={{ textAlign: "center", maxWidth: 680, marginInline: "auto" }}>
            <h2 style={sectionTitle}>How VeeVak Grows</h2>
            <p style={{ ...sectionSub, marginBottom: 32 }}>VeeVak starts by helping small businesses clearly understand their sales.</p>
            <div style={card}>
              <p style={{ fontSize: 14, color: L.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>As sales data becomes structured over time, VeeVak plans to expand into:</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {["Financial health alerts", "Cash flow warnings", "Early signals when a business may be at risk"].map((t, i) => (
                  <span key={i} style={{ padding: "8px 16px", background: L.accentDim, borderRadius: 20, fontSize: 13, fontWeight: 500, color: L.accentLight }}>{t}</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: L.textSecondary, lineHeight: 1.7, marginTop: 20 }}>This long-term vision helps small businesses act early, not when it's already too late.</p>
              <p style={{ fontSize: 14, color: L.textPrimary, fontWeight: 500, marginTop: 12 }}>
                Internally, we refer to this future expansion as <span style={{ color: L.accent }}>BizSentry</span>, our vision for proactive business health insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section id="values" style={{ ...sectionStyle(L.bg), overflow: "hidden" }}>
        <div style={{ ...container, textAlign: "center", marginBottom: 32 }}>
          <h2 style={sectionTitle}>What we stand for</h2>
        </div>
        <ValuesMarquee />
      </section>

      {/* WAITLIST CTA */}
      <section id="waitlist" style={{ padding: "80px 0", background: "linear-gradient(135deg, #1a1460 0%, #0a0a20 100%)" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <h2 style={{ ...sectionTitle, color: "#fff", marginBottom: 16 }}>Clarity shouldn't be a luxury</h2>
          <p style={{ fontSize: 16, color: "rgba(240,238,255,0.8)", lineHeight: 1.7, maxWidth: 540, marginInline: "auto", marginBottom: 36 }}>
            We believe every small business deserves to understand its own performance. Join us as we build tools that make clarity accessible.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <button onClick={() => window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer")}
              className="landing-cta-btn"
              style={{ background: L.coral, border: "none", borderRadius: 10, padding: "15px 32px", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Join the Waitlist →
            </button>
            <button onClick={onGetStarted}
              className="landing-cta-btn"
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "15px 32px", fontSize: 15, fontWeight: 600, color: "#f0eeff", cursor: "pointer" }}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={sectionStyle(L.surface)}>
        <div style={{ ...container, textAlign: "center" }}>
          <h2 style={{ ...sectionTitle, marginBottom: 12 }}>Get in touch</h2>
          <p style={{ ...sectionSub, marginBottom: 36 }}>Have questions or want to learn more? Reach out to us.</p>

          <a href="mailto:info.veevak@gmail.com"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: L.bg, border: `1px solid ${L.border}`, borderRadius: 12, textDecoration: "none", color: L.textPrimary, fontSize: 14, fontWeight: 500, marginBottom: 28 }}>
            ✉️ info.veevak@gmail.com
          </a>

          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/company/veevak-official", icon: "in" },
              { label: "Instagram", href: "https://www.instagram.com/veevak.official", icon: "📸" },
              { label: "X / Twitter", href: "https://x.com/VeeVak_official", icon: "𝕏" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ width: 46, height: 46, borderRadius: "50%", border: `1px solid ${L.border}`, background: L.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: L.textSecondary, textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${L.border}`, padding: "40px 0", background: L.bg }}>
        <div style={{ ...container }}>
          {/* SDGs */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12, paddingBottom: 28, marginBottom: 28, borderBottom: `1px solid ${L.border}` }}>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://sdgs.un.org/goals/goal8" target="_blank" rel="noopener noreferrer"
                style={{ width: 38, height: 38, borderRadius: 8, background: "#A21942", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>8</a>
              <a href="https://sdgs.un.org/goals/goal9" target="_blank" rel="noopener noreferrer"
                style={{ width: 38, height: 38, borderRadius: 8, background: "#FD6925", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>9</a>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: L.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Supporting UN SDGs</p>
              <p style={{ margin: 0, fontSize: 13, color: L.textSecondary }}>Decent Work & Economic Growth · Industry, Innovation & Infrastructure</p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <img src={veevakLogo} alt="VeeVak" style={{ height: 32, width: "auto" }} />
            <p style={{ margin: 0, fontSize: 13, color: L.textMuted }}>© {new Date().getFullYear()} VeeVak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
