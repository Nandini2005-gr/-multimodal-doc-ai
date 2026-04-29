export default function SummaryPanel({ preview, docId }) {
  const ext = docId?.split(".").pop()?.toUpperCase() || "FILE";
  const icons = { PDF: "📕", DOCX: "📘", TXT: "📄" };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.title}>Document Preview</span>
        <span style={s.badge}>{ext}</span>
      </div>
      <div style={s.fileRow}>
        <span style={s.fileIcon}>{icons[ext] || "📄"}</span>
        <span style={s.fileName}>{docId}</span>
      </div>
      <div style={s.divider} />
      <p style={s.preview}>{preview}...</p>
    </div>
  );
}

const s = {
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, backdropFilter: "blur(20px)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f0ff" },
  badge: { fontSize: "0.7rem", color: "rgba(240,240,255,0.35)", letterSpacing: "0.1em", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 100 },
  fileRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 },
  fileIcon: { fontSize: "1.4rem" },
  fileName: { color: "rgba(240,240,255,0.6)", fontSize: "0.82rem", wordBreak: "break-all" },
  divider: { height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 14 },
  preview: { color: "rgba(240,240,255,0.35)", fontSize: "0.8rem", lineHeight: 1.7, maxHeight: 130, overflowY: "auto" },
};