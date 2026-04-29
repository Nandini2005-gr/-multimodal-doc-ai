# 🧠 Multimodal Doc AI

An AI-powered document analysis and Q&A platform that lets you upload documents and ask questions about them using natural language.

![Tech Stack](https://img.shields.io/badge/FastAPI-Python-green) ![React](https://img.shields.io/badge/Frontend-React-blue) ![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-purple)

---

## ✨ Features

- 📄 Upload PDF, DOCX, and TXT documents
- 🤖 Ask questions in natural language
- ⚡ Fast AI responses powered by Groq LLaMA 3.3
- 🔍 RAG (Retrieval-Augmented Generation) for accurate answers
- 💬 Beautiful chat interface
- 📋 Document preview panel

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI Model | Groq LLaMA 3.3 70B |
| Vector DB | ChromaDB |
| Document Parsing | PyMuPDF, python-docx |

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend:
```bash
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📖 How to Use

1. Open `http://localhost:5173` in your browser
2. Upload a PDF, DOCX, or TXT file
3. Wait for processing to complete
4. Ask any question about your document in the chat box
5. Get instant AI-powered answers!

---

## 📁 Project Structure