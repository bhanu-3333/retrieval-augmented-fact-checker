import React from 'react';

const Hero = () => {
  return (
    <header style={{
      textAlign: 'center',
      padding: '120px 20px 40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', lineHeight: '1.2' }}>
        AI-Powered <span className="gradient-text">Fake News</span> Detection
      </h1>
      <p style={{ color: '#aaa', fontSize: '1.2rem', lineHeight: '1.6' }}>
        Unmask misinformation with our advanced RAG-based verification system. 
        Analyze claims against trusted evidence sources in real-time.
      </p>
    </header>
  );
};

export default Hero;
