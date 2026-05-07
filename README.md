# 🛡️ FakeScan AI
### *Advanced RAG-Powered Misinformation Detection Engine*

---

## 📌 Problem Statement
In an era of information overload, misinformation spreads rapidly across digital platforms, making it increasingly difficult for users to distinguish between fact and fiction. Viral rumors often lack context, creating widespread confusion and eroding public trust in news sources. There is a critical need for an intelligent, automated system that can verify claims against trusted evidence in real-time.

---

## 💡 Solution
**FakeScan AI** is an end-to-end fact-checking platform that leverages **Retrieval-Augmented Generation (RAG)** to provide evidence-based verdicts.
- **Live Retrieval**: Dynamically searches the web for trusted articles and fact-checks using the Tavily API.
- **Semantic Analysis**: Uses `Sentence Transformers` and `FAISS` to semantically compare user claims against retrieved evidence.
- **AI Reasoning**: Utilizes `Ollama` for deep logical analysis to generate accurate verdicts: **Real**, **Fake**, or **Misleading**.
- **Traceable Evidence**: Provides clickable source links and evidence summaries for every analysis.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (Modern Dark/Glassmorphism UI)

### Backend
- **Framework**: FastAPI (Python)
- **Search API**: Tavily API

### AI & Retrieval
- **Reasoning**: Ollama (Llama 3 / Mistral)
- **Embeddings**: Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Vector DB**: FAISS

---

## 🚀 Running the Project

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

### 2. Frontend Setup
```bash
cd fake-news-frontend
npm install
npm run dev
```

---

## 📂 Folder Structure

```text
backend/                # FastAPI logic, RAG engine, and AI reasoning
fake_news_frontend/     # Next.js UI components and API integration
```

---

**built by bhanu 🤎**
