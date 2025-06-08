
import React from 'react';

interface GameBoardProps {
  board: ('X' | 'O' | null)[];
  onCellClick: (index: number) => void;
  disabled: boolean;
  settings: {
    boardTheme: string;
    playerSymbols: { X: string; O: string };
    boardSize: number;
    animationSpeed: string;
  };
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  onCellClick, 
  disabled, 
  settings 
}) => {
  const getBoardThemeStyles = () => {
    switch (settings.boardTheme) {
      case 'neon':
        return 'bg-black border-4 border-cyan-400 shadow-lg shadow-cyan-400/50';
      case 'wood':
        return 'bg-amber-800 border-4 border-amber-900 shadow-lg';
      case 'glass':
        return 'bg-white/10 backdrop-blur-sm border-4 border-white/30 shadow-lg';
      default:
        return 'bg-white border-4 border-gray-300 shadow-lg';
    }
  };

  const getCellThemeStyles = (cell: 'X' | 'O' | null) => {
    const baseStyles = "aspect-square border font-bold cursor-pointer transition-all duration-300 flex items-center justify-center text-4xl";
    
    switch (settings.boardTheme) {
      case 'neon':
        return `${baseStyles} bg-gray-900 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 ${cell ? 'shadow-lg shadow-cyan-400/50' : ''}`;
      case 'wood':
        return `${baseStyles} bg-amber-700 border-amber-900 text-amber-100 hover:bg-amber-600`;
      case 'glass':
        return `${baseStyles} bg-white/20 border-white/30 text-white hover:bg-white/30`;
      default:
        return `${baseStyles} bg-white border-gray-300 ${cell === 'X' ? 'text-blue-600' : 'text-red-600'} hover:bg-gray-50`;
    }
  };

  return (
    <div className="board-container">
      <style>{`
        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          padding: 4px;
          border-radius: 8px;
          margin: 0 auto;
        }
        .cell:hover:not(:disabled) {
          transform: scale(1.05);
        }
        .cell:disabled {
          cursor: not-allowed;
        }
      `}</style>
      
      <div 
        className={`board ${getBoardThemeStyles()}`}
        style={{ maxWidth: `${settings.boardSize}px` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${getCellThemeStyles(cell)}`}
            onClick={() => onCellClick(index)}
            disabled={!!cell || disabled}
          >
            {cell ? settings.playerSymbols[cell] : ''}
          </button>
        ))}
      </div>
    </div>
  );
};
