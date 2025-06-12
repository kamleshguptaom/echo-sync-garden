import { useState, useEffect } from 'react';
import { GameState, GameMode, Player, GameStats, LadderSnake, PowerUp } from './types';
import { getGameConfig, getPowerUps } from './gameConfig';

export const useGameLogic = (gameMode: GameMode, players: '2player' | 'computer') => {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 'player1',
    player1Position: 0,
    player2Position: 0,
    computerPosition: 0,
    diceValue: 1,
    gameEnded: false,
    winner: null,
    isRolling: false,
    consecutiveTurns: 0,
    powerUps: {}
  });

  const [gameStats, setGameStats] = useState<GameStats>({
    laddersClimbed: 0,
    snakesBitten: 0,
    powerUpsCollected: 0,
    totalMoves: 0
  });

  const [conceptMessage, setConceptMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState('');

  const laddersSnakes = [...getGameConfig(gameMode).ladders, ...getGameConfig(gameMode).snakes];
  const powerUps = getPowerUps(gameMode);

  // Real-time game updates when mode or players change
  useEffect(() => {
    resetGame();
  }, [gameMode, players]);

  const rollDice = () => {
    if (gameState.isRolling || gameState.gameEnded) return;
    
    setGameState(prev => ({ ...prev, isRolling: true }));
    setGameStats(prev => ({ ...prev, totalMoves: prev.totalMoves + 1 }));
    
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
      rollCount++;
      
      if (rollCount >= 15) {
        clearInterval(rollInterval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        movePlayer(finalDice);
      }
    }, 80);
  };

  const movePlayer = (diceValue: number) => {
    setGameState(prev => {
      const newState = { ...prev, diceValue, isRolling: false };
      const currentPos = prev[`${prev.currentPlayer}Position` as keyof GameState] as number;
      let newPosition = currentPos + diceValue;
      
      // Apply power-ups
      if (prev.powerUps['double-move']) {
        newPosition = currentPos + (diceValue * 2);
        newState.powerUps = { ...prev.powerUps, 'double-move': false };
      }
      
      if (prev.powerUps['mega-jump']) {
        newPosition = Math.min(100, currentPos + 15);
        newState.powerUps = { ...prev.powerUps, 'mega-jump': false };
      }
      
      // Don't move beyond 100
      if (newPosition > 100) {
        newPosition = currentPos;
      }
      
      // Check for power-ups
      const powerUp = powerUps.find(p => p.position === newPosition);
      if (powerUp) {
        setGameStats(prevStats => ({ ...prevStats, powerUpsCollected: prevStats.powerUpsCollected + 1 }));
        newState.powerUps = { ...prev.powerUps, [powerUp.type]: true };
        setConceptMessage(`⚡ Power-up collected: ${powerUp.description}`);
        setTimeout(() => setConceptMessage(''), 3000);
        
        if (powerUp.type === 'teleport') {
          newPosition = Math.min(100, newPosition + 10);
        }
      }
      
      // Check for ladders and snakes
      const ladderSnake = laddersSnakes.find(ls => ls.start === newPosition);
      if (ladderSnake) {
        // Check snake immunity
        if (ladderSnake.type === 'snake' && (prev.powerUps['skip-snake'] || prev.powerUps['shield'])) {
          if (prev.powerUps['skip-snake']) {
            newState.powerUps = { ...prev.powerUps, 'skip-snake': false };
          } else if (prev.powerUps['shield']) {
            // Shield protects from 2 snakes, so we keep it active
            setConceptMessage('🔰 Shield protection activated!');
          }
          setConceptMessage('🛡️ Snake immunity used! Safe passage!');
          setTimeout(() => setConceptMessage(''), 3000);
        } else {
          newPosition = ladderSnake.end;
          
          if (ladderSnake.type === 'ladder') {
            setGameStats(prevStats => ({ ...prevStats, laddersClimbed: prevStats.laddersClimbed + 1 }));
            setShowAnimation('climb');
          } else {
            setGameStats(prevStats => ({ ...prevStats, snakesBitten: prevStats.snakesBitten + 1 }));
            setShowAnimation('slide');
          }
          
          if (ladderSnake.concept) {
            setConceptMessage(ladderSnake.concept);
            setTimeout(() => setConceptMessage(''), 4000);
          }
          
          setTimeout(() => setShowAnimation(''), 2000);
        }
      }
      
      // Update position
      newState[`${prev.currentPlayer}Position` as keyof GameState] = newPosition as never;
      
      // Check for winner
      if (newPosition === 100) {
        newState.gameEnded = true;
        newState.winner = prev.currentPlayer;
      } else {
        // Check for extra turn
        if (prev.powerUps['extra-turn']) {
          newState.powerUps = { ...prev.powerUps, 'extra-turn': false };
          setConceptMessage('🎯 Extra turn activated!');
          setTimeout(() => setConceptMessage(''), 2000);
        } else {
          // Switch player
          if (players === '2player') {
            newState.currentPlayer = prev.currentPlayer === 'player1' ? 'player2' : 'player1';
          } else {
            newState.currentPlayer = prev.currentPlayer === 'player1' ? 'computer' : 'player1';
            
            // Computer's turn
            if (newState.currentPlayer === 'computer' && !newState.gameEnded) {
              setTimeout(() => {
                const computerDice = Math.floor(Math.random() * 6) + 1;
                movePlayer(computerDice);
              }, 1500);
            }
          }
        }
      }
      
      return newState;
    });
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 'player1',
      player1Position: 0,
      player2Position: 0,
      computerPosition: 0,
      diceValue: 1,
      gameEnded: false,
      winner: null,
      isRolling: false,
      consecutiveTurns: 0,
      powerUps: {}
    });
    setGameStats({
      laddersClimbed: 0,
      snakesBitten: 0,
      powerUpsCollected: 0,
      totalMoves: 0
    });
    setConceptMessage('');
    setShowAnimation('');
  };

  return {
    gameState,
    gameStats,
    conceptMessage,
    showAnimation,
    laddersSnakes,
    powerUps,
    rollDice,
    resetGame
  };
};
