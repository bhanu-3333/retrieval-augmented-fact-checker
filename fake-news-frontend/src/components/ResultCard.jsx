'use client';

import React from 'react';
import ConfidenceMeter from './ConfidenceMeter';

const ResultCard = ({ result }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  
  React.useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + result.explanation.charAt(index));
      index++;
      if (index >= result.explanation.length) clearInterval(timer);
    }, 10);
    return () => clearInterval(timer);
  }, [result.explanation]);

  const getStatusColor = (verdict) => {
    switch (verdict.toLowerCase()) {
      case 'real': return 'var(--real)';
      case 'fake': return 'var(--fake)';
      case 'misleading': return 'var(--misleading)';
      default: return 'var(--foreground)';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict.toLowerCase()) {
      case 'real': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
      case 'fake': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
      default: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      maxWidth: '850px',
      margin: '0 auto 40px',
      padding: '50px',
      position: 'relative',
      borderRadius: '4px',
      borderLeft: `8px solid ${getStatusColor(result.verdict)}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            color: 'rgba(0,0,0,0.3)',
            marginBottom: '12px'
          }}>
            Analysis Verdict
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: getStatusColor(result.verdict) }}>
              {getVerdictIcon(result.verdict)}
            </div>
            <h2 className="editorial-text" style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              margin: 0, 
              color: getStatusColor(result.verdict)
            }}>
              {result.verdict}
            </h2>
          </div>
        </div>
        <ConfidenceMeter score={result.confidence} color={getStatusColor(result.verdict)} />
      </div>

      <div style={{ 
        marginBottom: '40px', 
        background: 'var(--accent-muted)', 
        padding: '30px', 
        borderRadius: '2px',
        border: '1px solid rgba(0,0,0,0.02)'
      }}>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: '800',
          color: 'rgba(0,0,0,0.2)', 
          marginBottom: '15px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Detailed Logic Breakdown
        </div>
        <p style={{ 
          lineHeight: '1.8', 
          fontSize: '1.15rem', 
          color: 'rgba(0,0,0,0.7)',
          fontWeight: '400'
        }}>
          {displayedText}
          <span style={{ 
            width: '6px', 
            height: '16px', 
            background: 'var(--accent-purple)', 
            display: 'inline-block', 
            marginLeft: '4px',
            animation: 'blink 1s infinite'
          }} />
        </p>
      </div>

      <div>
        <h3 style={{ 
          fontSize: '0.75rem', 
          color: 'rgba(0,0,0,0.3)', 
          marginBottom: '20px', 
          fontWeight: '800', 
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Extracted Claims
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {result.highlighted_claims.map((claim, idx) => (
            <span key={idx} style={{
              background: 'rgba(0,0,0,0.03)',
              padding: '10px 18px',
              borderRadius: '2px',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: '0.85rem',
              color: 'rgba(0,0,0,0.6)',
              fontWeight: '500'
            }}>
              {claim}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
