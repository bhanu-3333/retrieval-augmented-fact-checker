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
            evidence_context += f"--- SOURCE {i+1}: {r['metadata']['title']} ---\n"
            evidence_context += f"URL: {r['metadata']['url']}\n"
            evidence_context += f"CONTENT: {r['metadata']['content']}\n\n"
        
        prompt = f"""
        You are an elite AI fact-checker with the reasoning capabilities of Perplexity AI. 
        Your task is to verify the following claim using the provided live search results.
        
        CLAIM: {text}
        
        RETRIEVED EVIDENCE:
        {evidence_context}
        
        STRICT ANALYSIS GUIDELINES:
        1. CROSS-REFERENCE: Compare multiple sources. If sources contradict each other, highlight it.
        2. VERDICT DEFINITIONS:
           - 'Real': Multiple trusted sources explicitly confirm the claim.
           - 'Fake': Multiple trusted sources explicitly debunk the claim, or it's a known hoax.
           - 'Misleading': The claim contains elements of truth but is presented out of context or exaggerated.
           - 'Unverified': No definitive evidence found in the provided snippets.
        3. SOURCE RELIABILITY: Prioritize Reuters, AP, BBC, Snopes, and government domains.
        4. REASONING: Explain your logical path. If it's a known rumor, mention that.
        5. DYNAMIC CONFIDENCE:
           - 90-100%: Direct confirmation/debunking from multiple top-tier sources.
           - 70-89%: Strong evidence but maybe from fewer sources.
           - 40-69%: Mixed evidence or less authoritative sources.
           - 0-39%: Very weak or no evidence.
        
        OUTPUT FORMAT (JSON ONLY - No other text):
        {{
            "verdict": "Real/Fake/Misleading/Unverified",
            "confidence": <integer 0-100>,
            "explanation": "<detailed reasoning including specific source names>",
            "highlighted_claims": ["specific parts of the claim that are confirmed/debunked"]
        }}
        """
        
        print(f"Calling Ollama ({self.model}) for advanced reasoning...")
        try:
            response = requests.post(
                self.ollama_url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=60 # Increased timeout for reasoning
            )
            response.raise_for_status()
            ai_response = response.json().get('response', '')
            data = json.loads(ai_response)
        except Exception as e:
            print(f"Ollama error: {e}")
            # Fallback reasoning if Ollama fails (basic keyword check)
            data = {
                "verdict": "Unverified",
                "confidence": 20,
                "explanation": f"The AI reasoning engine encountered an error ({str(e)}). Analysis is based on raw search relevance only.",
                "highlighted_claims": [text]
            }

        # 3. Format final response
        processed_sources = []
        for r in results:
            # Simple trust score heuristic
            domain = r['metadata']['url'].split('/')[2]
            trusted_domains = ["reuters.com", "apnews.com", "bbc.com", "snopes.com", "factcheck.org", "gov", "org", "edu"]
            trust_score = 95 if any(td in domain for td in trusted_domains) else 75
            
            processed_sources.append({
                "title": r['metadata']['title'],
                "url": r['metadata']['url'],
                "summary": r['metadata']['content'][:250] + "...",
                "trust_score": trust_score
            })

        return {
            "verdict": data.get("verdict", "Unverified"),
            "confidence": data.get("confidence", 0),
            "explanation": data.get("explanation", "Insufficient evidence to form a verdict."),
            "sources": processed_sources,
            "highlighted_claims": data.get("highlighted_claims", [text])
        }
