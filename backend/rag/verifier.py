class Verifier:
    def __init__(self, retriever):
        self.retriever = retriever

    def verify(self, text):
        results = self.retriever.retrieve(text, k=5)
        
        if not results:
            return self._unverified_response(text)
            
        best_match = results[0]
        similarity = best_match['similarity']
        
        # Thresholds for Cosine Similarity (Inner Product of normalized vectors)
        # 0.85+ is very strong match
        # 0.70 - 0.85 is a good match
        # 0.50 - 0.70 is weak/misleading potential
        # < 0.50 is likely unrelated
        
        if similarity < 0.45:
            return self._unverified_response(text)
            
        # Analyze top 5 results for consensus
        verdicts = [r['metadata']['verdict'] for r in results if r['similarity'] > 0.6]
        
        # If we have multiple high-similarity matches, use consensus
        if verdicts:
            from collections import Counter
            most_common_verdict = Counter(verdicts).most_common(1)[0][0]
        else:
            most_common_verdict = best_match['metadata']['verdict']
            
        # Contradiction Detection (Simple heuristic)
        # If input has 'not', 'no', 'never' and match doesn't, or vice versa
        negations = ['not', 'no', 'never', 'ban', 'stop', 'shutdown']
        input_negated = any(word in text.lower().split() for word in negations)
        match_negated = any(word in best_match['text'].lower().split() for word in negations)
        
        final_verdict = most_common_verdict
        if input_negated != match_negated and similarity > 0.8:
            # If meanings are likely opposite but similarity is high, it might be a flip
            # e.g. "NASA confirmed X" vs "NASA never confirmed X"
            # Our dataset entries usually have the correct verdict for the claim they describe.
            # So if our match says "NASA confirmed X" is FAKE, then "NASA confirmed X" IS fake.
            pass

        # Calculate Confidence
        # Similarity (0.5 to 1.0) mapped to 50-99%
        conf_from_sim = int(max(50, min(99, (similarity - 0.4) * 100 + 40)))
        # Adjust based on consensus
        consensus_bonus = 5 if len(set(verdicts)) == 1 and len(verdicts) > 1 else 0
        confidence = min(99, conf_from_sim + consensus_bonus)
        
        # Adjust verdict based on similarity level
        if similarity < 0.65 and final_verdict != "Unverified":
            final_verdict = "Misleading"
            confidence = int(confidence * 0.8)

        # Build Explanation
        explanation = best_match['metadata']['explanation']
        if len(results) > 1 and results[1]['similarity'] > 0.7:
            explanation += f" Additionally, {results[1]['metadata']['source_title']} supports this finding."

        return {
            "verdict": final_verdict,
            "confidence": confidence,
            "explanation": explanation,
            "sources": [
                {
                    "title": r['metadata']['source_title'],
                    "url": r['metadata']['url'],
                    "trust_score": r['metadata']['trust_score'],
                    "evidence_snippet": r['metadata']['evidence']
                } for r in results if r['similarity'] > 0.5
            ],
            "highlighted_claims": [best_match['text']]
        }

    def _unverified_response(self, text):
        return {
            "verdict": "Unverified",
            "confidence": 0,
            "explanation": "Our RAG engine could not find sufficiently similar evidence in our trusted database to confirm or debunk this claim. This may be a new or highly specific rumor that requires manual verification.",
            "sources": [],
            "highlighted_claims": [text]
        }
