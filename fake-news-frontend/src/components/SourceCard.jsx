'use client';

import React from 'react';

const SourceCard = ({ source }) => {
  return (
    <div className="glass-card animate-fade-in" style={{
      padding: '30px',
      marginBottom: '20px',
      borderRadius: '4px',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--accent-muted)', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--foreground)',
            fontSize: '12px',
            fontWeight: '800'
          }}>
            {source.source ? source.source.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--foreground)' }}>
              {source.source || 'Unknown Source'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', fontWeight: '600' }}>
              RELIABILITY_INDEX: 0.92
            </span>
          </div>
        </div>
        <a href={source.url} target="_blank" rel="noopener noreferrer" style={{
          fontSize: '0.8rem',
          color: 'var(--accent-purple)',
          textDecoration: 'none',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          borderBottom: '1px solid var(--accent-purple)'
        }}>
          VIEW_SOURCE
        </a>
      </div>
      
      <p style={{ 
        fontSize: '0.95rem', 
        lineHeight: '1.6', 
        color: 'rgba(0,0,0,0.6)',
        padding: '20px',
        background: 'rgba(0,0,0,0.01)',
        borderRadius: '2px',
        borderLeft: '2px solid var(--accent-tan)'
      }}>
        "{source.snippet}"
      </p>
    </div>
  );
};

export default SourceCard;
