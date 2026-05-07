import random

class Verifier:
    def __init__(self, retriever):
        self.retriever = retriever

    def verify(self, text):
        results = self.retriever.retrieve(text)
        
        # If no results or distance is too high, return Unverified
        # FAISS L2 distance: lower is better. 0 is perfect match.
        # Threshold of 1.0 is roughly "related", > 1.5 is "unrelated" for this model
        if not results or results[0]['distance'] > 1.2:
            return {
                "verdict": "Unverified",
                "confidence": 0,
                "explanation": "No matching evidence found in our trusted database. The claim could not be semantically linked to known fact-checks.",
                "sources": [],
                "highlighted_claims": [text]
            }
            
        best_match = results[0]['metadata']
        best_distance = results[0]['distance']
        
        # Map distance to confidence percentage (0 distance -> 99%, 1.2 distance -> 60%)
        confidence = int(max(60, min(99, 100 - (best_distance * 33))))
        
        return {
            "verdict": best_match['verdict'],
            "confidence": confidence,
            "explanation": best_match['evidence'],
            "sources": [
                {
                    "title": r['metadata']['source_title'],
                    "url": r['metadata']['url'],
                    "trust_score": r['metadata']['trust_score']
                } for r in results if r['distance'] < 1.5
            ],
            "highlighted_claims": [best_match['claim']]
        }
