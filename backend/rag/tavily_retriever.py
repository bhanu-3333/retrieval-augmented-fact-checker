import os
import asyncio
from tavily import TavilyClient
from dotenv import load_dotenv
from .embeddings import Embedder
from .vector_store import VectorStore

load_dotenv()

class TavilyRetriever:
    """
    Handles live web retrieval using the Tavily API.
    Optimized for speed: limits results and uses async processing.
    """
    def __init__(self):
        api_key = os.getenv("TAVILY_API_KEY")
        if api_key == "your_tavily_api_key_here" or not api_key:
            print("WARNING: Tavily API key not set. Live search will fail.")
            self.client = None
        else:
            self.client = TavilyClient(api_key=api_key)
        
        self.embedder = Embedder()

    async def search_and_index(self, query):
        if not self.client:
            return []
            
        print(f"Searching Tavily for: {query}")
        
        # Optimized: Limit to top trusted domains
        trusted_sources = [
            "reuters.com", "apnews.com", "bbc.com", "snopes.com", 
            "factcheck.org", "nytimes.com", "theguardian.com"
        ]
        
        try:
            # Run synchronous Tavily calls in a thread to avoid blocking the event loop
            def fetch_tavily():
                # Optimization 1: Fetch only top 3 trusted articles
                return self.client.search(
                    query=query, 
                    search_depth="advanced", 
                    max_results=3,
                    include_domains=trusted_sources
                )

            response = await asyncio.to_thread(fetch_tavily)
            results = response.get('results', [])
            
            # Optimization: If no trusted results, do one quick general search
            if not results:
                def fetch_general():
                    return self.client.search(
                        query=f"{query} fact check", 
                        search_depth="basic", 
                        max_results=2
                    )
                general_response = await asyncio.to_thread(fetch_general)
                results = general_response.get('results', [])

            if not results:
                return []
                
            # Optimization 6: Reduce embedding workload by using only title + snippet (content[:200])
            # Instead of the entire article content
            texts = [f"{r['title']} {r['content'][:200]}" for r in results]
            
            # Run embedding in a thread
            embeddings = await asyncio.to_thread(self.embedder.get_embeddings, texts)
            
            vector_store = VectorStore(embeddings.shape[1])
            vector_store.add_texts(texts, embeddings, results)
            
            # Optimization 9: Search only top relevant vectors
            query_embedding = await asyncio.to_thread(self.embedder.get_embeddings, [query])
            semantic_results = vector_store.search(query_embedding[0], k=3)
            
            return semantic_results
        except Exception as e:
            print(f"Tavily search error: {e}")
            return []

