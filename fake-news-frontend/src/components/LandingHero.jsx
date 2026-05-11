'use client';

import React from 'react';
import Link from 'next/link';

const LandingHero = () => {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--background)'
    }}>
      {/* Background Shapes inspired by editorial style */}
      <div className="art-block art-tan animate-slow-float" style={{ 
        width: '280px', 
        height: '140px', 
        top: '15%', 
        right: '12%', 
        borderRadius: '4px',
        opacity: 0.6
      }}></div>
      
      <div className="art-block art-purple" style={{ 
        width: '60px', 
        height: '60px', 
        borderRadius: '50%', 
        top: '40%', 
        left: '42%',
        opacity: 0.8 
      }}></div>

      <div className="art-block art-black" style={{ 
        width: '120px', 
        height: '120px', 
        bottom: '10%', 
        right: '25%', 
        transform: 'rotate(-15deg)',
        opacity: 0.05
      }}></div>

      <div className="animate-fade-in" style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        
        <div style={{ flex: '1 1 600px', zIndex: 2 }}>
          <h1 className="editorial-text" style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', 
            fontWeight: '700', 
            color: 'var(--foreground)',
            marginBottom: '40px',
            maxWidth: '800px'
          }}>
            conduct <br />
            truth <span style={{ fontStyle: 'italic', opacity: 0.3 }}>→</span> <br />
            with intelligence
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(0, 0, 0, 0.6)',
            maxWidth: '500px',
            marginBottom: '48px',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Advanced RAG-powered verification engine. We retrieve trusted sources and analyze claims with neural precision.
          </p>
          
          <Link href="/detect" style={{ textDecoration: 'none' }}>
            <button className="premium-btn">
              Detect News
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </Link>
        </div>

        {/* Artistic Abstract Element Side */}
        <div style={{ 
          flex: '0 0 400px', 
          height: '500px', 
          position: 'relative',
          display: 'none',
          '@media (min-width: 1024px)': { display: 'block' }
        }} className="animate-fade-in">
          <div style={{
            width: '100%',
            height: '100%',
            background: 'var(--accent-muted)',
            borderRadius: '4px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{ 
               width: '40px', 
               height: '40px', 
               background: 'var(--accent-purple)', 
               borderRadius: '50%' 
             }}></div>
             
             <div style={{ alignSelf: 'flex-end' }}>
               <div style={{ 
                 width: '180px', 
                 height: '80px', 
                 background: 'var(--foreground)', 
                 borderRadius: '2px',
                 marginBottom: '15px',
                 opacity: 0.9,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 color: 'var(--background)',
                 fontFamily: 'JetBrains Mono, monospace',
                 fontSize: '0.8rem'
               }}>NEURAL_SYNC: 98%</div>
               <div style={{ 
                 width: '240px', 
                 height: '120px', 
                 background: 'var(--accent-tan)', 
                 borderRadius: '2px' 
               }}></div>
             </div>
             
             <div style={{
               position: 'absolute',
               top: '-20px',
               right: '-20px',
               width: '150px',
               height: '150px',
               border: '1px solid rgba(0,0,0,0.1)',
               borderRadius: '50%'
             }}></div>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Scroller */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        padding: '20px 0',
        borderTop: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div className="marquee-track">
          <div className="marquee-content">
            {['AI Verification', 'RAG Engine', 'Semantic Analysis', 'Neural Reasoning', 'Real-time Retrieval', 'Evidence Synthesis', 'Fact Checking', 'Source Intelligence', 'Misinformation Detection', 'Deep Learning'].map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '24px',
                marginRight: '60px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--foreground)',
                opacity: 0.5,
                whiteSpace: 'nowrap'
              }}>
                {item}
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--foreground)', opacity: 0.4, display: 'inline-block' }}></span>
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {['AI Verification', 'RAG Engine', 'Semantic Analysis', 'Neural Reasoning', 'Real-time Retrieval', 'Evidence Synthesis', 'Fact Checking', 'Source Intelligence', 'Misinformation Detection', 'Deep Learning'].map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '24px',
                marginRight: '60px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--foreground)',
                opacity: 0.5,
                whiteSpace: 'nowrap'
              }}>
                {item}
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--foreground)', opacity: 0.4, display: 'inline-block' }}></span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="flex: 0 0 400px"] {
            display: none !important;
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-content {
          display: flex;
          flex-shrink: 0;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LandingHero;
