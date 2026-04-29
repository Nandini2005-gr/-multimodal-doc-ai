import chromadb

client = chromadb.Client()
collection = client.get_or_create_collection("documents")

def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def add_to_vector_db(text: str, doc_id: str):
    chunks = chunk_text(text)
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    
    collection.add(
        documents=chunks,
        ids=ids,
        metadatas=[{"doc_id": doc_id} for _ in chunks]
    )

def search_chunks(question: str, doc_id: str, top_k: int = 5):
    results = collection.query(
        query_texts=[question],
        n_results=top_k,
        where={"doc_id": doc_id}
    )
    return results["documents"][0] if results["documents"] else []