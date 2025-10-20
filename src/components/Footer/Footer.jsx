import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span>© 2025 Skylar All rights reserved.</span>
      </div>
      <div className="footer-right">
        <span>Powered by <a href="https://twitter.com/unitynodes" target="_blank" rel="noopener noreferrer" className="unity-nodes-link">Unity Nodes</a></span>
      </div>
    </footer>
  );
};

export default Footer;