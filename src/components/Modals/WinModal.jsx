import React, { useEffect, useState } from 'react';
import './WinModal.css';

const WinModal = ({ amount, onClose, onNewCase }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="win-modal" onClick={e => e.stopPropagation()}>
        <div className={`win-content ${showContent ? 'show' : ''}`}>

          
          <h2 className="win-title">
            <img src="/Skylar.png" alt="Skylar" className="win-icon" />
            <span className="win-you">You</span> <span className="win-text">win</span>
          </h2>
          
          <div className="win-amount">
            {Number(amount).toFixed(2).replace(/\.?0+$/, '')} <span className="win-currency">$LINA</span>
          </div>
          
          <button className="close-btn" onClick={() => {
            onClose();
            if (onNewCase) onNewCase();
          }}>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;