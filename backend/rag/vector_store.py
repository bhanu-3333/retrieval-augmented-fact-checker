import faiss
import numpy as np

class VectorStore:
    def __init__(self, dimension):
        # Use Inner Product for Cosine Similarity
        self.index = faiss.IndexFlatIP(dimension)
        self.data_map = {}

    def add_texts(self, texts, embeddings, metadata):
        embeddings = np.array(embeddings).astype('float32')
        # Normalize for cosine similarity
        faiss.normalize_L2(embeddings)
        start_idx = self.index.ntotal
        self.index.add(embeddings)
        for i, text in enumerate(texts):
            self.data_map[start_idx + i] = {
                "text": text,
                "metadata": metadata[i]
            }

    def search(self, query_embedding, k=5):
        query_embedding = np.array([query_embedding]).astype('float32')
        # Normalize for cosine similarity
        faiss.normalize_L2(query_embedding)
        distances, indices = self.index.search(query_embedding, k)
        results = []
        for i, idx in enumerate(indices[0]):
            if idx in self.data_map:
                item = self.data_map[idx].copy()
                item['similarity'] = float(distances[0][i])
                results.append(item)
        return results
