import React from 'react';

const ConfidenceMeter = ({ score, color }) => {
  const getLabel = (s) => {
    if (s >= 80) return "High";
    if (s >= 50) return "Med";
    return "Low";
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{
        position: 'relative',
        width: '90px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
        boxShadow: `0 0 20px ${color}33`,
        transition: 'all 0.5s ease'
      }}>
        <div style={{
          width: '74px',
          height: '74px',
          background: '#000000',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{getLabel(score)}</span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
