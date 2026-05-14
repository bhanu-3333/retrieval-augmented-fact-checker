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
        # Optimization 3: Use lightweight model
        self.model = os.getenv("OLLAMA_MODEL", "mistral")

    @async_cache(ttl=3600)
    async def verify(self, text):
        # 1. Retrieve evidence (Async)
        print(f"Analyzing claim: {text}")
        results = await self.retriever.search_and_index(text)
        
        if not results:
            return {
                "verdict": "Unverified",
                "confidence": 0,
                "explanation": "No trusted evidence found for this claim.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        # Optimization 2: Send only Title, Snippet, and Source Name
        evidence_context = ""
        for i, r in enumerate(results):
            url = r['metadata'].get('url', '')
            source_name = extract_source_name(url)
            title = clean_snippet(r['metadata'].get('title', 'Untitled'))
            snippet = clean_snippet(r['metadata'].get('content', ''))
            evidence_context += f"[{source_name}] {title}: {snippet}\n\n"
        
        # Improved reasoning logic with semantic analysis
        prompt = f"""You are a Fact-Checking Intelligence Agent. Analyze the claim using ONLY the provided evidence.

CLAIM: {text}

EVIDENCE:
{evidence_context}

VERDICT RULES:
- REAL: Evidence directly confirms the exact claim.
- MISLEADING: Evidence is partially related, or the claim exaggerates/distorts real info.
- FAKE: Evidence contradicts the claim, OR no trusted source confirms a major/specific claim discussed in sources, OR fabricated promises/schemes are detected.
- UNVERIFIED: Absolutely no meaningful or related evidence exists.

SEMANTIC REASONING:
- If sources discuss the core topic (e.g., a party manifesto) but DO NOT mention the specific claim (e.g., a "free" promise), the verdict should be FAKE or MISLEADING, not Unverified.
- Use semantic context: lack of confirmation for a major announcement in trusted media is evidence of fabrication.

Return STRICT JSON:
{{
    "verdict": "Real" | "Fake" | "Misleading" | "Unverified",
    "confidence": 0-100,
    "explanation": "Clear, semantic explanation of why the evidence confirms or fails to confirm the claim.",
    "highlighted_claims": ["specific claim analyzed"]
}}"""

        
        url = self.ollama_url.replace("localhost", "127.0.0.1")
        if not url.endswith("/api/generate"):
            url = url.rstrip("/") + "/api/generate"

        print(f"Reasoning with {self.model}...")
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    url,
                    json={"model": self.model, "prompt": prompt, "stream": False, "format": "json"}
                )
                response.raise_for_status()
                ai_data = response.json()
                data = json.loads(ai_data.get('response', '{}'))
        except Exception as e:
            print(f"Ollama error: {e}")
            data = {"verdict": "Unverified", "confidence": 0, "explanation": "Reasoning failed.", "highlighted_claims": [text]}

        # 3. Process sources
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
            "explanation": data.get("explanation", "No explanation available."),
            "sources": processed_sources,
            "highlighted_claims": data.get("highlighted_claims", [text])
        }

