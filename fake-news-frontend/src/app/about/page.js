'use client';

import React from 'react';
import Navbar from '../../components/Navbar';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '160px' }}>
      <Navbar />
      
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 100px' }}>
        <h1 className="editorial-text" style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
          fontWeight: '700', 
          marginBottom: '60px' 
        }}>
          About the <br />
          FakeScan <span style={{ fontStyle: 'italic', opacity: 0.3 }}>Platform</span>
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <section>
            <h2 style={{ fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', color: 'var(--accent-purple)' }}>
              01 / Core Mission
            </h2>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.7)' }}>
              FakeScan AI is a next-generation misinformation detection system designed to bring clarity to the digital noise. 
              In an era of synthetic media and rapid misinformation, we provide a neutral, evidence-based verification layer.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', color: 'var(--accent-tan)' }}>
              02 / Technology Stack
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.6)', marginBottom: '24px' }}>
              Our platform leverages the synergy between Retrieval-Augmented Generation (RAG) and Semantic Analysis:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Live Retrieval', desc: 'Queries trusted news sources and verified databases in real-time to gather context.' },
                { title: 'Neural Reasoning', desc: 'Uses advanced Large Language Models (LLMs) to analyze semantic patterns and logical inconsistencies.' },
                { title: 'Evidence Synthesis', desc: 'Cross-references retrieved snippets to build a comprehensive verification report.' }
              ].map((item, idx) => (
                <li key={idx} style={{ 
                  padding: '30px', 
                  background: 'var(--accent-muted)', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${idx % 2 === 0 ? 'var(--accent-purple)' : 'var(--accent-tan)'}`
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: 'rgba(0,0,0,0.5)', lineHeight: '1.6' }}>{item.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', color: 'var(--foreground)' }}>
              03 / The Verdict
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.6)' }}>
              Every analysis results in an evidence-backed score, identifying Real, Fake, or Misleading content with a clear reasoning log.
              We don't just tell you if it's true—we show you why.
            </p>
          </section>
        </div>
      </div>
      
      {/* Decorative background shape */}
      <div className="art-block art-tan" style={{ 
        width: '400px', 
        height: '400px', 
        top: '10%', 
        right: '-10%', 
        borderRadius: '50%',
        opacity: 0.05,
        filter: 'blur(40px)'
      }}></div>
    </main>
  );
}
