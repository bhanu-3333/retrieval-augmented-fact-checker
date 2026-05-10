import React from 'react';

const Navbar = () => {
  return (
    <nav style={{
      padding: '20px 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
        <span className="gradient-text">FAKE</span>SCAN AI
      </div>
      <div style={{ display: 'flex', gap: '30px' }}>
        <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Database</a>
        <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>About</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
