import fitz  # PyMuPDF
from docx import Document

def extract_text(file_path: str, filename: str) -> str:
    ext = filename.lower().split(".")[-1]
    
    if ext == "pdf":
        return extract_from_pdf(file_path)
    elif ext == "docx":
        return extract_from_docx(file_path)
    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return ""

def extract_from_pdf(file_path: str) -> str:
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    return text

def extract_from_docx(file_path: str) -> str:
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])