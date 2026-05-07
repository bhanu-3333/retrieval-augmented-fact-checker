import os
from tavily import TavilyClient
from dotenv import load_dotenv
from .embeddings import Embedder
from .vector_store import VectorStore

load_dotenv()

class TavilyRetriever:
    def __init__(self):
        api_key = os.getenv("TAVILY_API_KEY")
        if api_key == "your_tavily_api_key_here" or not api_key:
            print("WARNING: Tavily API key not set. Live search will fail.")
            self.client = None
        else:
            self.client = TavilyClient(api_key=api_key)
        
        self.embedder = Embedder()

    def search_and_index(self, query):
        if not self.client:
            return []
            
        print(f"Searching Tavily for: {query}")
        # Search for trusted sources
        # We include "fact check" in the search to bias towards evidence
        search_query = f"{query} fact check reuters ap news snopes"
        response = self.client.search(query=search_query, search_depth="advanced", max_results=5)
        
        results = response.get('results', [])
        if not results:
            return []
            
        # Index results into a temporary FAISS store for semantic retrieval
        texts = [r['content'] for r in results]
        embeddings = self.embedder.get_embeddings(texts)
        
        vector_store = VectorStore(embeddings.shape[1])
        vector_store.add_texts(texts, embeddings, results)
        
        # Now retrieve the most semantically relevant snippets for the original query
        semantic_results = vector_store.search(self.embedder.get_embeddings([query])[0], k=5)
        
        return semantic_results
