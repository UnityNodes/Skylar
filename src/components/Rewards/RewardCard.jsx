import React from 'react';
import './RewardCard.css';

const RewardCard = ({ amount, currency, rarity }) => {
  const getRarityColor = () => {
    switch (rarity) {
      case 'common':
        return '#4a4a4a';
      case 'rare':
        return '#4169e1';
      case 'epic':
        return '#8a2be2';
      case 'legendary':
        return '#ff6b35';
      case 'mythic':
        return '#ff1744';
      default:
        return '#4a4a4a';
    }
  };

  const getRarityIcon = () => {
    switch (rarity) {
      case 'rare':
        return '/rare.png';
      case 'epic':
        return '/rare.png';
      case 'legendary':
        return '/legendary.png';
      case 'mythic':
        return '/mythic.png';
      default:
        return '/common.png';
    }
  };

  return (
    <div className="reward-card" style={{ borderColor: getRarityColor() }}>
      <div className="reward-background" style={{ backgroundColor: `${getRarityColor()}20` }}>
        <img src={getRarityIcon()} alt="Reward" className="reward-icon" />
      </div>
      <div className="reward-info">
        <span className="reward-amount">{amount}</span>
        <span className="reward-currency">{currency}</span>
      </div>
    </div>
  );
};

export default RewardCard;