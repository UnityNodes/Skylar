import React, { useState, useRef, useEffect } from 'react';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header/Header';
import RouletteContainer from './components/Roulette/RouletteContainer';
import Leaderboard from './components/Leaderboard/Leaderboard';
import WinModal from './components/Modals/WinModal';
import FaqModal from './components/Modals/FaqModal';
import LoginModal from './components/Modals/LoginModal';
import Footer from './components/Footer/Footer';

import FonImage from './Fon.png';

import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('roulette');



  const [showWinModal, setShowWinModal] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(false);
  const rouletteRef = useRef(null);

  const handleWin = (amount) => {
    setWinAmount(amount);
    setShowWinModal(true);
    // Balance is now updated through UserContext
  };

  const closeWinModal = () => {
    setShowWinModal(false);
  };

  const handleNewCase = () => {
    if (rouletteRef.current && rouletteRef.current.handleReset) {
      rouletteRef.current.handleReset();
    }
  };

  const switchToLeaderboard = () => {
    if (!isRouletteSpinning) {
      setCurrentView('leaderboard');
    }
  };

  const handleFaqToggle = (show) => {
    if (!isRouletteSpinning) {
      setShowFaqModal(show);
    }
  };

  const handleViewChange = (view) => {
    if (!isRouletteSpinning) {
      setCurrentView(view);
    }
  };

  const appStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(10, 10, 15, 0.6) 0%, rgba(26, 26, 46, 0.6) 50%, rgba(22, 33, 62, 0.6) 100%), url(${FonImage})`
  };

  return (
    <div className="App" style={appStyle}>
      <Header
        onFaqToggle={handleFaqToggle}
        onLeaderboardToggle={switchToLeaderboard}
        currentView={currentView}
        onViewChange={handleViewChange}
        isRouletteSpinning={isRouletteSpinning}
      />

      <div className={`main-content ${showFaqModal ? 'hidden-content' : ''}`}>
        {currentView === 'roulette' && (
          <>
            <RouletteContainer
              ref={rouletteRef}
              onWin={handleWin}
              onSpinningChange={setIsRouletteSpinning}
            />

          </>
        )}

        {currentView === 'leaderboard' && (
          <Leaderboard />
        )}
      </div>

      {showWinModal && (
        <WinModal
          amount={winAmount}
          onClose={closeWinModal}
          onNewCase={handleNewCase}
        />
      )}

      {showFaqModal && (
        <FaqModal onClose={() => setShowFaqModal(false)} />
      )}

      <LoginModal />

      <Footer className={showFaqModal ? 'hidden-content' : ''} />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;