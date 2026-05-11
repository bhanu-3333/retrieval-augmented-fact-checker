'use client';

import React from 'react';

const Hero = () => {
  return (
    <header style={{
      textAlign: 'center',
      padding: '160px 20px 80px',
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div className="animate-fade-in">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--accent-muted)',
          padding: '8px 20px',
          borderRadius: '4px',
          border: '1px solid var(--glass-border)',
          color: 'var(--foreground)',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '32px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-purple)' }}></span>
          Neural Verification Engine
        </div>
        
        <h1 className="editorial-text" style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          marginBottom: '24px', 
          lineHeight: '1.1',
          fontWeight: '700',
          color: 'var(--foreground)'
        }}>
          Analyze <br />
          <span style={{ fontStyle: 'italic', opacity: 0.4 }}>digital</span> reality
        </h1>
        
        <p style={{ 
          color: 'rgba(0, 0, 0, 0.5)', 
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', 
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Input any claim or article below. Our RAG-powered engine will retrieve 
          context and perform semantic reasoning to verify its authenticity.
        </p>
      </div>
    </header>
  );
};

export default Hero;
