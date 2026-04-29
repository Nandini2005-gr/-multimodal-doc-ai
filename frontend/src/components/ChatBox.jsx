import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const suggestions = ["Summarize this document", "What are the key points?", "What is the main topic?"];

export default function ChatBox({ docId, messages, setMessages }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuestion = async (q) => {
    const text = q || question;
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/ask", { question: text, doc_id: docId });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "❌ Error getting answer. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      {messages.length === 0 && (
        <div style={s.suggestions}>
          <p style={s.suggestLabel}>✨ Try asking</p>
          <div style={s.chips}>
            {suggestions.map((s2, i) => (
              <button key={i} style={s.chip} onClick={() => sendQuestion(s2)}>{s2}</button>
            ))}
          </div>
        </div>
      )}

      <div style={s.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...s.msgWrap, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "ai" && <div style={s.avatar}>🤖</div>}
            <div style={{ ...s.bubble, ...(msg.role === "user" ? s.userBubble : s.aiBubble) }}>
              {msg.role === "ai"
                ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                : <p>{msg.text}</p>
              }
            </div>
            {msg.role === "user" && <div style={s.avatar}>👤</div>}
          </div>
        ))}
        {loading && (
          <div style={{ ...s.msgWrap, justifyContent: "flex-start" }}>
            <div style={s.avatar}>🤖</div>
            <div style={{ ...s.bubble, ...s.aiBubble, ...s.typingBubble }}>
              <div style={s.dots}>
                <span style={{ ...s.dot, animationDelay: "0s" }} />
                <span style={{ ...s.dot, animationDelay: "0.2s" }} />
                <span style={{ ...s.dot, animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputArea}>
        <div style={s.inputWrap}>
          <input
            style={s.input}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendQuestion()}
            placeholder="Ask anything about your document..."
            disabled={loading}
          />
          <button style={{ ...s.sendBtn, opacity: loading || !question.trim() ? 0.5 : 1 }} onClick={() => sendQuestion()} disabled={loading || !question.trim()}>
            <span style={s.sendIcon}>↑</span>
          </button>
        </div>
        <p style={s.hint}>Press Enter to send</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}

const s = {
  container: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" },
  suggestions: { padding: "32px 32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 48 },
  suggestLabel: { color: "rgba(240,240,255,0.3)", fontSize: "0.78rem", letterSpacing: "0.06em" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  chip: { background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.25)", color: "rgba(240,240,255,0.7)", padding: "8px 16px", borderRadius: 100, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" },
  messages: { flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 },
  msgWrap: { display: "flex", gap: 10, alignItems: "flex-end" },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 },
  bubble: { maxWidth: "70%", padding: "12px 16px", borderRadius: 18, fontSize: "0.88rem", lineHeight: 1.7 },
  userBubble: { background: "linear-gradient(135deg, #6c63ff, #8b84ff)", color: "#fff", borderBottomRightRadius: 4 },
  aiBubble: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,240,255,0.85)", borderBottomLeftRadius: 4, backdropFilter: "blur(10px)" },
  typingBubble: { padding: "14px 20px" },
  dots: { display: "flex", gap: 5, alignItems: "center" },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "rgba(108,99,255,0.6)", animation: "bounce 1.2s ease-in-out infinite", display: "inline-block" },
  inputArea: { padding: "16px 28px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  inputWrap: { display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "6px 6px 6px 18px", transition: "border-color 0.2s" },
  input: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#f0f0ff", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", padding: "6px 0" },
  sendBtn: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #6c63ff, #ff6584)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 },
  sendIcon: { color: "#fff", fontSize: "1.2rem", fontWeight: 700 },
  hint: { color: "rgba(240,240,255,0.2)", fontSize: "0.7rem", textAlign: "center", marginTop: 8 },
};