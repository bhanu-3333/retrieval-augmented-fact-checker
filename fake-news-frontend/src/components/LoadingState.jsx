'use client';

import React, { useState, useEffect } from 'react';

const LoadingState = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Searching trusted sources...",
    "Retrieving verification snippets...",
    "Analyzing evidence...",
    "Detecting contradictory patterns...",
    "Generating final verdict..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200); // Faster transitions
    return () => clearInterval(interval);
  }, [steps.length]);


  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ position: 'relative', marginBottom: '60px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '50%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent-muted)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '2px solid var(--accent-purple)',
            borderRadius: '50%',
            borderTopColor: 'transparent',
            animation: 'spin 1.5s linear infinite'
          }} />
        </div>
      </div>
      
      <div style={{ 
        fontFamily: 'inherit',
        fontSize: '1.2rem', 
        color: 'var(--foreground)', 
        marginBottom: '24px', 
        fontWeight: '600',
        letterSpacing: '-0.02em'
      }}>
        {steps[step]}
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '2px', 
        background: 'rgba(0,0,0,0.05)', 
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{ 
          width: `${((step + 1) / steps.length) * 100}%`, 
          height: '100%', 
          background: 'var(--foreground)',
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }} />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        color: 'rgba(0,0,0,0.3)', 
        fontSize: '0.7rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        <span>RAG_STATUS: ACTIVE</span>
        <span>LATENCY: 124MS</span>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
