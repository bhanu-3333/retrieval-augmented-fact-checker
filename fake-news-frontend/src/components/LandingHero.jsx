'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const claims = [
  { text: '"NASA confirms water found on Mars surface"', verdict: 'Real', confidence: 96, time: '2m ago' },
  { text: '"New study: coffee causes memory loss"', verdict: 'Fake', confidence: 89, time: '5m ago' },
  { text: '"EU bans all AI-generated content"', verdict: 'Misleading', confidence: 74, time: '8m ago' },
];

const LandingHero = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState(0);

  const phases = ['Retrieving sources...', 'Cross-referencing...', 'Analyzing semantics...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          setScanPhase(p => (p + 1) % phases.length);
          return 0;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [phases.length]);

  const getColor = (verdict) => {
    switch (verdict) {
      case 'Real': return '#2d5a27';
      case 'Fake': return '#8b0000';
      case 'Misleading': return '#b8860b';
      default: return '#1a1a1a';
    }
  };

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
      {/* Subtle background accents */}
      <div className="art-block art-tan animate-slow-float" style={{
        width: '200px', height: '100px', top: '12%', right: '8%',
        borderRadius: '4px', opacity: 0.35
      }}></div>
      <div className="art-block art-purple" style={{
        width: '45px', height: '45px', borderRadius: '50%',
        bottom: '28%', left: '40%', opacity: 0.4
      }}></div>

      {/* Main content */}
      <div className="animate-fade-in" style={{
        maxWidth: '1200px', width: '100%',
        display: 'flex', gap: '80px',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* LEFT */}
        <div style={{ flex: '1 1 500px', zIndex: 2 }}>
          <h1 className="editorial-text" style={{
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            fontWeight: '700',
            color: 'var(--foreground)',
            marginBottom: '36px',
            lineHeight: 1.05
          }}>
            conduct <br />
            truth <span style={{ fontStyle: 'italic', opacity: 0.3 }}>→</span> <br />
            with intelligence
          </h1>

          <p style={{
            fontSize: '1.15rem', color: 'rgba(0,0,0,0.55)',
            maxWidth: '460px', marginBottom: '48px',
            lineHeight: '1.65', fontWeight: '400'
          }}>
            Advanced RAG-powered verification engine. We retrieve trusted sources and analyze claims with neural precision.
          </p>

          <Link href="/detect" style={{ textDecoration: 'none' }}>
            <button className="premium-btn">
              Detect News
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </Link>
        </div>

        {/* RIGHT — Recent Verifications Feed */}
        <div className="hero-card" style={{ flex: '0 0 380px', position: 'relative', zIndex: 2 }}>

          {/* Tan offset layer */}
          <div style={{
            position: 'absolute', top: '10px', left: '10px', right: '-10px', bottom: '-10px',
            background: 'var(--accent-tan)', borderRadius: '4px', opacity: 0.4, zIndex: -1
          }}></div>

          <div style={{
            background: '#fff', borderRadius: '4px',
            border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden'
          }}>
            {/* Panel header */}
            <div style={{ padding: '28px 28px 0' }}>
              <p style={{ fontSize: '0.58rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.25)', marginBottom: '6px' }}>
                Recent Verifications
              </p>
            </div>

            {/* Currently scanning item */}
            <div style={{
              margin: '16px 28px', padding: '18px',
              background: 'var(--background)', borderRadius: '3px',
              border: '1px dashed rgba(0,0,0,0.1)', position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-purple)' }}>
                  Scanning Now
                </span>
                <span className="blink-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }}></span>
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--foreground)', lineHeight: '1.4', marginBottom: '14px' }}>
                "Global temperatures drop 2°C due to volcanic activity"
              </p>
              {/* Progress bar */}
              <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', marginBottom: '6px' }}>
                <div style={{
                  height: '100%', width: `${scanProgress}%`,
                  background: 'var(--accent-purple)', borderRadius: '2px',
                  transition: 'width 0.06s linear'
                }}></div>
              </div>
              <p style={{ fontSize: '0.6rem', color: 'rgba(0,0,0,0.35)', fontWeight: '600' }}>{phases[scanPhase]}</p>
            </div>

            {/* Completed claims */}
            <div style={{ padding: '0 28px 24px' }}>
              {claims.map((claim, i) => (
                <div key={i} style={{
                  padding: '16px 0',
                  borderTop: '1px solid rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--foreground)', lineHeight: '1.35' }}>
                    {claim.text}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.58rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: getColor(claim.verdict),
                        background: `${getColor(claim.verdict)}10`,
                        padding: '3px 8px', borderRadius: '2px'
                      }}>{claim.verdict}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'rgba(0,0,0,0.4)' }}>{claim.confidence}%</span>
                    </div>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(0,0,0,0.2)', fontWeight: '500' }}>{claim.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purple accent */}
          <div style={{
            position: 'absolute', top: '-16px', right: '-16px',
            width: '44px', height: '44px',
            background: 'var(--accent-purple)', borderRadius: '50%',
            opacity: 0.4, zIndex: -1
          }}></div>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        overflow: 'hidden', padding: '18px 0',
        borderTop: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div className="marquee-track">
          {[0, 1].map(dup => (
            <div className="marquee-content" key={dup} aria-hidden={dup === 1}>
              {['AI Verification', 'RAG Engine', 'Semantic Analysis', 'Neural Reasoning', 'Real-time Retrieval', 'Evidence Synthesis', 'Fact Checking', 'Source Intelligence', 'Misinformation Detection', 'Deep Learning'].map((item, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '24px',
                  marginRight: '60px', fontSize: '0.78rem', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  color: 'var(--foreground)', opacity: 0.4, whiteSpace: 'nowrap'
                }}>
                  {item}
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--foreground)', opacity: 0.4, display: 'inline-block' }}></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-card { display: none !important; }
        }
        .marquee-track {
          display: flex; width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-content { display: flex; flex-shrink: 0; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }
        .blink-dot { animation: blink 1.2s infinite; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </section>
  );
};

export default LandingHero;
