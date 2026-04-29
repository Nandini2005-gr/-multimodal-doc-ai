import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_claude(question: str, chunks: list) -> str:
    context = "\n\n".join(chunks)

    prompt = f"""You are an intelligent document assistant.
Use the following document content to answer the user's question accurately.
If the answer is not in the context, say so clearly.

Document Context:
{context}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024
    )

    return response.choices[0].message.content