import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import RouletteWheel from './RouletteWheel';
import './RouletteContainer.css';
import './RouletteContainer-mobile.css';

const RouletteContainer = forwardRef(({ onWin, onOpenCase, onSpinningChange, onRouletteShowingChange }, ref) => {
  const { currentUser, updateUserBalance, setIsLoginModalOpen } = useUser();
  const [isSpinning, setIsSpinning] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const [winningRarities, setWinningRarities] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 456);

  const rarityValues = { common: 0.1, rare: 0.5, unique: 1, legendary: 10, mythic: 25 };
  const rarities = ['common', 'rare', 'unique', 'legendary', 'mythic'];
  const rarityWeights = [0.40, 0.30, 0.15, 0.10, 0.05]; // веса вероятности

  // Отслеживаем изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 456;
      setIsMobile(mobile);
      // На мобильных устройствах tooltip всегда видим
      if (mobile) {
        setShowTooltip(true);
      }
    };

    window.addEventListener('resize', handleResize);
    // Устанавливаем начальное состояние
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функция для выбора редкости по весам из доступных вариантов
  const selectRarityByWeights = (availableRarities, availableWeights) => {
    const normalizedWeights = availableWeights.map(w => w / availableWeights.reduce((sum, weight) => sum + weight, 0));

    const rand = Math.random();
    let cumulativeWeight = 0;

    for (let i = 0; i < availableRarities.length; i++) {
      cumulativeWeight += normalizedWeights[i];
      if (rand <= cumulativeWeight) {
        return availableRarities[i];
      }
    }

    return availableRarities[0];
  };

  const handleOpenCase = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    const caseCost = 10 * selectedMultiplier;
    if (currentUser.balance < caseCost) {
      alert('Insufficient funds to open the case!');
      return;
    }

    updateUserBalance(-caseCost);

    // Выбираем выигрышные редкости для каждой рулетки
    const selectedRarities = [];

    for (let i = 0; i < selectedMultiplier; i++) {
      const selectedRarity = selectRarityByWeights(rarities, rarityWeights);
      selectedRarities.push(selectedRarity);
    }

    setWinningRarities(selectedRarities);
    setShowRoulette(true);
    setIsSpinning(true);
    onSpinningChange(true);
    
    // Уведомляем родительский компонент о показе рулетки
    if (onRouletteShowingChange) {
      onRouletteShowingChange(true);
    }

    // Через 5 секунд (анимация рулетки) останавливаем спин и выдаём выигрыш
    setTimeout(() => {
      setIsSpinning(false);
      onSpinningChange(false);

      // Суммируем выигрыши всех рулеток
      const winAmount = selectedRarities.reduce((sum, rarity) => {
        return sum + rarityValues[rarity];
      }, 0);

      updateUserBalance(winAmount);
      onWin(winAmount);
    }, 5000);
  };

  const handleReset = () => {
    setShowRoulette(false);
    setIsSpinning(false);
    setSelectedMultiplier(1);
    setWinningRarities([]);
    onSpinningChange(false);
    
    // Уведомляем родительский компонент о скрытии рулетки
    if (onRouletteShowingChange) {
      onRouletteShowingChange(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleReset
  }));

  if (showRoulette) {
    return (
      <div className="roulette-container px-3 md:px-6">
        <div className={`multiple-roulettes multiplier-${selectedMultiplier}`}>
          {Array.from({ length: selectedMultiplier }, (_, index) => (
            <div key={index} className="single-roulette-wrapper">
              <RouletteWheel
                isSpinning={isSpinning}
                winningRarity={winningRarities[index]}
              />
              <div className="roulette-pointer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="roulette-container px-3 md:px-6">
      <div className="case-display">
        <img src="/OPENCASE.png" alt="OPENCASE" className="case-title" />
        <img src="/Box.png" alt="Case" className="case-image" />

        <div className="controls-section">
          {[1, 2, 3, 4, 5].map(multiplier => (
            <button
              key={multiplier}
              className={`multiplier-btn ${selectedMultiplier === multiplier ? 'active' : ''}`}
              onClick={() => setSelectedMultiplier(multiplier)}
            >
              x{multiplier}
            </button>
          ))}

          <div className="open-btn-container">
            <div 
              className="open-btn-wrapper"
              onMouseEnter={() => !isMobile && setShowTooltip(true)}
              onMouseLeave={() => !isMobile && setShowTooltip(false)}
            >
              {showTooltip && (
                <div className="custom-tooltip">
                  {currentUser ? (
                    <>
                      <span className="tooltip-label">Cost:</span>
                      <span className="tooltip-amount">{10 * selectedMultiplier}</span>
                      <span className="tooltip-currency">coins</span>
                    </>
                  ) : (
                    <span className="tooltip-signin">Sign in to see cost</span>
                  )}
                </div>
              )}
              <button
                className="open-btn"
                onClick={handleOpenCase}
                disabled={currentUser && currentUser.balance < (10 * selectedMultiplier)}
              >
                {currentUser ? 'OPEN' : 'SIGN IN TO PLAY'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RouletteContainer;