import React, { useState, useEffect, useRef } from 'react';
import RouletteItem from './RouletteItem';
import './RouletteWheel.css';

const raritiesData = [
  { type: 'common', color: '#6b5b73', bgColor: 'linear-gradient(135deg, #6b5b73, #4a4a4a)', coins: 0.1 },
  { type: 'rare', color: '#4169e1', bgColor: 'linear-gradient(135deg, #4169e1, #1e3a8a)', coins: 0.5 },
  { type: 'unique', color: '#00bcd4', bgColor: 'linear-gradient(135deg, #00bcd4, #0097a7)', coins: 1 },
  { type: 'legendary', color: '#8a2be2', bgColor: 'linear-gradient(135deg, #8a2be2, #6a1b9a)', coins: 10 },
  { type: 'mythic', color: '#dc2626', bgColor: 'linear-gradient(135deg, #dc2626, #991b1b)', coins: 25 }
];

const RouletteWheel = ({ isSpinning, winningRarity }) => {
  const [items, setItems] = useState([]);
  const [position, setPosition] = useState(0);
  const itemWidth = 128;
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const generateRouletteItems = () => {
      const items = [];

      // Генерируем 49 случайных элементов
      for (let i = 0; i < 49; i++) {
        const randIndex = Math.floor(Math.random() * raritiesData.length);
        const rarity = raritiesData[randIndex];
        items.push({
          id: `item-${i}`,
          rarity: rarity.type,
          color: rarity.color,
          bgColor: rarity.bgColor,
          coins: rarity.coins
        });
      }

      // Добавляем выигрышный элемент в конец
      const winningItem = raritiesData.find(r => r.type === winningRarity) || raritiesData[0];
      items.push({
        id: 'winning-item',
        rarity: winningItem.type,
        color: winningItem.color,
        bgColor: winningItem.bgColor,
        coins: winningItem.coins
      });

      // 50 случайных элементов после выигрышного
      for (let i = 0; i < 50; i++) {
        const randIndex = Math.floor(Math.random() * raritiesData.length);
        const rarity = raritiesData[randIndex];
        items.push({
          id: `extra-item-${i}`,
          rarity: rarity.type,
          color: rarity.color,
          bgColor: rarity.bgColor,
          coins: rarity.coins
        });
      }

      return items;
    };

    const generatedItems = generateRouletteItems();
    setItems(generatedItems);

    if (isSpinning) {
      const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
      const targetIndex = 49; // 50-й элемент с 0 индексацией
      
      // Разные настройки для мобильной и компьютерной версии
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile 
        ? targetIndex * itemWidth - (containerWidth / 0.70) + (itemWidth / 0.70) // Мобильная версия
        : targetIndex * itemWidth - (containerWidth / 1.3) + (itemWidth / 1.3); // Компьютерная версия

      setTimeout(() => {
        setPosition(offset);
      }, 100);
    } else {
      setPosition(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isSpinning, winningRarity]);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      // Можно вызвать коллбэк или другую логику по окончании анимации
    };

    trackEl.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      trackEl.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);

  return (
    <div className="roulette-wheel" ref={containerRef}>
      <div
        ref={trackRef}
        className="roulette-track"
        style={{
          transform: `translateX(-${position}px)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
        }}
      >
        {items.map(item => (
          <RouletteItem
            key={item.id}
            rarity={item.rarity}
            color={item.color}
            bgColor={item.bgColor}
            coins={item.coins}
          />
        ))}
      </div>
    </div>
  );
};

export default RouletteWheel;