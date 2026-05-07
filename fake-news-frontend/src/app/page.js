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
      setError('Failed to connect to the analysis server. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      <Hero />
      
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <NewsInput onAnalyze={handleAnalyze} isLoading={loading} />

        {loading && <LoadingState />}

        {error && (
          <div className="glass-card" style={{ 
            padding: '20px', 
            color: 'var(--fake-color)', 
            textAlign: 'center',
            maxWidth: '800px',
            margin: '20px auto',
            border: '1px solid var(--fake-color)'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div className="animate-fade-in">
            <ResultCard result={result} />
            
            <div style={{ maxWidth: '800px', margin: '40px auto 20px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Evidence Sources</h3>
              {result.sources.length > 0 ? (
                result.sources.map((source, idx) => (
                  <SourceCard key={idx} source={source} />
                ))
              ) : (
                <p style={{ color: '#aaa' }}>No specific evidence sources matched this query.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '50px 20px', 
        color: '#555',
        fontSize: '0.9rem',
        marginTop: '100px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        © 2026 FakeScan AI - Advanced Fact Checking System
      </footer>
    </main>
  );
}
