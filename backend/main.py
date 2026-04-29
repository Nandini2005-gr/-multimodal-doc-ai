from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from document_processor import extract_text
from rag_engine import add_to_vector_db, search_chunks
from claude_client import ask_claude

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

class QuestionRequest(BaseModel):
    question: str
    doc_id: str

@app.get("/")
def root():
    return {"message": "Multimodal Doc AI is running!"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    text = extract_text(file_path, file.filename)
    
    if not text:
        return {"error": "Could not extract text from file"}
    
    add_to_vector_db(text, file.filename)
    
    return {
        "message": "File uploaded and processed successfully!",
        "doc_id": file.filename,
        "preview": text[:300]
    }

@app.post("/ask")
async def ask_question(req: QuestionRequest):
    chunks = search_chunks(req.question, req.doc_id)
    
    if not chunks:
        return {"answer": "No relevant content found in the document."}
    
    answer = ask_claude(req.question, chunks)
    return {"answer": answer}