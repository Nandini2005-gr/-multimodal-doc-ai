import { useState } from "react";
import FileUploader from "./components/FileUploader";
import ChatBox from "./components/ChatBox";
import SummaryPanel from "./components/SummaryPanel";
import "./App.css";

function App() {
  const [docId, setDocId] = useState(null);
  const [preview, setPreview] = useState("");
  const [messages, setMessages] = useState([]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">Doc<span>AI</span></div>
        </div>
        <div className="header-badge">Powered by LLaMA 3.3</div>
      </header>

      <main className="main">
        <div className="left-panel">
          <FileUploader setDocId={setDocId} setPreview={setPreview} setMessages={setMessages} />
          {preview && <SummaryPanel preview={preview} docId={docId} />}
        </div>

        <div className="right-panel">
          {docId ? (
            <ChatBox docId={docId} messages={messages} setMessages={setMessages} />
          ) : (
            <div className="empty-state">
              <div className="empty-orb">🧠</div>
              <div className="empty-title">Ready to Analyze</div>
              <div className="empty-sub">Upload a document on the left to start an intelligent conversation about its contents.</div>
              <div className="steps">
                <div className="step"><div className="step-num">1</div>Upload</div>
                <div className="step"><div className="step-num">2</div>Process</div>
                <div className="step"><div className="step-num">3</div>Ask</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;