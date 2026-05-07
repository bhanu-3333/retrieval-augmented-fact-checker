import React from 'react';

const SourceCard = ({ source }) => {
  return (
    <div className="glass-card" style={{
      padding: '15px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{source.title}</div>
        <a href={source.url} target="_blank" rel="noopener noreferrer" style={{
          color: 'var(--secondary)',
          fontSize: '0.9rem',
          textDecoration: 'none'
        }}>
          {source.url}
        </a>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          background: 'rgba(14, 165, 233, 0.2)',
          color: 'var(--secondary)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          border: '1px solid var(--secondary)'
        }}>
          TRUST: {source.trust_score}%
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
