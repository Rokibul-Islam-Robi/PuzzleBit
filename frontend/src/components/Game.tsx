import React, { useState, useRef } from 'react';
import './Game.css';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, level_complete
  const [currentLevel] = useState(1);
  const [coins] = useState(500);
  const [letters] = useState(['A', 'S', 'T', 'R', 'E']);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Prompt 2: Circular Letter Wheel logic
  const renderWheel = () => {
    const radius = 100;
    return letters.map((letter, i) => {
      const angle = (i / letters.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return (
        <button
          key={i}
          className="wheel-letter-btn"
          style={{ transform: `translate(${x}px, ${y}px)` }}
          onClick={() => console.log(letter)}
        >
          {letter}
        </button>
      );
    });
  };

  return (
    <div className="game-container">
      {/* Background with HD per-level image */}
      <div className="game-bg level-bg-1"></div>

      {gameState === 'menu' && (
        <div className="glass-panel main-menu">
          <h1>WORD PUZZLE</h1>
          <button className="glass-btn primary" onClick={() => setGameState('playing')}>
            PLAY GAME
          </button>
          <div className="coin-display">
            💎 {coins}
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="play-screen">
          <div className="game-header">
            <div className="level-badge">Level {currentLevel}</div>
            <div className="coin-counter">💎 {coins}</div>
          </div>

          <div className="puzzle-board">
            <div className="word-slots">
                <div className="word-slot empty"></div>
                <div className="word-slot empty"></div>
                <div className="word-slot empty"></div>
            </div>
          </div>

          <div className="letter-wheel-container">
            <div className="letter-wheel" ref={wheelRef}>
              {renderWheel()}
            </div>
            <div className="wheel-actions">
              <button className="action-btn shuffle-btn">🔀</button>
              <button className="action-btn hint-btn">💡</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
