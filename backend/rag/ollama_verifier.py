import requests
import json
import os
import re
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

# Known domain-to-name mappings for clean source display
DOMAIN_NAMES = {
    "reuters.com": "Reuters",
    "apnews.com": "AP News",
    "bbc.com": "BBC News",
    "bbc.co.uk": "BBC News",
    "snopes.com": "Snopes",
    "factcheck.org": "FactCheck.org",
    "altnews.in": "Alt News",
    "boomlive.in": "BOOM Live",
    "who.int": "WHO",
    "nasa.gov": "NASA",
    "un.org": "United Nations",
    "nytimes.com": "New York Times",
    "theguardian.com": "The Guardian",
    "washingtonpost.com": "Washington Post",
    "cnn.com": "CNN",
    "ndtv.com": "NDTV",
    "thehindu.com": "The Hindu",
    "hindustantimes.com": "Hindustan Times",
    "timesofindia.indiatimes.com": "Times of India",
    "indiatoday.in": "India Today",
    "news18.com": "News18",
    "thequint.com": "The Quint",
    "scroll.in": "Scroll.in",
    "livemint.com": "LiveMint",
    "economictimes.indiatimes.com": "Economic Times",
    "nature.com": "Nature",
    "science.org": "Science",
    "politifact.com": "PolitiFact",
    "en.wikipedia.org": "Wikipedia",
}

TRUSTED_DOMAINS = [
    "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk",
    "snopes.com", "factcheck.org", "altnews.in", "boomlive.in",
    "who.int", "nasa.gov", "un.org", "nytimes.com",
    "theguardian.com", "washingtonpost.com", "politifact.com",
    "nature.com", "science.org",
]


def extract_source_name(url):
    """Extract a clean, human-readable source name from a URL."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        # Remove www.
        domain = re.sub(r'^www\.', '', domain)

        # Check known mappings
        for pattern, name in DOMAIN_NAMES.items():
            if pattern in domain:
                return name

        # Fallback: capitalize domain parts
        parts = domain.split('.')
        if len(parts) >= 2:
            return parts[-2].capitalize()
        return domain.capitalize()
    except Exception:
        return "Unknown"


def compute_trust_score(url):
    """Compute trust score based on domain reputation."""
    try:
        domain = urlparse(url).netloc.lower().replace('www.', '')
        if any(t in domain for t in TRUSTED_DOMAINS):
            return 95
        if any(ext in domain for ext in ['.gov', '.edu', '.org']):
            return 85
        return 60
    except Exception:
        return 50


def clean_snippet(text):
    """Clean a snippet for display — remove broken encoding, excess whitespace."""
    if not text:
        return ""
    # Remove null bytes and control chars
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove leading/trailing quotes if doubled
    text = text.strip('"\'')
    # Truncate to reasonable length
    if len(text) > 300:
        text = text[:297] + "..."
    return text


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
                "explanation": "No evidence could be retrieved to verify this claim. This does not mean the claim is true or false — it means no trusted sources were found discussing it.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        # 2. Prepare context for Ollama with clean source attribution
        evidence_context = ""
        for i, r in enumerate(results):
            url = r['metadata'].get('url', '')
            source_name = extract_source_name(url)
            title = clean_snippet(r['metadata'].get('title', 'Untitled'))
            content = clean_snippet(r['metadata'].get('content', ''))
            
            evidence_context += f"SOURCE {i+1} [{source_name}]: {title}\n"
            evidence_context += f"URL: {url}\n"
            evidence_context += f"CONTENT: {content}\n\n"
        
        prompt = f"""You are a professional AI Fact-Checking Investigator. Your job is to determine whether a claim is TRUE based on EVIDENCE, not based on whether related articles exist.

CRITICAL RULES:
- Finding related articles does NOT prove a claim is true.
- You must check whether the evidence EXPLICITLY CONFIRMS the specific claim.
- If evidence discusses the same topic but does NOT confirm the specific claim, the verdict must be FAKE or MISLEADING.
- Pay close attention to specific numbers, dates, names, and promises in the claim.
- An absence of confirmation from trusted sources for a major claim is strong evidence it is FAKE.

CLAIM TO VERIFY:
"{text}"

RETRIEVED EVIDENCE:
{evidence_context}

ANALYSIS STEPS (you must follow these):
1. What specific factual assertions does the claim make? List them.
2. For EACH assertion, does ANY retrieved source EXPLICITLY confirm it with direct evidence?
3. Are there contradictions between the claim and the evidence?
4. Does the claim contain exaggerations, fabricated numbers, or unsupported promises?
5. If the claim is about a major announcement (policy, money, scheme), do official/trusted sources confirm it?

VERDICT RULES:
- REAL: Multiple trusted sources DIRECTLY and EXPLICITLY confirm the core claim.
- FAKE: Evidence contradicts the claim, OR no trusted source confirms a major/specific claim, OR the claim appears fabricated.
- MISLEADING: Claim is partially true but exaggerated, taken out of context, or missing critical nuance.
- UNVERIFIED: Insufficient evidence exists to make a determination either way.

OUTPUT FORMAT (strict JSON only, no markdown):
{{
    "verdict": "Real" | "Fake" | "Misleading" | "Unverified",
    "confidence": <integer 0-100>,
    "explanation": "<Clear, direct explanation. State what the evidence says and does NOT say. If the claim mentions specific numbers or promises, address whether evidence confirms those specifics.>",
    "highlighted_claims": ["<specific sub-claim 1>", "<specific sub-claim 2>"]
}}"""
        
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
                timeout=180
            )
            response.raise_for_status()
            ai_data = response.json()
            raw_content = ai_data.get('response', '{}')
            data = json.loads(raw_content)
            
            # Validate verdict is one of the allowed values
            allowed = ["Real", "Fake", "Misleading", "Unverified"]
            if data.get("verdict") not in allowed:
                data["verdict"] = "Unverified"
            
        except Exception as e:
            print(f"Ollama reasoning error: {e}")
            # Smarter fallback: default to Unverified rather than guessing
            data = {
                "verdict": "Unverified",
                "confidence": 15,
                "explanation": f"The AI reasoning engine could not complete analysis ({type(e).__name__}). Evidence was retrieved but could not be semantically evaluated. Please retry.",
                "highlighted_claims": [text]
            }

        # 3. Process sources for display with proper extraction
        processed_sources = []
        seen_urls = set()
        for r in results:
            src_url = r['metadata'].get('url', '')
            if src_url in seen_urls or not src_url:
                continue
            seen_urls.add(src_url)

            source_name = extract_source_name(src_url)
            title = clean_snippet(r['metadata'].get('title', ''))
            snippet = clean_snippet(r['metadata'].get('content', ''))
            trust = compute_trust_score(src_url)

            processed_sources.append({
                "title": title if title else source_name,
                "source": source_name,
                "url": src_url,
                "snippet": snippet,
                "summary": snippet,
                "trust_score": trust
            })

        return {
            "verdict": data.get("verdict", "Unverified"),
            "confidence": data.get("confidence", 0),
            "explanation": data.get("explanation", "No conclusive explanation could be generated."),
            "sources": processed_sources,
            "highlighted_claims": data.get("highlighted_claims", [text])
        }
