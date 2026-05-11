'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Detect News', href: '/detect' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav style={{
      padding: '40px 6%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1000,
      background: 'transparent',
    }}>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ 
            width: '28px', 
            height: '28px', 
            background: 'var(--foreground)', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--background)',
            fontSize: '14px',
            fontWeight: '800'
          }}>F</div>
          <span style={{ opacity: 0.9 }}>FAKESCAN AI</span>
        </div>
      </Link>

      <div style={{ 
        display: 'flex', 
        gap: '40px',
        alignItems: 'center'
      }}>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            style={{ 
              color: pathname === link.href ? 'var(--foreground)' : 'rgba(0, 0, 0, 0.5)', 
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: pathname === link.href ? '600' : '400',
              transition: 'all 0.3s ease',
              position: 'relative',
              paddingBottom: '4px'
            }}
            className="nav-link"
          >
            {link.name}
            {pathname === link.href && (
              <span style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: '1.5px',
                background: 'var(--foreground)',
                borderRadius: '2px'
              }} />
            )}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .nav-link:hover {
          color: var(--foreground) !important;
          opacity: 1;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
