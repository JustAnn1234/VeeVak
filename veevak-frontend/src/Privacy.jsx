// Privacy Policy page — rendered as an overlay from Landing.jsx
export default function Privacy({ onClose }) {
  const S = {
    overlay: {
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(10,10,20,0.85)", display: "flex",
      alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "40px 16px 80px",
    },
    card: {
      background: "#181828", border: "1px solid #2e2e50",
      borderRadius: 16, maxWidth: 720, width: "100%",
      padding: "48px 40px", position: "relative",
      color: "#e8e6ff", fontFamily: "'Inter', system-ui, sans-serif",
      lineHeight: 1.75, fontSize: 15,
    },
    close: {
      position: "absolute", top: 20, right: 24,
      background: "none", border: "none", color: "#9898b8",
      fontSize: 28, cursor: "pointer", lineHeight: 1,
    },
    h1: { fontSize: 26, fontWeight: 700, marginBottom: 6, color: "#f0eeff" },
    sub: { color: "#9898b8", fontSize: 13, marginBottom: 36 },
    h2: { fontSize: 16, fontWeight: 600, color: "#c4bcff", marginTop: 32, marginBottom: 8 },
    p: { color: "#b8b6d8", margin: "0 0 14px" },
    a: { color: "#8b7ff5", textDecoration: "none" },
  };

  return (
    <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.card}>
        <button style={S.close} onClick={onClose} aria-label="Close">×</button>

        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={S.sub}>Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

        <p style={S.p}>VeeVak ("we", "us", or "our") is committed to protecting the privacy of the small business owners and individuals who use our platform. This policy explains what data we collect, why we collect it, and how we keep it safe.</p>

        <h2 style={S.h2}>1. What We Collect</h2>
        <p style={S.p}><strong>Account information:</strong> Your name, email address, and password (hashed — never stored in plaintext) when you create an account.</p>
        <p style={S.p}><strong>Business data:</strong> Shop names, sales records, expenses, inventory, and customer names that you voluntarily log through the app or via the AI assistant.</p>
        <p style={S.p}><strong>Usage data:</strong> Basic analytics like page visits and feature usage to help us improve the product. We do not sell this data.</p>

        <h2 style={S.h2}>2. How We Use Your Data</h2>
        <p style={S.p}>We use your data solely to operate VeeVak — to display your business insights, generate AI-powered summaries and forecasts, and improve the accuracy of our models. We do not sell, share, or rent your personal data to third parties for marketing purposes.</p>

        <h2 style={S.h2}>3. Data Storage & Security</h2>
        <p style={S.p}>Your data is stored on secure servers (Render.com). We use HTTPS for all data transmission. Passwords are hashed using industry-standard algorithms. Access to production databases is restricted to authorised personnel only.</p>

        <h2 style={S.h2}>4. AI Processing</h2>
        <p style={S.p}>When you use the AI assistant, your messages are sent to Google Gemini's API for processing. Google's data handling policies apply to that processing. We do not permanently store the raw chat transcripts beyond your current session.</p>

        <h2 style={S.h2}>5. Your Rights</h2>
        <p style={S.p}>You can request deletion of your account and all associated data at any time by emailing us. You can also export your business data from within the app.</p>

        <h2 style={S.h2}>6. Cookies</h2>
        <p style={S.p}>We use a single session token stored in your browser's localStorage to keep you logged in. We do not use third-party tracking cookies.</p>

        <h2 style={S.h2}>7. Changes to This Policy</h2>
        <p style={S.p}>We may update this policy as VeeVak grows. Significant changes will be communicated via email or an in-app notice.</p>

        <h2 style={S.h2}>8. Contact</h2>
        <p style={S.p}>Questions about your privacy? Email us at <a href="mailto:info.veevak@gmail.com" style={S.a}>info.veevak@gmail.com</a>.</p>
      </div>
    </div>
  );
}
