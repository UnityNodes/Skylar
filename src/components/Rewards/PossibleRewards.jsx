import React from 'react';
import './PossibleRewards.css';

const PossibleRewards = ({ currentView }) => {
  const rarityData = [
    { image: '/common.png', text: '0.1 $LINA' },
    { image: '/rare.png', text: '0.5 $LINA' },
    { image: '/unique.png', text: '1 $LINA' },
    { image: '/legendary.png', text: '10 $LINA' },
    { image: '/mythic.png', text: '25 $LINA' }
  ];

  if (currentView === 'leaderboard') {
    return null;
  }

  return (
    <div className={`possible-rewards ${currentView === 'openCase' ? 'possible-rewards-open-case' : ''}`}>
      <h2 className="possible-rewards-title">
        <span>Possible</span>
        <span>Rewards</span>
      </h2>
      <div className="possible-rewards-images">
        {rarityData.map((item, index) => (
          <div key={index} className="possible-rewards-item">
            <img 
              src={item.image} 
              alt={`Rarity ${index + 1}`} 
              className="possible-rewards-image" 
            />
            <div className="possible-rewards-text">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PossibleRewards;