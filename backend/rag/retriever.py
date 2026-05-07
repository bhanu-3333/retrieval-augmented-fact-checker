import json
import os
from .embeddings import Embedder
from .vector_store import VectorStore

class Retriever:
    def __init__(self, data_path='backend/data/trusted_sources.json'):
        self.embedder = Embedder()
        self.vector_store = None
        self.load_data(data_path)

    def load_data(self, data_path):
        if not os.path.exists(data_path):
            return
            
        with open(data_path, 'r') as f:
            data = json.load(f)
            
        claims = [item['claim'] for item in data]
        embeddings = self.embedder.get_embeddings(claims)
        
        if self.vector_store is None:
            self.vector_store = VectorStore(embeddings.shape[1])
            
        self.vector_store.add_texts(claims, embeddings, data)

    def retrieve(self, query, k=5):
        if self.vector_store is None:
            return []
        query_embedding = self.embedder.get_embeddings([query])[0]
        return self.vector_store.search(query_embedding, k)
