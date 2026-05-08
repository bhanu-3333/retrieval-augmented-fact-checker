import json
import os
from .embeddings import Embedder
from .vector_store import VectorStore

class LocalRetriever:
    def __init__(self, data_path=None):
        if data_path is None:
            # Try to find the file relative to this script
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, 'data', 'trusted_sources.json')
            
        self.embedder = Embedder()
        self.vector_store = None
        self.load_data(data_path)

    def load_data(self, data_path):
        if not os.path.exists(data_path):
            print(f"Warning: Local data path {data_path} not found.")
            return
            
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        claims = [item['claim'] for item in data]
        embeddings = self.embedder.get_embeddings(claims)
        
        if self.vector_store is None:
            self.vector_store = VectorStore(embeddings.shape[1])
            
        # Reformat local data to match Tavily result structure for the LLM
        formatted_metadata = []
        for item in data:
            formatted_metadata.append({
                "title": item.get("source_title", "Local Database"),
                "url": item.get("url", "#"),
                "content": f"Verdict: {item['verdict']}. Explanation: {item['explanation']} Evidence: {item['evidence']}"
            })
            
        self.vector_store.add_texts(claims, embeddings, formatted_metadata)

    def retrieve(self, query, k=5):
        if self.vector_store is None:
            return []
        query_embedding = self.embedder.get_embeddings([query])[0]
        return self.vector_store.search(query_embedding, k)
