import React from 'react';

const SourceCard = ({ source }) => {
  const isHighTrust = source.trust_score >= 90;
  
  return (
    <div className="glass-card" style={{
      padding: '24px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: '700', 
            fontSize: '1.25rem', 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '6px'
          }}>
            {source.title}
            {isHighTrust && (
              <div style={{ color: 'var(--real)', display: 'flex' }} title="Verified Source">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 15 11"/>
                </svg>
              </div>
            )}
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--secondary)', 
            fontFamily: 'JetBrains Mono, monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {new URL(source.url).hostname.replace('www.', '')}
          </div>
        </div>
        
        <div style={{
          background: isHighTrust ? 'rgba(255, 255, 255, 0.1)' : 'rgba(161, 161, 170, 0.05)',
          color: isHighTrust ? '#ffffff' : '#a1a1aa',
          padding: '6px 14px',
          borderRadius: '10px',
          fontSize: '0.75rem',
          fontWeight: '800',
          letterSpacing: '1px',
          border: `1px solid ${isHighTrust ? 'rgba(255, 255, 255, 0.3)' : 'rgba(161, 161, 170, 0.2)'}`,
          whiteSpace: 'nowrap'
        }}>
          {isHighTrust ? 'VERIFIED SOURCE' : 'TRUSTED SOURCE'} {source.trust_score}%
        </div>
      </div>

      <div style={{ 
        fontSize: '1rem', 
        color: 'rgba(255, 255, 255, 0.7)', 
        lineHeight: '1.6',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        borderLeft: `2px solid ${isHighTrust ? '#ffffff' : '#52525b'}`
      }}>
        {source.summary}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            color: 'var(--primary)',
            fontSize: '0.9rem',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'gap 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.gap = '12px'}
          onMouseOut={(e) => e.currentTarget.style.gap = '8px'}
        >
          Intelligence Report <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>
    </div>
  );
};

export default SourceCard;

