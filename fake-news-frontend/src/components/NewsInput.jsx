import React, { useState } from 'react';

const NewsInput = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze(text);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      maxWidth: '850px',
      margin: '0 auto 40px',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {isLoading && <div className="scanning-line" />}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <textarea
            placeholder="Paste a news headline, tweet, or article snippet..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: '100%',
              height: '180px',
              padding: '20px',
              fontSize: '1.1rem',
              resize: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div className="pulse" style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--primary)'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--primary)'
                }} />
              </div>
              <span style={{ 
                color: 'var(--primary)', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.8rem'
              }}>
                Analyzing Sources...
              </span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            type="submit" 
            className="glow-btn"
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? 'Verifying Claim...' : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Analyze News
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsInput;

