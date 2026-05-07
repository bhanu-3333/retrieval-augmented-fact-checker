import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

class OllamaVerifier:
    def __init__(self, retriever):
        self.retriever = retriever
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
        self.model = os.getenv("OLLAMA_MODEL", "llama3")

    def verify(self, text):
        # 1. Retrieve evidence from Tavily
        results = self.retriever.search_and_index(text)
        
        if not results:
            return {
                "verdict": "Unverified",
                "confidence": 0,
                "explanation": "No live evidence could be retrieved from the web for this claim.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        # 2. Prepare context for Ollama
        evidence_context = "\n\n".join([
            f"Source: {r['metadata']['title']}\nContent: {r['metadata']['content']}"
            for r in results
        ])
        
        prompt = f"""
        You are a professional fact-checking AI assistant. 
        Analyze the following claim based ONLY on the provided retrieved evidence.
        
        CLAIM: {text}
        
        EVIDENCE:
        {evidence_context}
        
        INSTRUCTIONS:
        1. Determine if the claim is 'Real', 'Fake', or 'Misleading'. 
        2. If evidence is insufficient, use 'Unverified'.
        3. Provide a concise, professional explanation of WHY you reached this verdict.
        4. Assign a confidence score from 0 to 100 based on the strength and consistency of the evidence.
        5. Identify the primary claim being analyzed.
        
        OUTPUT FORMAT (JSON ONLY):
        {{
            "verdict": "Real/Fake/Misleading/Unverified",
            "confidence": 0-100,
            "explanation": "concise explanation",
            "highlighted_claims": ["claim snippet"]
        }}
        """
        
        print(f"Calling Ollama ({self.model}) for reasoning...")
        try:
            response = requests.post(
                self.ollama_url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=30
            )
            response.raise_for_status()
            ai_response = response.json().get('response', '')
            data = json.loads(ai_response)
        except Exception as e:
            print(f"Ollama error: {e}")
            # Fallback logic if Ollama fails
            data = {
                "verdict": "Processing Error",
                "confidence": 0,
                "explanation": f"Error calling Ollama reasoning engine: {str(e)}",
                "highlighted_claims": [text]
            }

        # 3. Format final response
        return {
            "verdict": data.get("verdict", "Unverified"),
            "confidence": data.get("confidence", 0),
            "explanation": data.get("explanation", "Insufficient evidence."),
            "sources": [
                {
                    "title": r['metadata']['title'],
                    "url": r['metadata']['url'],
                    "summary": r['metadata']['content'][:200] + "...",
                    "trust_score": 90 # Tavily results are generally high quality
                } for r in results
            ],
            "highlighted_claims": data.get("highlighted_claims", [text])
        }
