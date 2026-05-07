import React, { useState } from 'react';

const NewsInput = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      maxWidth: '800px',
      margin: '20px auto',
      padding: '30px'
    }}>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste news headline or article text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            height: '150px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'white',
            padding: '15px',
            fontSize: '1rem',
            marginBottom: '20px',
            resize: 'none',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            type="submit" 
            className={`glow-btn ${isLoading ? '' : 'pulse'}`}
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? 'Analyzing...' : 'Analyze News'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsInput;
