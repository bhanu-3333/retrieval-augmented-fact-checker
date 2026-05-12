'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import LandingHero from '../components/LandingHero';

/**
 * Home component serving as the landing page for FakeScan AI.
 * Displays the navigation and the hero section with a premium aesthetic.
 */
export default function Home() {
  return (
    <main style={{ 
      height: '100vh', 
      overflow: 'hidden', 
      background: 'var(--background)',
      position: 'relative'
    }}>
      <Navbar />
      <LandingHero />
      
      {/* Subtle background noise texture if desired, but keeping it minimal as requested */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        zIndex: 10000
      }}></div>
    </main>
  );
}
