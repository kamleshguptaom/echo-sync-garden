
import React from 'react';
import { GameState, LadderSnake, PowerUpItem } from './types';

interface GameBoardProps {
  gameState: GameState;
  players: '2player' | 'computer';
  showAnimation: string;
  laddersSnakes: LadderSnake[];
  powerUps: PowerUpItem[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  players,
  showAnimation,
  laddersSnakes,
  powerUps
}) => {
  const getSquareContent = (position: number) => {
    const ladderSnake = laddersSnakes.find(ls => ls.start === position);
    const powerUp = powerUps.find(p => p.position === position);
    
    if (powerUp) return powerUp.icon;
    if (ladderSnake) return ladderSnake.type === 'ladder' ? '🪜' : '🐍';
    if (position === 100) return '👑';
    return position.toString();
  };

  const getSquareColor = (position: number) => {
    const ladderSnake = laddersSnakes.find(ls => ls.start === position);
    const powerUp = powerUps.find(p => p.position === position);
    
    if (position === 100) return 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600';
    if (powerUp) return 'bg-gradient-to-br from-purple-300 to-purple-500';
    if (ladderSnake) {
      return ladderSnake.type === 'ladder' 
        ? 'bg-gradient-to-br from-green-300 to-green-500' 
        : 'bg-gradient-to-br from-red-300 to-red-500';
    }
    return (Math.floor((position - 1) / 10) + (position - 1)) % 2 === 0 
      ? 'bg-gradient-to-br from-blue-200 to-blue-300' 
      : 'bg-gradient-to-br from-amber-200 to-amber-300';
  };

  const renderBoard = () => {
    const squares = [];
    
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        const position = row % 2 === 1 
          ? row * 10 + (10 - col) 
          : row * 10 + col + 1;
        
        const isPlayer1Here = gameState.player1Position === position;
        const isPlayer2Here = gameState.player2Position === position;
        const isComputerHere = players === 'computer' && gameState.computerPosition === position;
        
        squares.push(
          <div
            key={position}
            className={`
              relative w-10 h-10 border-2 border-gray-400 flex items-center justify-center text-xs font-bold
              transition-all duration-300 hover:scale-105
              ${getSquareColor(position)}
              ${showAnimation === 'climb' && position === gameState[`${gameState.currentPlayer}Position`] ? 'animate-bounce' : ''}
              ${showAnimation === 'slide' && position === gameState[`${gameState.currentPlayer}Position`] ? 'animate-pulse' : ''}
            `}
          >
            {getSquareContent(position)}
            
            {/* Players */}
            <div className="absolute -top-1 -right-1 flex gap-0.5">
              {isPlayer1Here && (
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
              {isPlayer2Here && (
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
              {isComputerHere && (
                <div className="w-3 h-3 bg-gray-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
            </div>
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="grid grid-cols-10 gap-1 border-4 border-purple-300 rounded-lg p-2 mb-4 mx-auto w-fit bg-gradient-to-br from-purple-100 to-indigo-100">
      {renderBoard()}
    </div>
  );
};
