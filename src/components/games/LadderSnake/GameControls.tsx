
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { GameState, GameMode, PowerUpItem } from './types';

interface GameControlsProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  players: '2player' | 'computer';
  setPlayers: (players: '2player' | 'computer') => void;
  gameState: GameState;
  rollDice: () => void;
  resetGame: () => void;
  powerUps: PowerUpItem[];
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  setGameMode,
  players,
  setPlayers,
  gameState,
  rollDice,
  resetGame,
  powerUps
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-purple-700">Game Mode</label>
        <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
          <SelectTrigger className="border-purple-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">🎮 Classic</SelectItem>
            <SelectItem value="educational">📚 Educational</SelectItem>
            <SelectItem value="challenge">🎯 Challenge</SelectItem>
            <SelectItem value="speed">⚡ Speed Mode</SelectItem>
            <SelectItem value="extreme">🔥 Extreme Mode</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 text-purple-700">Players</label>
        <Select value={players} onValueChange={(value) => setPlayers(value as '2player' | 'computer')}>
          <SelectTrigger className="border-purple-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2player">👥 2 Players</SelectItem>
            <SelectItem value="computer">🤖 vs Computer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Current Player */}
      <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border-2 border-purple-200">
        <h3 className="font-semibold mb-2 text-purple-700">Current Turn</h3>
        <div className={`text-2xl font-bold ${
          gameState.currentPlayer === 'player1' ? 'text-red-500' : 
          gameState.currentPlayer === 'player2' ? 'text-blue-500' : 'text-gray-600'
        }`}>
          {gameState.currentPlayer === 'player1' ? '🔴 Player 1' :
           gameState.currentPlayer === 'player2' ? '🔵 Player 2' : '🤖 Computer'}
        </div>
      </div>

      {/* Active Power-ups */}
      {Object.entries(gameState.powerUps).some(([_, active]) => active) && (
        <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300">
          <h4 className="font-bold text-yellow-700 mb-2">⚡ Active Power-ups:</h4>
          {Object.entries(gameState.powerUps).map(([powerUp, active]) => active && (
            <div key={powerUp} className="text-sm text-yellow-600 animate-pulse">
              {powerUps.find(p => p.type === powerUp)?.icon} {powerUps.find(p => p.type === powerUp)?.description}
            </div>
          ))}
        </div>
      )}
      
      {/* Dice */}
      <div className="text-center">
        <div className={`text-6xl mx-auto mb-4 w-20 h-20 flex items-center justify-center border-4 border-purple-400 rounded-xl bg-gradient-to-br from-white to-purple-50 shadow-lg ${gameState.isRolling ? 'animate-spin' : 'hover:scale-105 transition-transform'}`}>
          {gameState.diceValue}
        </div>
        <Button 
          onClick={rollDice}
          disabled={gameState.isRolling || gameState.gameEnded || (gameState.currentPlayer === 'computer' && players === 'computer')}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-lg px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          {gameState.isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
        </Button>
      </div>
      
      {/* Player Positions */}
      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg border border-red-300">
          <span className="font-medium text-red-700 flex items-center gap-2">
            🔴 Player 1
            <Progress value={(gameState.player1Position / 100) * 100} className="w-16 h-2" />
          </span>
          <span className="font-bold text-red-800">Square {gameState.player1Position}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
          <span className="font-medium text-blue-700 flex items-center gap-2">
            {players === '2player' ? '🔵 Player 2' : '🤖 Computer'}
            <Progress value={((players === '2player' ? gameState.player2Position : gameState.computerPosition) / 100) * 100} className="w-16 h-2" />
          </span>
          <span className="font-bold text-blue-800">
            Square {players === '2player' ? gameState.player2Position : gameState.computerPosition}
          </span>
        </div>
      </div>
      
      <Button 
        onClick={resetGame} 
        variant="outline" 
        className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
      >
        🔄 New Game
      </Button>
    </div>
  );
};
