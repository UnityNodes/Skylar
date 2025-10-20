import React, { useState, useEffect } from 'react';
import './RewardsSection.css';

const RewardsSection = ({ isHidden = false }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 456);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 456);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rarityData = [
    { image: '/common.png', text: '0.1 $LINA' },
    { image: '/rare.png', text: '0.5 $LINA' },
    { image: '/unique.png', text: '1 $LINA' },
    { image: '/legendary.png', text: '10 $LINA' },
    { image: '/mythic.png', text: '25 $LINA' }
  ];

  // Скрываем компонент только на мобильных устройствах если isHidden = true
  if (isHidden && isMobile) {
    return null;
  }

  return (
    <div className="rewards-section">
      <h2 className="rewards-title">Possible Rewards</h2>
      <div className="rewards-images">
        {rarityData.map((item, index) => (
          <div key={index} className="rarity-item">
            <img 
              src={item.image} 
              alt={`Rarity ${index + 1}`} 
              className="rarity-image" 
            />
            <div className="rarity-text">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsSection;