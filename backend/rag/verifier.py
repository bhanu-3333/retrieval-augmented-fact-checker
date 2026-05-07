import random

class Verifier:
    def __init__(self, retriever):
        self.retriever = retriever

    def verify(self, text):
        # In a real RAG, we would extract claims and then retrieve
        # Here we retrieve directly based on input text
        results = self.retriever.retrieve(text)
        
        if not results:
            return {
                "verdict": "Unverified",
                "confidence": 50,
                "explanation": "No matching evidence found in our trusted database.",
                "sources": [],
                "highlighted_claims": [text[:50] + "..."] if len(text) > 50 else [text]
            }
            
        # Simulate logic: take the best match
        best_match = results[0]['metadata']
        
        # Calculate confidence based on some dummy logic (simulated)
        confidence = random.randint(75, 98)
        
        return {
            "verdict": best_match['verdict'],
            "confidence": confidence,
            "explanation": best_match['evidence'],
            "sources": [
                {
                    "title": r['metadata']['source_title'],
                    "url": r['metadata']['url'],
                    "trust_score": random.randint(90, 100)
                } for r in results
            ],
            "highlighted_claims": [best_match['claim']]
        }
