import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface TicTacToeProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type GameMode = 'human' | 'ai-easy' | 'ai-hard';
type BoardSize = 3 | 4 | 5;
type PlayerSymbol = 'X_O' | 'emoji_animals' | 'emoji_faces' | 'emoji_sports' | 'shapes' | 'custom';
type BoardTheme = 'classic' | 'neon' | 'wood' | 'space' | 'ocean' | 'gradient';

interface WinningLine {
  positions: number[];
  player: Player;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('human');
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [playerSymbols, setPlayerSymbols] = useState<PlayerSymbol>('X_O');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('classic');
  const [showRules, setShowRules] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [boardColors, setBoardColors] = useState({ primary: '#3B82F6', secondary: '#EF4444' });
  const [customSymbols, setCustomSymbols] = useState({ X: 'X', O: 'O' });

  const symbolSets = {
    X_O: { X: 'X', O: 'O' },
    emoji_animals: { X: '🐱', O: '🐶' },
    emoji_faces: { X: '😊', O: '😎' },
    emoji_sports: { X: '⚽', O: '🏀' },
    shapes: { X: '★', O: '●' },
    custom: customSymbols
  };

  const getWinningSymbol = (player: Player, isWinner: boolean) => {
    const baseSymbol = symbolSets[playerSymbols][player || 'X'];
    
    if (!isWinner) return baseSymbol;
    
    // Add winning expressions
    if (playerSymbols === 'emoji_faces') {
      return player === 'X' ? '🤩' : '😍';
    } else if (playerSymbols === 'emoji_animals') {
      return player === 'X' ? '😸' : '🐕';
    }
    
    return baseSymbol;
  };

  const themeStyles = {
    classic: {
      bg: 'bg-gray-100',
      border: 'border-gray-400',
      button: 'bg-white hover:bg-gray-50',
      text: 'text-gray-800',
      gradient: ''
    },
    neon: {
      bg: 'bg-black',
      border: 'border-cyan-400',
      button: 'bg-gray-900 hover:bg-cyan-900 border-cyan-400 shadow-lg shadow-cyan-500/50',
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-purple-500'
    },
    wood: {
      bg: 'bg-amber-50',
      border: 'border-amber-600',
      button: 'bg-amber-100 hover:bg-amber-200',
      text: 'text-amber-900',
      gradient: 'from-amber-200 to-orange-300'
    },
    space: {
      bg: 'bg-purple-900',
      border: 'border-purple-400',
      button: 'bg-purple-800 hover:bg-purple-700 border-purple-400',
      text: 'text-purple-100',
      gradient: 'from-purple-600 to-pink-600'
    },
    ocean: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      button: 'bg-blue-100 hover:bg-blue-200',
      text: 'text-blue-900',
      gradient: 'from-blue-300 to-teal-400'
    },
    gradient: {
      bg: 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100',
      border: 'border-purple-300',
      button: 'bg-white/80 hover:bg-white/90 backdrop-blur-sm',
      text: 'text-purple-800',
      gradient: 'from-purple-400 to-pink-400'
    }
  };

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setWinner(null);
    setWinningLine(null);
    setCurrentPlayer('X');
  }, [boardSize]);

  useEffect(() => {
    if (gameMode !== 'human' && currentPlayer === 'O' && !winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner]);

  const getWinningLines = (size: number) => {
    const lines = [];
    
    // Rows
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      lines.push(row);
    }
    
    // Columns
    for (let i = 0; i < size; i++) {
      const col = [];
      for (let j = 0; j < size; j++) {
        col.push(j * size + i);
      }
      lines.push(col);
    }
    
    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
      diagonal1.push(i * size + i);
      diagonal2.push(i * size + (size - 1 - i));
    }
    lines.push(diagonal1);
    lines.push(diagonal2);
    
    return lines;
  };

  const checkWinner = (newBoard: Player[]) => {
    const lines = getWinningLines(boardSize);
    
    for (const line of lines) {
      const values = line.map(index => newBoard[index]);
      if (values[0] && values.every(val => val === values[0])) {
        setWinningLine({ positions: line, player: values[0] });
        return values[0];
      }
    }
    
    if (newBoard.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      setScore(prev => ({
        ...prev,
        [gameResult === 'draw' ? 'draws' : gameResult]: prev[gameResult === 'draw' ? 'draws' : gameResult] + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const makeAIMove = () => {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    if (availableMoves.length === 0) return;
    
    let move: number;
    
    if (gameMode === 'ai-hard') {
      move = getBestMove(board, boardSize);
    } else {
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    makeMove(move);
  };

  const getBestMove = (currentBoard: Player[], size: number): number => {
    const availableMoves = currentBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    // Try to win
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return move;
      }
    }
    
    // Block player from winning
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return move;
      }
    }
    
    // Take center if available
    const center = Math.floor((size * size) / 2);
    if (availableMoves.includes(center)) {
      return center;
    }
    
    // Take corners
    const corners = [0, size - 1, size * (size - 1), size * size - 1];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  const currentTheme = themeStyles[boardTheme];
  const currentSymbols = symbolSets[playerSymbols];

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline" className="bg-white/90">
              ← Back to Hub
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-gray-100">
              ← Previous
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">⭕ Advanced Tic Tac Toe</h1>
          <div className="flex gap-2">
            <Dialog open={showRules} onOpenChange={setShowRules}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                  📖 How to Play
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>How to Play Advanced Tic Tac Toe</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="animate-fade-in">
                    <h3 className="font-bold text-lg">🎯 Objective</h3>
                    <p>Be the first to get {boardSize} of your marks in a row (horizontal, vertical, or diagonal).</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-bold text-lg">🎮 How to Play</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Players take turns placing their mark in empty squares</li>
                      <li>The first player to get {boardSize} marks in a row wins</li>
                      <li>If all squares are filled with no winner, it's a draw</li>
                      <li>Choose different board sizes for varied difficulty</li>
                      <li>Customize symbols and themes for personalized gameplay</li>
                    </ol>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-bold">💡 Strategy Tips:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Control the center square when possible</li>
                      <li>Watch for opportunities to create multiple winning lines</li>
                      <li>Block your opponent's winning moves</li>
                      <li>Think ahead and plan your moves</li>
                      <li>On larger boards, focus on building longer sequences</li>
                    </ul>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h4 className="font-bold">🎨 Customization Features:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Change board size (3x3, 4x4, 5x5)</li>
                      <li>Select different symbol sets (emojis, shapes, custom)</li>
                      <li>Choose from various board themes</li>
                      <li>Enable animations and sound effects</li>
                      <li>Track your score across multiple games</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showConcept} onOpenChange={setShowConcept}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                  🧠 Concept
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Strategic Thinking & Pattern Recognition</DialogTitle>
                  <DialogDescription>Learn the cognitive benefits of playing Tic Tac Toe</DialogDescription>
                </DialogHeader>
                // ... keep existing concept content
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Game Settings */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Board Size</label>
                <Select value={boardSize.toString()} onValueChange={(value) => setBoardSize(parseInt(value) as BoardSize)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3x3 Classic</SelectItem>
                    <SelectItem value="4">4x4 Challenge</SelectItem>
                    <SelectItem value="5">5x5 Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">👥 2 Players</SelectItem>
                    <SelectItem value="ai-easy">🤖 vs AI (Easy)</SelectItem>
                    <SelectItem value="ai-hard">🧠 vs AI (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Visual Customization */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Visual Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Player Symbols</label>
                <Select value={playerSymbols} onValueChange={(value) => setPlayerSymbols(value as PlayerSymbol)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="X_O">X & O</SelectItem>
                    <SelectItem value="emoji_animals">🐱 & 🐶</SelectItem>
                    <SelectItem value="emoji_faces">😊 & 😎</SelectItem>
                    <SelectItem value="emoji_sports">⚽ & 🏀</SelectItem>
                    <SelectItem value="shapes">★ & ●</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Board Theme</label>
                <Select value={boardTheme} onValueChange={(value) => setBoardTheme(value as BoardTheme)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="neon">Neon Glow</SelectItem>
                    <SelectItem value="wood">Wooden</SelectItem>
                    <SelectItem value="space">Space Theme</SelectItem>
                    <SelectItem value="ocean">Ocean Blue</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {playerSymbols === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Player X Symbol</label>
                    <input
                      type="text"
                      value={customSymbols.X}
                      onChange={(e) => setCustomSymbols(prev => ({ ...prev, X: e.target.value }))}
                      className="w-full p-1 border rounded text-center"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Player O Symbol</label>
                    <input
                      type="text"
                      value={customSymbols.O}
                      onChange={(e) => setCustomSymbols(prev => ({ ...prev, O: e.target.value }))}
                      className="w-full p-1 border rounded text-center"
                      maxLength={2}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Options */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Game Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Animations</label>
                <input
                  type="checkbox"
                  checked={animationEnabled}
                  onChange={() => setAnimationEnabled(!animationEnabled)}
                  className="w-4 h-4"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sound Effects</label>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                  className="w-4 h-4"
                />
              </div>

              {boardTheme === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Primary Color</label>
                    <input
                      type="color"
                      value={boardColors.primary}
                      onChange={(e) => setBoardColors(prev => ({ ...prev, primary: e.target.value }))}
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Secondary Color</label>
                    <input
                      type="color"
                      value={boardColors.secondary}
                      onChange={(e) => setBoardColors(prev => ({ ...prev, secondary: e.target.value }))}
                      className="w-full h-8 rounded"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">
              Score: {getWinningSymbol('X', false)}({score.X}) - {getWinningSymbol('O', false)}({score.O}) - Draws({score.draws})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              {winner ? (
                <div className="text-2xl font-bold text-green-600 animate-bounce">
                  {winner === 'draw' ? "It's a Draw! 🤝" : 
                   `Player ${getWinningSymbol(winner, true)} Wins! 🎉`}
                </div>
              ) : (
                <div className="text-xl">
                  Current Player: <span className="font-bold text-blue-600 text-3xl">
                    {getWinningSymbol(currentPlayer, false)}
                  </span>
                </div>
              )}
            </div>

            <div 
              className={`grid gap-2 mx-auto justify-center mb-4 p-6 rounded-xl ${currentTheme.bg} ${currentTheme.gradient ? `bg-gradient-to-br ${currentTheme.gradient}` : ''}`}
              style={{ 
                gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                maxWidth: `${boardSize * 70}px`
              }}
            >
              {board.map((cell, index) => {
                const isWinningCell = winningLine?.positions.includes(index);
                const cellSymbol = cell ? getWinningSymbol(cell, isWinningCell || false) : '';
                
                return (
                  <Button
                    key={index}
                    className={`
                      w-16 h-16 text-2xl font-bold transition-all duration-300 border-2 
                      ${currentTheme.button} ${currentTheme.border} ${currentTheme.text}
                      ${!cell && !winner ? 'hover:scale-110 hover:shadow-lg' : ''} 
                      ${animationEnabled && cell ? 'animate-scale-in' : ''}
                      ${isWinningCell ? 'ring-4 ring-yellow-400 ring-opacity-75 bg-yellow-100' : ''}
                    `}
                    onClick={() => makeMove(index)}
                    disabled={!!cell || !!winner}
                  >
                    {cellSymbol}
                  </Button>
                );
              })}
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                🎮 New Game
              </Button>
              <Button onClick={resetScore} variant="outline">
                🔄 Reset Score
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
