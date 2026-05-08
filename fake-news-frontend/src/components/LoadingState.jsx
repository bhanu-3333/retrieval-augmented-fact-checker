import React, { useState, useEffect } from 'react';

const LoadingState = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Searching live web sources...",
    "Retrieving trusted evidence...",
    "Generating semantic embeddings...",
    "Analyzing similarity with FAISS...",
    "Ollama reasoning in progress...",
    "Detecting contradictions...",
    "Generating final verdict..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="ai-thinking-container" style={{ position: 'relative', marginBottom: '40px' }}>
        <div className="pulse" style={{
          width: '80px',
          height: '80px',
          border: '4px solid var(--primary)',
          borderRadius: '50%',
          margin: '0 auto',
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5rem'
        }}>🧠</div>
      </div>
      
      <div style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '20px', fontWeight: '500' }}>
        {steps[step]}
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '6px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        <div style={{ 
          width: `${((step + 1) / steps.length) * 100}%`, 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          transition: 'width 0.5s ease'
        }} />
      </div>
      
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        Analyzing massive datasets and cross-referencing sources...
      </p>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
