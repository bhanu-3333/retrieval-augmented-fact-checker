import React, { useState, useEffect } from 'react';

const LoadingState = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Searching live web sources...",
    "Retrieving trusted evidence...",
    "Generating semantic embeddings...",
    "Analyzing similarity with FAISS...",
    "Ollama reasoning in progress...",
    "Generating final verdict..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div className="pulse" style={{
        width: '60px',
        height: '60px',
        border: '4px solid var(--primary)',
        borderRadius: '50%',
        margin: '0 auto 20px',
        borderTopColor: 'transparent'
      }} />
      <div style={{ fontSize: '1.2rem', color: '#aaa' }}>
        {steps[step]}
      </div>
    </div>
  );
};

export default LoadingState;
