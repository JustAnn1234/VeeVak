// Terms of Service page — rendered as an overlay from Landing.jsx
export default function Terms({ onClose }) {
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

        <h1 style={S.h1}>Terms of Service</h1>
        <p style={S.sub}>Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

        <p style={S.p}>By accessing or using VeeVak ("the Service"), you agree to be bound by these Terms of Service. Please read them carefully before creating an account.</p>

        <h2 style={S.h2}>1. Acceptance of Terms</h2>
        <p style={S.p}>By creating a VeeVak account you confirm that you are at least 18 years old, that you have read these terms, and that you agree to abide by them. If you are using VeeVak on behalf of a business, you represent that you have authority to bind that business to these terms.</p>

        <h2 style={S.h2}>2. Description of Service</h2>
        <p style={S.p}>VeeVak is an AI-powered business clarity tool for small and informal commerce businesses. It provides sales logging, expense tracking, inventory management, customer records, and AI-generated business insights. The Service is provided "as is" and may be updated or modified at any time.</p>

        <h2 style={S.h2}>3. Your Account</h2>
        <p style={S.p}>You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorised access. We are not liable for losses arising from compromised credentials you failed to protect.</p>

        <h2 style={S.h2}>4. Acceptable Use</h2>
        <p style={S.p}>You agree not to use VeeVak to: (a) violate any applicable laws or regulations; (b) upload content that is fraudulent, harmful, or infringes third-party rights; (c) attempt to reverse-engineer, scrape, or disrupt the Service; (d) misrepresent your identity or business information.</p>

        <h2 style={S.h2}>5. AI-Generated Content</h2>
        <p style={S.p}>VeeVak uses AI models to generate insights, summaries, and recommendations. These are provided for informational purposes only and do not constitute financial, legal, or professional advice. Always apply your own judgement before acting on AI-generated outputs.</p>

        <h2 style={S.h2}>6. Intellectual Property</h2>
        <p style={S.p}>The VeeVak platform, branding, and underlying software are owned by VeeVak and protected by applicable intellectual property laws. Your business data remains yours — we claim no ownership over it.</p>

        <h2 style={S.h2}>7. Limitation of Liability</h2>
        <p style={S.p}>To the maximum extent permitted by applicable law, VeeVak shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including loss of business data or profits.</p>

        <h2 style={S.h2}>8. Termination</h2>
        <p style={S.p}>You may close your account at any time. We reserve the right to suspend or terminate accounts that violate these terms, with or without notice.</p>

        <h2 style={S.h2}>9. Changes to Terms</h2>
        <p style={S.p}>We may revise these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms. We will provide reasonable notice of material changes.</p>

        <h2 style={S.h2}>10. Governing Law</h2>
        <p style={S.p}>These terms are governed by the laws of the Federal Republic of Nigeria.</p>

        <h2 style={S.h2}>11. Contact</h2>
        <p style={S.p}>Questions about these terms? Email us at <a href="mailto:info.veevak@gmail.com" style={S.a}>info.veevak@gmail.com</a>.</p>
      </div>
    </div>
  );
}
