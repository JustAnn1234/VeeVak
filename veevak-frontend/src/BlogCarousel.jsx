import { useRef, useState } from "react";

const ARTICLES = [
  {
    id: "hidden-cost-unlogged-chats",
    title: "The Hidden Cost of Unlogged Chats: Why WhatsApp and IG Sellers in Nigeria Lose Millions Annually",
    subtitle: "Unrecorded sales and payment reconciliation errors are silently draining profits from social commerce vendors.",
    category: "SME Finance",
    readTime: "4 min read",
    image: "/images/blog/unlogged-chats.jpeg",
  },
  {
    id: "from-dm-to-ledger",
    title: "From DM to Ledger: How AI Voice & Chat Parsing is Revolutionizing Micro-Business Bookkeeping",
    subtitle: "Transforming unstructured chat text and audio notes into audit-ready financial records instantly.",
    category: "AI Operations",
    readTime: "5 min read",
    image: "/images/blog/dm-to-ledger.jpeg",
  },
  {
    id: "financial-inclusion-informal-commerce",
    title: "Financial Inclusion for Informal Commerce: Structured Sales Logs as the Gateway to Credit",
    subtitle: "Why verifiable digital records are the key to unlocking loans, grants, and growth capital for African SMEs.",
    category: "Digital Economy",
    readTime: "4 min read",
    image: "/images/blog/financial-inclusion.jpeg",
  },
];

export default function BlogCarousel() {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function move(direction) {
    trackRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }

  function startDrag(event) {
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { startX: event.clientX, scrollLeft: track.scrollLeft };
    setDragging(true);
    track.setPointerCapture?.(event.pointerId);
  }

  function drag(event) {
    if (!dragRef.current || !trackRef.current) return;
    event.preventDefault();
    trackRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  }

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }

  return (
    <section aria-labelledby="insights-heading" style={{ background: "#11111f", padding: "88px 0" }}>
      <div className="l-container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 28 }}>
          <div>
            <span className="l-badge">Knowledge for the journey</span>
            <h2 id="insights-heading" className="l-h2" style={{ marginBottom: 8 }}>VeeVak Insights</h2>
            <p className="l-sub" style={{ margin: 0, maxWidth: 560 }}>Practical ideas for turning everyday commerce into clearer business decisions.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button type="button" aria-label="Previous insight" onClick={() => move(-1)} style={arrowStyle}>‹</button>
            <button type="button" aria-label="Next insight" onClick={() => move(1)} style={arrowStyle}>›</button>
          </div>
        </div>

        <div
          ref={trackRef}
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(280px, 360px)", gap: 18, overflowX: "auto", padding: "4px 2px 14px", cursor: dragging ? "grabbing" : "grab", scrollbarWidth: "thin", scrollbarColor: "#2e2e50 transparent", touchAction: "pan-y" }}
        >
          {ARTICLES.map(article => (
            <article key={article.id} style={{ background: "#181828", border: "1px solid #2e2e50", borderRadius: 14, overflow: "hidden", minWidth: 0 }}>
              <div style={{ aspectRatio: "16 / 9", background: "#1e1e34", overflow: "hidden" }}>
                <img src={article.image} alt="" draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "18px 18px 20px" }}>
                <span style={{ display: "inline-flex", padding: "4px 9px", borderRadius: 20, background: "#312c6e", color: "#c4bcff", fontSize: 10, fontWeight: 700 }}>{article.category}</span>
                <h3 style={{ color: "#e8e6ff", fontSize: 17, lineHeight: 1.3, margin: "13px 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.title}</h3>
                <p style={{ color: "#9898b8", fontSize: 12, lineHeight: 1.55, minHeight: 38, margin: "0 0 17px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.subtitle}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "#5a5a7a", fontSize: 11 }}>{article.readTime}</span>
                  <button type="button" style={{ background: "none", border: 0, padding: 0, color: "#c4bcff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Read Article →</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const arrowStyle = {
  width: 36,
  height: 36,
  borderRadius: 9,
  border: "1px solid #2e2e50",
  background: "#181828",
  color: "#e8e6ff",
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
};
