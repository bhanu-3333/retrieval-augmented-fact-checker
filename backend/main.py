from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time

from rag.retriever import Retriever
from rag.verifier import Verifier
from utils.preprocessing import clean_text

app = FastAPI(title="Fake News Detection AI")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG components
retriever = Retriever()
verifier = Verifier(retriever)

class NewsRequest(BaseModel):
    text: str

class Source(BaseModel):
    title: str
    url: str
    trust_score: int

class AnalysisResponse(BaseModel):
    verdict: str
    confidence: int
    explanation: str
    sources: List[Source]
    highlighted_claims: List[str]

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_news(request: NewsRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Simulate processing delay for "thinking" effect in frontend
    time.sleep(1.5)
    
    cleaned = clean_text(request.text)
    result = verifier.verify(cleaned)
    
    return result

@app.get("/")
async def root():
    return {"status": "online", "message": "Fake News Detection API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
