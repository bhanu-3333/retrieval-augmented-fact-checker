import React from 'react';

const Hero = () => {
  return (
    <header style={{
      textAlign: 'center',
      padding: '120px 20px 60px',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{
        display: 'inline-block',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '6px 16px',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'var(--primary)',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '24px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Next-Gen Verification
      </div>
      <h1 style={{ 
        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
        marginBottom: '24px', 
        lineHeight: '1.1',
        fontWeight: '800',
        letterSpacing: '-1px'
      }}>
        Verify Truth with <br />
        <span className="gradient-text">FakeScan AI</span>
      </h1>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.6)', 
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
        lineHeight: '1.7',
        maxWidth: '650px',
        margin: '0 auto'
      }}>
        The world's most advanced RAG-powered fact-checker. 
        Detect misinformation, hoaxes, and AI-generated fabrications in seconds.
      </p>
    </header>
  );
};

export default Hero;

