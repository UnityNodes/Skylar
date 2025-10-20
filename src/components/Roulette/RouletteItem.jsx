import React from 'react';
import './RouletteItem.css';

const RouletteItem = ({ rarity, color, bgColor, coins }) => {
  const getImagePath = (rarity) => {
    switch (rarity) {
      case 'common':
        return '/common.png';
      case 'rare':
        return '/rare.png';
      case 'unique':
        return '/unique.png';
      case 'legendary':
        return '/legendary.png';
      case 'mythic':
        return '/mythic.png';
      default:
        return '/common.png';
    }
  };

  return (
    <div className="roulette-item">
      <div className="item-content">
        <img
          src={getImagePath(rarity)}
          alt={rarity}
          className="rarity-image"
        />
      </div>
    </div>
  );
};

export default RouletteItem;