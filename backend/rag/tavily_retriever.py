import os
from tavily import TavilyClient
from dotenv import load_dotenv
from .embeddings import Embedder
from .vector_store import VectorStore

load_dotenv()

class TavilyRetriever:
    """
    Handles live web retrieval using the Tavily API.
    Prioritizes trusted sources and indexes results for semantic search.
    """
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
        
        # Define trusted sources to prioritize
        trusted_sources = [
            "reuters.com", "apnews.com", "bbc.com", "snopes.com", 
            "factcheck.org", "altnews.in", "boomlive.in", "who.int", 
            "nasa.gov", "un.org", "nytimes.com", "theguardian.com"
        ]
        
        # Craft a search query that biases towards these sources
        search_query = f"{query} site:({' OR site:'.join(trusted_sources)}) OR \"fact check\""
        
        try:
            # We search for the query itself + specialized check
            response = self.client.search(
                query=query, 
                search_depth="advanced", 
                max_results=10,
                include_domains=trusted_sources
            )
            
            # Also do a general search to ensure we don't miss anything if trusted sources are silent
            general_response = self.client.search(
                query=f"{query} fact check", 
                search_depth="basic", 
                max_results=5
            )
            
            results = response.get('results', []) + general_response.get('results', [])
            
            if not results:
                return []
                
            # Remove duplicates based on URL
            unique_results = []
            seen_urls = set()
            for r in results:
                if r['url'] not in seen_urls:
                    unique_results.append(r)
                    seen_urls.add(r['url'])
            
            # Index results into a temporary FAISS store for semantic retrieval
            texts = [f"{r['title']} {r['content']}" for r in unique_results]
            embeddings = self.embedder.get_embeddings(texts)
            
            vector_store = VectorStore(embeddings.shape[1])
            vector_store.add_texts(texts, embeddings, unique_results)
            
            # Now retrieve the most semantically relevant snippets for the original query
            # This ensures that even if we got 15 results, we only feed the most relevant to the LLM
            semantic_results = vector_store.search(self.embedder.get_embeddings([query])[0], k=6)
            
            return semantic_results
        except Exception as e:
            print(f"Tavily search error: {e}")
            return []
