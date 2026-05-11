'use client';

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
      overflow: 'hidden',
      borderRadius: '4px',
      border: '1px solid rgba(0,0,0,0.08)'
    }}>
      {isLoading && <div className="scanning-line" style={{ background: 'var(--accent-purple)' }} />}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '32px', position: 'relative' }}>
          <textarea
            placeholder="Paste a news headline, tweet, or article snippet..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: '100%',
              height: '200px',
              padding: '24px',
              fontSize: '1.1rem',
              resize: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(0,0,0,0.01)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '2px',
              color: 'var(--foreground)',
              fontFamily: 'inherit'
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
               <div style={{
                 width: '50px',
                 height: '50px',
                 borderRadius: '50%',
                 border: '2px solid var(--accent-purple)',
                 borderTopColor: 'transparent',
                 animation: 'spin 1s linear infinite'
               }}></div>
               <span style={{ 
                 color: 'var(--accent-purple)', 
                 fontWeight: '700',
                 textTransform: 'uppercase',
                 letterSpacing: '0.1em',
                 fontSize: '0.7rem'
               }}>
                 SYNTHESIZING...
               </span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            type="submit" 
            className="premium-btn"
            disabled={isLoading || !text.trim()}
            style={{ 
              width: '100%', 
              justifyContent: 'center',
              background: isLoading ? 'rgba(0,0,0,0.1)' : 'var(--foreground)',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing Neural Data...' : (
              <>
                Analyze Claim
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewsInput;
