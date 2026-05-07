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
    }, 20);
    return () => clearInterval(timer);
  }, [result.explanation]);

  const getVerdictColor = (verdict) => {
    switch (verdict.toLowerCase()) {
      case 'real': return 'var(--real-color)';
      case 'fake': return 'var(--fake-color)';
      case 'misleading': return 'var(--misleading-color)';
      default: return '#fff';
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      maxWidth: '800px',
      margin: '20px auto',
      padding: '30px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Verdict: 
          <span style={{ color: getVerdictColor(result.verdict), marginLeft: '10px' }}>
            {result.verdict}
          </span>
        </h2>
        <ConfidenceMeter score={result.confidence} color={getVerdictColor(result.verdict)} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '10px' }}>Explanation:</h3>
        <p style={{ lineHeight: '1.6', fontSize: '1.1rem', minHeight: '80px' }}>{displayedText}</p>
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '10px' }}>Highlighted Claims:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {result.highlighted_claims.map((claim, idx) => (
            <span key={idx} style={{
              background: `rgba(${result.verdict === 'Fake' ? '239, 68, 68' : '16, 185, 129'}, 0.2)`,
              padding: '5px 12px',
              borderRadius: '20px',
              border: `1px solid ${getVerdictColor(result.verdict)}`,
              fontSize: '0.9rem'
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
