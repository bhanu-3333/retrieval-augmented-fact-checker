'use client';

import React from 'react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <div className="glass-card" style={{ 
    padding: '40px', 
    flex: '1 1 300px', 
    animation: `fadeInUp 0.8s ease forwards ${delay}s`,
    opacity: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      background: 'rgba(16, 185, 129, 0.1)', 
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
      border: '1px solid var(--glass-border)'
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>{title}</h3>
    <p style={{ color: 'rgba(232, 243, 239, 0.5)', lineHeight: '1.6', fontSize: '1rem' }}>
      {description}
    </p>
  </div>
);

const LandingFeatures = () => {
  return (
    <section style={{ padding: '100px 5%', background: 'var(--background)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', marginBottom: '20px', color: 'var(--foreground)' }}>
            Advanced <span className="gradient-text">Verification</span> Technology
          </h2>
          <p style={{ color: 'rgba(232, 243, 239, 0.4)', maxWidth: '600px', margin: '0 auto' }}>
            Powered by state-of-the-art Large Language Models and real-time retrieval systems.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <FeatureCard 
            delay={0.1}
            title="Semantic Analysis"
            description="Deep neural understanding of context and intent to identify subtle misinformation patterns."
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            )}
          />
          <FeatureCard 
            delay={0.2}
            title="Real-time Retrieval"
            description="Our RAG engine scans thousands of trusted sources instantly to cross-reference claims."
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          />
          <FeatureCard 
            delay={0.3}
            title="Evidence Synthesis"
            description="We don't just give a score; we provide the evidence and reasoning behind every verdict."
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            )}
          />
        </div>

        <div style={{ 
          marginTop: '120px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '60px', 
          flexWrap: 'wrap',
          background: 'rgba(16, 185, 129, 0.02)',
          padding: '60px',
          borderRadius: '40px',
          border: '1px solid var(--glass-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ flex: '1 1 400px', zIndex: 1 }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '24px', color: 'var(--foreground)' }}>
              How it works
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {[
                { step: '01', title: 'Claim Input', desc: 'Paste any news article, tweet, or statement into the analyzer.' },
                { step: '02', title: 'Knowledge Retrieval', desc: 'AI queries live web data and verified databases for context.' },
                { step: '03', title: 'Neural Reasoning', desc: 'Semantic engines evaluate consistency and logical fallacies.' },
                { step: '04', title: 'Verdict Report', desc: 'Receive a detailed breakdown with confidence scores and sources.' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '20px' }}>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '800', 
                    color: 'rgba(16, 185, 129, 0.2)',
                    paddingTop: '5px',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>{item.step}</span>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px', color: 'var(--foreground)' }}>{item.title}</h4>
                    <p style={{ color: 'rgba(232, 243, 239, 0.4)', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ 
            flex: '1 1 400px', 
            height: '400px', 
            background: 'rgba(10, 17, 15, 0.8)', 
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div className="scanning-line"></div>
            <div style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '0.85rem', 
              color: 'var(--primary)',
              opacity: 0.6,
              padding: '30px',
              lineHeight: '1.8'
            }}>
              {`> INITIALIZING_SCAN...\n> ACCESS_GRANTED\n> SOURCE_MAP_RETRIEVED\n> ANALYZING_VECTORS...\n> CONTRADICTION_FOUND_L12\n> VERDICT: MANIPULATED\n> CONFIDENCE: 0.942\n> SESSION_TERMINATED.`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
