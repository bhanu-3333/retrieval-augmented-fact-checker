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
        # 1. Retrieve evidence from Tavily (Live Web)
        results = self.retriever.search_and_index(text)
        
        # 1b. Fallback to local memory if live search is empty or fails
        if not results:
            print("No live results found. Checking local fallback memory...")
            try:
                from .retriever import LocalRetriever
                local_retriever = LocalRetriever()
                results = local_retriever.retrieve(text, k=3)
                if results:
                    print(f"Found {len(results)} matches in local fallback memory.")
            except Exception as e:
                print(f"Local fallback error: {e}")
        
        if not results:
            return {
                "verdict": "Unverified",
                "confidence": 0,
                "explanation": "No live evidence or historical records could be retrieved for this claim. It may be a brand new rumor or extremely niche information.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        # 2. Prepare context for Ollama
        evidence_context = ""
        for i, r in enumerate(results):
            evidence_context += f"--- SOURCE {i+1}: {r['metadata'].get('title', 'Unknown Title')} ---\n"
            evidence_context += f"URL: {r['metadata'].get('url', 'N/A')}\n"
            evidence_context += f"CONTENT: {r['metadata'].get('content', '')}\n\n"
        
        prompt = f"""
        You are a professional fact-checker. Verify the claim below using the provided search results.
        
        CLAIM: {text}
        
        EVIDENCE:
        {evidence_context}
        
        TASK:
        1. Compare the claim against the evidence. 
        2. Detect any direct contradictions. If the evidence says "X is false" and the claim is "X", mark as 'Fake'.
        3. If multiple reliable sources confirm the claim, mark as 'Real'.
        4. If the claim is partially true but missing context, mark as 'Misleading'.
        5. Formulate a detailed explanation citing specific sources.
        
        RULES:
        - Output MUST be valid JSON.
        - Do not use "Unverified" if there is clear evidence for or against.
        - If the evidence is inconclusive, then use "Unverified".
        - Confidence should reflect the strength and number of sources.
        
        RESPONSE FORMAT:
        {{
            "verdict": "Real" | "Fake" | "Misleading" | "Unverified",
            "confidence": <0-100>,
            "explanation": "<detailed reasoning citing sources>",
            "highlighted_claims": ["segments of the original claim that were verified or debunked"]
        }}
        """
        
        print(f"Calling Ollama ({self.model}) at {self.ollama_url}...")
        try:
            # Check if URL already has the endpoint, if not append it
            target_url = self.ollama_url
            if not target_url.endswith("/api/generate") and not target_url.endswith("/api/chat"):
                target_url = target_url.rstrip("/") + "/api/generate"

            response = requests.post(
                target_url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=90
            )
            response.raise_for_status()
            ai_data = response.json()
            
            # Ollama returns the generated text in the 'response' field
            raw_content = ai_data.get('response', '{}')
            data = json.loads(raw_content)
            
        except Exception as e:
            print(f"Ollama integration error: {e}")
            # Intelligent fallback: If we have results but Ollama failed, do a basic check
            has_debunk_keywords = any(k in evidence_context.lower() for k in ["fake", "hoax", "false", "debunked", "misleading"])
            has_confirm_keywords = any(k in evidence_context.lower() for k in ["confirmed", "true", "accurate", "verified by"])
            
            if has_debunk_keywords and not has_confirm_keywords:
                verdict, conf, expl = "Fake", 60, "Automatic detection found debunking keywords in retrieved sources, but AI reasoning failed."
            elif has_confirm_keywords and not has_debunk_keywords:
                verdict, conf, expl = "Real", 60, "Automatic detection found confirmation keywords in retrieved sources, but AI reasoning failed."
            else:
                verdict, conf, expl = "Unverified", 20, f"AI reasoning engine failed ({str(e)}). Evidence was found but could not be definitively analyzed."

            data = {
                "verdict": verdict,
                "confidence": conf,
                "explanation": expl,
                "highlighted_claims": [text]
            }

        # 3. Format final response
        processed_sources = []
        for r in results:
            domain = "unknown"
            url = r['metadata'].get('url', '')
            if url and '//' in url:
                domain = url.split('/')[2]
            
            trusted_domains = ["reuters.com", "apnews.com", "bbc.com", "snopes.com", "factcheck.org", "gov", "org", "edu"]
            trust_score = 95 if any(td in domain for td in trusted_domains) else 75
            
            processed_sources.append({
                "title": r['metadata'].get('title', 'Source'),
                "url": url,
                "summary": r['metadata'].get('content', '')[:300] + "...",
                "trust_score": trust_score
            })

        return {
            "verdict": data.get("verdict", "Unverified"),
            "confidence": data.get("confidence", 0),
            "explanation": data.get("explanation", "Insufficient evidence to form a verdict."),
            "sources": processed_sources,
            "highlighted_claims": data.get("highlighted_claims", [text])
        }

