import React from 'react';

const SourceCard = ({ source }) => {
  const isHighTrust = source.trust_score >= 90;
  
  return (
    <div className="glass-card source-card-premium" style={{
      padding: '20px',
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      borderLeft: `4px solid ${isHighTrust ? 'var(--real-color)' : 'var(--secondary)'}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '1.2rem', 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {source.title}
            {isHighTrust && (
              <span title="Verified Trusted Source" style={{ fontSize: '1rem' }}>✅</span>
            )}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '2px' }}>
            {new URL(source.url).hostname}
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: isHighTrust ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)',
            color: isHighTrust ? 'var(--real-color)' : 'var(--secondary)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            border: `1px solid ${isHighTrust ? 'var(--real-color)' : 'var(--secondary)'}`,
            display: 'inline-block'
          }}>
            {isHighTrust ? 'HIGH TRUST' : 'MEDIUM TRUST'} ({source.trust_score}%)
          </div>
        </div>
      </div>

      <div style={{ 
        fontSize: '0.95rem', 
        color: '#ccc', 
        lineHeight: '1.5',
        background: 'rgba(255,255,255,0.03)',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        "{source.summary}"
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="visit-button"
          style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background 0.2s ease'
          }}
        >
          View Full Article →
        </a>
      </div>

      <style jsx>{`
        .source-card-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .visit-button:hover {
          background: #4f46e5;
        }
      `}</style>
    </div>
  );
};

export default SourceCard;
