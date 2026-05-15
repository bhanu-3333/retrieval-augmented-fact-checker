from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time
import os
from dotenv import load_dotenv

from rag.tavily_retriever import TavilyRetriever
from rag.ollama_verifier import OllamaVerifier
from utils.preprocessing import clean_text

load_dotenv()

app = FastAPI(title="FakeScan AI - Live RAG Edition")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Live RAG components
retriever = TavilyRetriever()
verifier = OllamaVerifier(retriever)

class NewsRequest(BaseModel):
    text: str

class Source(BaseModel):
    title: str
    url: str
    summary: str
    trust_score: int

class AnalysisResponse(BaseModel):
    verdict: str
    confidence: int
    explanation: str
    sources: List[Source]
    highlighted_claims: List[str]

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_news(request: NewsRequest):
    """
    Analyzes a news claim by retrieving live evidence and verifying it using AI.
    Returns a verdict, confidence score, and supporting evidence.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    start_time = time.time()
    
    cleaned = clean_text(request.text)
    
    # Check if Tavily is configured
    if not os.getenv("TAVILY_API_KEY") or os.getenv("TAVILY_API_KEY") == "your_tavily_api_key_here":
         return {
            "verdict": "Configuration Missing",
            "confidence": 0,
            "explanation": "TAVILY_API_KEY is not set in backend/.env. Please add your Tavily API key to enable live web retrieval.",
            "sources": [],
            "highlighted_claims": [request.text]
        }

    try:
        # Now awaiting the async verify method
        result = await verifier.verify(cleaned)
        print(f"Analysis completed in {time.time() - start_time:.2f} seconds")
        return result
    except Exception as e:
        print(f"Detailed Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {"status": "online", "message": "FakeScan AI Live RAG API is running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
