import React from 'react';

const ConfidenceMeter = ({ score, color }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
      }}>
        <div style={{
          width: '65px',
          height: '65px',
          background: 'var(--background)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          {score}%
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>Confidence</div>
    </div>
  );
};

export default ConfidenceMeter;
