'use client';

import React from 'react';

const SourceCard = ({ source }) => {
  const name = source.source || source.title || 'Unknown';
  const snippet = source.snippet || source.summary || '';
  const trust = source.trust_score || 0;

  const getSourceBadge = (source) => {
    const url = (source.url || '').toLowerCase();
    const name = (source.source || '').toLowerCase();
    const score = source.trust_score || 0;

    if (url.includes('.gov') || name.includes('who') || name.includes('united nations') || name.includes('nasa')) {
      return { text: 'Official Source', color: '#1a365d' };
    }
    if (name.includes('snopes') || name.includes('factcheck') || name.includes('politifact') || name.includes('alt news')) {
      return { text: 'Fact Check', color: '#166534' };
    }
    if (name.includes('reuters') || name.includes('ap news') || name.includes('bbc') || name.includes('times') || name.includes('guardian')) {
      return { text: 'News Article', color: '#374151' };
    }
    if (score >= 80) {
      return { text: 'Trusted Source', color: '#2d5a27' };
    }
    return { text: 'Reference', color: '#4b5563' };
  };

  const badge = getSourceBadge(source);

  return (
    <div className="glass-card animate-fade-in" style={{
      padding: '28px',
      marginBottom: '16px',
      borderRadius: '4px',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            background: 'var(--accent-muted)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--foreground)', fontSize: '13px', fontWeight: '800'
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--foreground)', marginBottom: '2px' }}>
              {name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em',
                color: badge.color, background: `${badge.color}10`, padding: '2px 8px', borderRadius: '4px'
              }}>
                {badge.text}
              </span>
            </div>
          </div>
        </div>


        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer" style={{
            fontSize: '0.72rem', color: 'var(--accent-purple)',
            textDecoration: 'none', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            borderBottom: '1px solid var(--accent-purple)',
            flexShrink: 0
          }}>
            View Source
          </a>
        )}
      </div>

      {/* Title if different from source name */}
      {source.title && source.title !== name && (
        <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--foreground)', lineHeight: '1.35' }}>
          {source.title}
        </p>
      )}
      
      {/* Snippet */}
      {snippet && (
        <p style={{ 
          fontSize: '0.88rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.55)',
          padding: '16px 18px', background: 'rgba(0,0,0,0.015)',
          borderRadius: '2px', borderLeft: '2px solid var(--accent-tan)'
        }}>
          {snippet}
        </p>
      )}
    </div>
  );
};

export default SourceCard;
