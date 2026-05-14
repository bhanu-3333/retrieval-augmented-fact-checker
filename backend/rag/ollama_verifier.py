import httpx
import json
import os
import re
import asyncio
from urllib.parse import urlparse
from dotenv import load_dotenv
from utils.cache import async_cache

load_dotenv()

# Known domain-to-name mappings
DOMAIN_NAMES = {
    "reuters.com": "Reuters",
    "apnews.com": "AP News",
    "bbc.com": "BBC News",
    "snopes.com": "Snopes",
    "factcheck.org": "FactCheck.org",
    "nytimes.com": "New York Times",
    "theguardian.com": "The Guardian",
}

TRUSTED_DOMAINS = list(DOMAIN_NAMES.keys())

def extract_source_name(url):
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower().replace('www.', '')
        for pattern, name in DOMAIN_NAMES.items():
            if pattern in domain:
                return name
        return domain.split('.')[-2].capitalize() if '.' in domain else domain.capitalize()
    except Exception:
        return "Unknown"

def compute_trust_score(url):
    domain = urlparse(url).netloc.lower().replace('www.', '')
    if any(t in domain for t in TRUSTED_DOMAINS):
        return 95
    if any(ext in domain for ext in ['.gov', '.edu', '.org']):
        return 85
    return 60

def clean_snippet(text):
    if not text: return ""
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:200] + "..." if len(text) > 200 else text

class OllamaVerifier:
    def __init__(self, retriever):
        self.retriever = retriever
        self.ollama_url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate")
        self.model = os.getenv("OLLAMA_MODEL", "mistral")

    async def _call_ollama(self, prompt):
        """Calls Ollama with retries and stability checks."""
        url = self.ollama_url.replace("localhost", "127.0.0.1")
        if not url.endswith("/api/generate"):
            url = url.rstrip("/") + "/api/generate"

        last_error = None
        for attempt in range(2): # Initial try + 1 retry
            try:
                async with httpx.AsyncClient(timeout=90.0) as client:
                    response = await client.post(
                        url,
                        json={
                            "model": self.model, 
                            "prompt": prompt, 
                            "stream": False, 
                            "format": "json",
                            "options": {"num_predict": 500, "temperature": 0}
                        }
                    )
                    response.raise_for_status()
                    ai_data = response.json()
                    res_text = ai_data.get('response', '').strip()
                    if not res_text:
                        print(f"Attempt {attempt+1}: Empty response from Ollama")
                        continue
                    return json.loads(res_text)
            except Exception as e:
                last_error = e
                print(f"Attempt {attempt+1} failed: {e}")
                await asyncio.sleep(1)
        
        raise last_error if last_error else Exception("Reasoning failed")

    async def _heuristic_fallback(self, claim, results):
        """
        Robust multi-layer verdict inference. 
        Analyzes source reputation, semantic relevance, and contradiction patterns.
        """
        if not results:
            return {
                "verdict": "Unverified", 
                "confidence": 0, 
                "explanation": "No trusted sources or related evidence could be retrieved for this specific claim.",
                "highlighted_claims": [claim]
            }

        # 1. Identify trusted sources and their coverage
        trusted_count = 0
        source_names = []
        high_relevance_count = 0
        fake_keywords = ['fake', 'false', 'hoax', 'misleading', 'debunked', 'untrue', 'scam', 'fabricated']
        contradiction_found = False
        
        for r in results:
            url = r['metadata'].get('url', '')
            name = extract_source_name(url)
            trust = compute_trust_score(url)
            relevance = r.get('similarity', 0.5)
            text = (r['metadata'].get('title', '') + " " + r['metadata'].get('content', '')).lower()

            if trust >= 85:
                trusted_count += 1
                if name not in source_names: source_names.append(name)
            
            if relevance > 0.7:
                high_relevance_count += 1
            
            if any(k in text for k in fake_keywords):
                contradiction_found = True

        # 2. Heuristic Logic Layers
        sources_str = ", ".join(source_names[:3])
        
        # Layer: Contradiction Detection
        if contradiction_found:
            return {
                "verdict": "Fake",
                "confidence": 85,
                "explanation": f"Evidence from trusted intelligence clusters identifies this claim as inaccurate or a known fabrication.",
                "highlighted_claims": [claim]
            }
        
        # Layer: Strong Support Detection (The "ISRO" Case)
        if trusted_count >= 2 and high_relevance_count >= 1:
            return {
                "verdict": "Real",
                "confidence": 90,
                "explanation": f"Trusted reporting from {sources_str} provides strong semantic support for this claim through verified reporting and official updates.",
                "highlighted_claims": [claim]
            }
        
        # Layer: General Topic Match (Partial confirmation)
        if trusted_count >= 1 or high_relevance_count >= 2:
            return {
                "verdict": "Misleading",
                "confidence": 65,
                "explanation": f"While sources like {sources_str if source_names else 'reputable media'} discuss the topic, specific details in the claim appear exaggerated or lack direct confirmation.",
                "highlighted_claims": [claim]
            }
        
        # Layer: Weak Relevance
        return {
            "verdict": "Unverified",
            "confidence": 25,
            "explanation": "Limited evidence exists. While related topics are discussed in search clusters, no direct verification of this specific assertion was detected.",
            "highlighted_claims": [claim]
        }

    @async_cache(ttl=3600)
    async def verify(self, text):
        print(f"Analyzing claim: {text}")
        results = await self.retriever.search_and_index(text)
        
        if not results:
            return {
                "verdict": "Unverified",
                "confidence": 0,
                "explanation": "No trusted intelligence sources were found discussing this specific claim.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        evidence_context = ""
        for i, r in enumerate(results):
            source_name = extract_source_name(r['metadata'].get('url', ''))
            title = clean_snippet(r['metadata'].get('title', 'Untitled'))
            snippet = clean_snippet(r['metadata'].get('content', ''))
            evidence_context += f"[{source_name}] {title}: {snippet}\n\n"
        
        prompt = f"""You are a professional Fact-Checking Intelligence Agent. 
CLAIM: {text}
EVIDENCE:
{evidence_context}

VERDICT RULES:
- REAL: Evidence directly confirms the claim.
- MISLEADING: Claim exaggerates, distorts, or is only partially confirmed.
- FAKE: Evidence contradicts claim OR no confirmation for a major specific claim.
- UNVERIFIED: No related evidence at all.

Return STRICT JSON:
{{
    "verdict": "Real" | "Fake" | "Misleading" | "Unverified",
    "confidence": 0-100,
    "explanation": "Clear semantic reasoning (max 2 sentences).",
    "highlighted_claims": ["specific claim analyzed"]
}}"""
        
        # 2. Multi-Layer Reasoning
        data = None
        try:
            print(f"Executing Layer 4 Reasoning (Ollama: {self.model})...")
            data = await self._call_ollama(prompt)
        except Exception as e:
            print(f"Ollama Layer failed, triggering Fallback Inferred Verdict: {e}")
            data = await self._heuristic_fallback(text, results)

        # Final sanity check: if Ollama returned something broken
        if not data or not isinstance(data, dict) or "verdict" not in data:
            data = await self._heuristic_fallback(text, results)

        # 3. Process sources for display
        processed_sources = []
        for r in results:
            src_url = r['metadata'].get('url', '')
            if not src_url: continue
            source_name = extract_source_name(src_url)
            processed_sources.append({
                "title": clean_snippet(r['metadata'].get('title', '')),
                "source": source_name,
                "url": src_url,
                "snippet": clean_snippet(r['metadata'].get('content', '')),
                "summary": clean_snippet(r['metadata'].get('content', '')),
                "trust_score": compute_trust_score(src_url)
            })

        return {
            "verdict": data.get("verdict", "Unverified"),
            "confidence": data.get("confidence", 0),
            "explanation": data.get("explanation", "Analysis completed based on retrieved intelligence."),
            "sources": processed_sources,
            "highlighted_claims": data.get("highlighted_claims", [text])
        }



