import React from 'react';
import './RewardsModal.css';

const RewardsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rewards = [
    { id: 1, image: '/0.1$LINA.png', text: '0.1$LINA', rarity: 'common' },
    { id: 2, image: '/0.5$LINA.png', text: '0.5$LINA', rarity: 'rare' },
    { id: 3, image: '/1$LINA.png', text: '1$LINA', rarity: 'unique' },
    { id: 4, image: '/10$LINA.png', text: '10$LINA', rarity: 'legendary' },
    { id: 5, image: '/25$LINA.png', text: '25$LINA', rarity: 'mythic' }
  ];

  return (
    <div className="rewards-modal-overlay" onClick={onClose}>
      <div className="rewards-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="rewards-modal-header">
          <h2 className="rewards-modal-title">Possible Rewards</h2>
          <button className="rewards-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="rewards-modal-body">
          <div className="rewards-modal-grid">
            {rewards.map((reward) => (
              <div key={reward.id} className={`reward-modal-item ${reward.rarity}`}>
                <img 
                  src={reward.image} 
                  alt={reward.text} 
                  className="reward-modal-image"
                />
                <span className="reward-modal-text">{reward.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;