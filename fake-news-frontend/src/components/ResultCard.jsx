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
    }, 15);
    return () => clearInterval(timer);
  }, [result.explanation]);

  const getStatusClass = (verdict) => {
    switch (verdict.toLowerCase()) {
      case 'real': return 'status-real';
      case 'fake': return 'status-fake';
      case 'misleading': return 'status-misleading';
      default: return '';
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
      padding: '40px',
      borderLeft: `6px solid var(--${result.verdict.toLowerCase()})`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '8px',
            display: 'block'
          }}>
            Analysis Verdict
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={getStatusClass(result.verdict)}>
              {getVerdictIcon(result.verdict)}
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }} className={getStatusClass(result.verdict)}>
              {result.verdict}
            </h2>
          </div>
        </div>
        <ConfidenceMeter score={result.confidence} color={`var(--${result.verdict.toLowerCase()})`} />
      </div>

      <div style={{ marginBottom: '35px', background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
          Detailed AI Explanation
        </h3>
        <p style={{ 
          lineHeight: '1.8', 
          fontSize: '1.15rem', 
          color: 'rgba(255,255,255,0.9)',
          fontWeight: '400'
        }}>
          {displayedText}
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '15px', fontWeight: '600', textTransform: 'uppercase' }}>
          Identified Key Claims
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {result.highlighted_claims.map((claim, idx) => (
            <span key={idx} style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '8px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              {claim}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

