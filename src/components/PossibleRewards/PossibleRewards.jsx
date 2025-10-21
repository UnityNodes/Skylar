import React from 'react';

const PossibleRewards = () => {
  const rewards = [
    {
      id: 1,
      amount: '0.1 $LINA',
      image: '/common.png',
      rarity: 'common'
    },
    {
      id: 2,
      amount: '0.5 $LINA',
      image: '/rare.png',
      rarity: 'rare'
    },
    {
      id: 3,
      amount: '1 $LINA',
      image: '/unique.png',
      rarity: 'unique'
    },
    {
      id: 4,
      amount: '10 $LINA',
      image: '/legendary.png',
      rarity: 'legendary'
    },
    {
      id: 5,
      amount: '25 $LINA',
      image: '/mythic.png',
      rarity: 'mythic'
    }
  ];



  return (
    <div className="w-full py-2 px-2 md:py-4 md:px-4 mb-0 -mt-8 md:mt-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-1 text-center md:text-left md:ml-52">
          Possible Rewards
        </h2>

        <div className="flex justify-center items-center gap-2 md:gap-4 lg:gap-6 overflow-x-auto pb-2">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
            >
              <img
                src={reward.image}
                alt={reward.rarity}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 text-white font-bold text-[10px] sm:text-xs md:text-sm text-center bg-black/80 rounded-b px-0.5 py-0.5 z-10 leading-tight">
                {reward.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PossibleRewards;