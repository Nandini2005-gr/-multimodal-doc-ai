import { useDropzone } from "react-dropzone";
import { useState } from "react";
import axios from "axios";

export default function FileUploader({ setDocId, setPreview, setMessages }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setProgress(0);
    setMessages([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const interval = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 200);
      const res = await axios.post("http://localhost:8000/upload", formData);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setDocId(res.data.doc_id);
        setPreview(res.data.preview);
        setUploadedFile(file.name);
        setUploading(false);
      }, 400);
    } catch {
      setError("Upload failed. Make sure backend is running.");
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [], "text/plain": [] },
    maxFiles: 1,
  });

  const getFileIcon = (name) => {
    if (!name) return "📄";
    if (name.endsWith(".pdf")) return "📕";
    if (name.endsWith(".docx")) return "📘";
    return "📄";
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardTitle}>Upload Document</span>
        <span style={s.cardSub}>PDF · DOCX · TXT</span>
      </div>

      <div {...getRootProps()} style={{
        ...s.dropzone,
        borderColor: isDragActive ? "rgba(108,99,255,0.6)" : uploadedFile ? "rgba(67,233,123,0.4)" : "rgba(255,255,255,0.1)",
        background: isDragActive ? "rgba(108,99,255,0.08)" : "rgba(255,255,255,0.02)",
      }}>
        <input {...getInputProps()} />
        {uploading ? (
          <div style={s.uploadingState}>
            <div style={s.spinner} />
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>
            <span style={s.uploadingText}>Processing document...</span>
          </div>
        ) : uploadedFile ? (
          <div style={s.successState}>
            <div style={s.fileIconLarge}>{getFileIcon(uploadedFile)}</div>
            <span style={s.fileName}>{uploadedFile}</span>
            <span style={s.successBadge}>✓ Ready to chat</span>
            <span style={s.changeHint}>Drop another file to replace</span>
          </div>
        ) : (
          <div style={s.idleState}>
            <div style={s.uploadIcon}>
              {isDragActive ? "🎯" : "⬆️"}
            </div>
            <span style={s.dropText}>{isDragActive ? "Drop it here!" : "Drag & drop your file"}</span>
            <span style={s.browseText}>or click to browse</span>
          </div>
        )}
      </div>
      {error && <div style={s.error}>{error}</div>}
    </div>
  );
}

const s = {
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, backdropFilter: "blur(20px)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f0ff" },
  cardSub: { fontSize: "0.72rem", color: "rgba(240,240,255,0.35)", letterSpacing: "0.08em", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 100 },
  dropzone: { border: "1.5px dashed", borderRadius: 16, padding: "32px 20px", cursor: "pointer", transition: "all 0.25s ease", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" },
  idleState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  uploadIcon: { fontSize: "2.2rem", marginBottom: 4 },
  dropText: { color: "rgba(240,240,255,0.8)", fontSize: "0.9rem", fontWeight: 500 },
  browseText: { color: "rgba(240,240,255,0.3)", fontSize: "0.78rem" },
  uploadingState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" },
  spinner: { width: 36, height: 36, border: "3px solid rgba(108,99,255,0.2)", borderTop: "3px solid #6c63ff", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  progressBar: { width: "80%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #6c63ff, #ff6584)", borderRadius: 4, transition: "width 0.3s ease" },
  uploadingText: { color: "rgba(240,240,255,0.5)", fontSize: "0.82rem" },
  successState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  fileIconLarge: { fontSize: "2.5rem" },
  fileName: { color: "#f0f0ff", fontWeight: 600, fontSize: "0.9rem", textAlign: "center", wordBreak: "break-all" },
  successBadge: { background: "rgba(67,233,123,0.15)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", fontSize: "0.75rem", padding: "4px 12px", borderRadius: 100, fontWeight: 500 },
  changeHint: { color: "rgba(240,240,255,0.25)", fontSize: "0.72rem" },
  error: { marginTop: 10, color: "#ff6584", fontSize: "0.8rem", textAlign: "center" },
};