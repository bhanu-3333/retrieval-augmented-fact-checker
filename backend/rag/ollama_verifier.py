import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

class OllamaVerifier:
    def __init__(self, retriever):
        self.retriever = retriever
        self.ollama_url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate")
        self.model = os.getenv("OLLAMA_MODEL", "mistral:latest")


    def verify(self, text):
        # 1. Retrieve evidence from Tavily (Live Web)
        print(f"Analyzing claim: {text}")
        results = self.retriever.search_and_index(text)
        
        # 1b. Fallback to local memory if live search is empty
        if not results:
            print("No live results. Checking local memory...")
            try:
                from .retriever import LocalRetriever
                local_retriever = LocalRetriever()
                results = local_retriever.retrieve(text, k=3)
            except Exception: pass
        
        if not results:
            return {
                "verdict": "Unverified",
                "confidence": 0,
                "explanation": "No evidence could be retrieved to verify this claim.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        # 2. Prepare context for Ollama
        evidence_context = ""
        for i, r in enumerate(results):
            evidence_context += f"SOURCE {i+1}: {r['metadata'].get('title', 'Unknown')}\n"
            evidence_context += f"URL: {r['metadata'].get('url', 'N/A')}\n"
            evidence_context += f"CONTENT: {r['metadata'].get('content', '')}\n\n"
        
        prompt = f"""
        You are a high-precision AI Fact-Checking Assistant.
        Your task is to verify the following claim against the retrieved evidence.
        
        CLAIM: {text}
        
        RETRIEVED EVIDENCE:
        {evidence_context}
        
        REASONING REQUIREMENTS:
        1. CONTRADICTION DETECTION: If the evidence explicitly denies the claim or says it is a hoax, you MUST mark it as 'Fake'.
        2. CROSS-VERIFICATION: If multiple trusted sources confirm the claim, mark it as 'Real'.
        3. CONTEXT CHECK: If the claim is partially true but lacks critical context, mark it as 'Misleading'.
        4. EXPLANATION STYLE: 
           - Be direct and authoritative.
           - State clearly if an official source confirms or denies the claim.
           - If no official announcement exists for a major claim, point that out.
        
        OUTPUT FORMAT (Strict JSON):
        {{
            "verdict": "Real" | "Fake" | "Misleading",
            "confidence": <integer 0-100>,
            "explanation": "Bullet points or concise paragraphs explaining the reasoning.",
            "highlighted_claims": ["specific segment of the claim that is false or confirmed"]
        }}
        """
        
        # Normalize URL to 127.0.0.1 to avoid Windows localhost issues
        url = self.ollama_url.replace("localhost", "127.0.0.1")
        if not url.endswith("/api/generate"):
            url = url.rstrip("/") + "/api/generate"

        print(f"Reasoning with {self.model} at {url}...")
        try:
            response = requests.post(
                url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=120
            )
            response.raise_for_status()
            ai_data = response.json()
            raw_content = ai_data.get('response', '{}')
            data = json.loads(raw_content)
            
        except Exception as e:
            print(f"Ollama reasoning error: {e}")
            # Intelligent fallback based on keyword detection in evidence
            evidence_lower = evidence_context.lower()
            if any(k in evidence_lower for k in ["fake", "hoax", "false", "misleading", "no official declaration", "debunked"]):
                verdict, conf, expl = "Fake", 75, "Retrieved evidence contains debunking keywords or confirms no official announcement exists. Automated reasoning fallback applied."
            elif any(k in evidence_lower for k in ["confirmed", "official", "true", "accurate"]):
                verdict, conf, expl = "Real", 75, "Retrieved evidence contains confirmation keywords from trusted sources. Automated reasoning fallback applied."
            else:
                verdict, conf, expl = "Unverified", 20, f"Analysis engine offline ({str(e)}). Evidence retrieved but reasoning failed."

            data = {
                "verdict": verdict,
                "confidence": conf,
                "explanation": expl,
                "highlighted_claims": [text]
            }

        # 3. Process sources for display
        processed_sources = []
        for r in results:
            url = r['metadata'].get('url', '')
            domain = url.split('/')[2] if '//' in url else "unknown"
            trusted = ["reuters.com", "apnews.com", "bbc.com", "snopes.com", "factcheck.org", "gov", "org"]
            trust_score = 95 if any(t in domain for t in trusted) else 75
            
            processed_sources.append({
                "title": r['metadata'].get('title', 'Source'),
                "url": url,
                "summary": r['metadata'].get('content', '')[:250] + "...",
                "trust_score": trust_score
            })

        return {
            "verdict": data.get("verdict", "Unverified"),
            "confidence": data.get("confidence", 0),
            "explanation": data.get("explanation", "No conclusive explanation could be generated."),
            "sources": processed_sources,
            "highlighted_claims": data.get("highlighted_claims", [text])
        }


