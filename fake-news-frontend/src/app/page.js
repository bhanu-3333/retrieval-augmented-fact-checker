'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NewsInput from '../components/NewsInput';
import LoadingState from '../components/LoadingState';
import ResultCard from '../components/ResultCard';
import SourceCard from '../components/SourceCard';
import { analyzeNews } from '../services/api';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (text) => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await analyzeNews(text);
      setResult(data);
    } catch (err) {
      setError('Connection Error: The AI analysis engine is currently offline. Please check if the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      <Hero />
      
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <NewsInput onAnalyze={handleAnalyze} isLoading={loading} />

        {loading && <LoadingState />}

        {error && (
          <div className="glass-card animate-fade-in" style={{ 
            padding: '24px', 
            color: 'var(--fake)', 
            textAlign: 'center',
            maxWidth: '850px',
            margin: '40px auto',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            background: 'rgba(244, 63, 94, 0.05)',
            fontWeight: '600'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <br />
            {error}
          </div>
        )}

        {result && (
          <div className="animate-fade-in">
            <ResultCard result={result} />
            
            <div style={{ maxWidth: '850px', margin: '60px auto 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Intelligence Feed</h3>
                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }} />
              </div>
              
              {result.sources.length > 0 ? (
                result.sources.map((source, idx) => (
                  <SourceCard key={idx} source={source} />
                ))
              ) : (
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  No specific evidence sources matched this query. Analysis based on general knowledge and available snippets.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        color: 'rgba(255,255,255,0.2)',
        fontSize: '0.85rem',
        marginTop: '120px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        © 2026 FakeScan AI • Neural Verification Engine • v2.0.4
      </footer>
    </main>
  );
}

