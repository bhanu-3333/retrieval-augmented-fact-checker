import faiss
import numpy as np

class VectorStore:
    def __init__(self, dimension):
        self.index = faiss.IndexFlatL2(dimension)
        self.data_map = {}

    def add_texts(self, texts, embeddings, metadata):
        embeddings = np.array(embeddings).astype('float32')
        start_idx = self.index.ntotal
        self.index.add(embeddings)
        for i, text in enumerate(texts):
            self.data_map[start_idx + i] = {
                "text": text,
                "metadata": metadata[i]
            }

    def search(self, query_embedding, k=3):
        query_embedding = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_embedding, k)
        results = []
        for idx in indices[0]:
            if idx in self.data_map:
                results.append(self.data_map[idx])
        return results
