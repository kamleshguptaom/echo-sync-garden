
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface TicTacToeProps {
  onBack: () => void;
}

type CellValue = 'X' | 'O' | '';
type BoardTheme = 'classic' | 'neon' | 'wood' | 'space' | 'ocean' | 'custom';
type GameMode = 'player-vs-player' | 'player-vs-ai';
type Difficulty = 'easy' | 'medium' | 'hard';
type SymbolType = 'classic' | 'emoji' | 'shapes' | 'custom';

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
}

interface CustomSymbols {
  x: string;
  o: string;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [gridSize, setGridSize] = useState(3);
  const [board, setBoard] = useState<CellValue[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('classic');
  const [gameMode, setGameMode] = useState<GameMode>('player-vs-player');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [symbolType, setSymbolType] = useState<SymbolType>('classic');
  const [customSymbols, setCustomSymbols] = useState<CustomSymbols>({ x: '🔥', o: '💧' });
  const [customColors, setCustomColors] = useState({ background: '#ffffff', grid: '#000000', x: '#ff0000', o: '#0000ff' });
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0, totalGames: 0 });
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [winningLine, setWinningLine] = useState<[number, number, number][] | null>(null);
  const [showWinCelebration, setShowWinCelebration] = useState(false);

  useEffect(() => {
    if (gameMode === 'player-vs-ai' && currentPlayer === 'O' && !winner) {
      makeAIMove();
    }
  }, [currentPlayer, gameMode, winner]);

  const initializeBoard = () => {
    const newBoard: CellValue[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    setBoard(newBoard);
    setWinner(null);
    setCurrentPlayer('X');
    setWinningLine(null);
    setShowWinCelebration(false);
  };

  useEffect(() => {
    initializeBoard();
  }, [gridSize]);

  const checkWinner = (board: CellValue[][]): 'X' | 'O' | 'Draw' | null => {
    // Check rows
    for (let i = 0; i < gridSize; i++) {
      if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
        setWinningLine([...Array(gridSize).keys()].map(j => [i, j, i * gridSize + j]));
        return board[i][0] as 'X' | 'O';
      }
    }

    // Check columns
    for (let j = 0; j < gridSize; j++) {
      if (board[0][j] && board.every(row => row[j] === board[0][j])) {
        setWinningLine([...Array(gridSize).keys()].map(i => [i, j, i * gridSize + j]));
        return board[0][j] as 'X' | 'O';
      }
    }

    // Check main diagonal
    if (board[0][0] && board.every((row, i) => row[i] === board[0][0])) {
      setWinningLine([...Array(gridSize).keys()].map(i => [i, i, i * gridSize + i]));
      return board[0][0] as 'X' | 'O';
    }

    // Check anti-diagonal
    if (board[0][gridSize - 1] && board.every((row, i) => row[gridSize - 1 - i] === board[0][gridSize - 1])) {
      setWinningLine([...Array(gridSize).keys()].map(i => [i, gridSize - 1 - i, i * gridSize + (gridSize - 1 - i)]));
      return board[0][gridSize - 1] as 'X' | 'O';
    }

    // Check for draw
    if (board.every(row => row.every(cell => cell !== ''))) {
      return 'Draw';
    }

    return null;
  };

  const makeMove = (row: number, col: number) => {
    if (board[row][col] !== '' || winner || aiThinking) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      updateStats(gameWinner);
      if (gameWinner !== 'Draw') {
        setShowWinCelebration(true);
        setTimeout(() => setShowWinCelebration(false), 3000);
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const updateStats = (gameWinner: 'X' | 'O' | 'Draw') => {
    setGameStats(prev => ({
      ...prev,
      xWins: gameWinner === 'X' ? prev.xWins + 1 : prev.xWins,
      oWins: gameWinner === 'O' ? prev.oWins + 1 : prev.oWins,
      draws: gameWinner === 'Draw' ? prev.draws + 1 : prev.draws,
      totalGames: prev.totalGames + 1
    }));
  };

  // Improved AI logic
  const makeAIMove = async () => {
    if (winner || currentPlayer === 'X') return;

    setAiThinking(true);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Get best move based on difficulty
    const [row, col] = getBestMove();

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      updateStats(gameWinner);
      if (gameWinner !== 'Draw') {
        setShowWinCelebration(true);
        setTimeout(() => setShowWinCelebration(false), 3000);
      }
    } else {
      setCurrentPlayer('X');
    }

    setAiThinking(false);
  };

  const getBestMove = (): [number, number] => {
    // Copy the board
    const boardCopy = board.map(row => [...row]);
    
    if (difficulty === 'easy') {
      // Random move
      const emptyCells: [number, number][] = [];
      boardCopy.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell === '') {
            emptyCells.push([rowIndex, colIndex]);
          }
        });
      });
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else {
      // Medium or Hard, use minimax with limited depth for Medium
      const maxDepth = difficulty === 'medium' ? 2 : Infinity;
      return findBestMove(boardCopy, maxDepth);
    }
  };

  // Minimax algorithm for AI
  const findBestMove = (boardState: CellValue[][], maxDepth: number): [number, number] => {
    let bestMove: [number, number] = [-1, -1];
    let bestScore = -Infinity;

    // Try each empty cell
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (boardState[i][j] === '') {
          boardState[i][j] = 'O';
          const score = minimax(boardState, 0, false, -Infinity, Infinity, maxDepth);
          boardState[i][j] = '';

          if (score > bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }

    return bestMove;
  };

  const minimax = (
    boardState: CellValue[][], 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number, 
    beta: number, 
    maxDepth: number
  ): number => {
    // Check terminal states or max depth
    const winner = evaluateBoard(boardState);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'Draw' || depth >= maxDepth) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (boardState[i][j] === '') {
            boardState[i][j] = 'O';
            const score = minimax(boardState, depth + 1, false, alpha, beta, maxDepth);
            boardState[i][j] = '';
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) break;
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (boardState[i][j] === '') {
            boardState[i][j] = 'X';
            const score = minimax(boardState, depth + 1, true, alpha, beta, maxDepth);
            boardState[i][j] = '';
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) break;
          }
        }
      }
      return bestScore;
    }
  };

  const evaluateBoard = (boardState: CellValue[][]): 'X' | 'O' | 'Draw' | null => {
    // Check rows
    for (let i = 0; i < gridSize; i++) {
      if (boardState[i][0] && boardState[i].every(cell => cell === boardState[i][0])) {
        return boardState[i][0] as 'X' | 'O';
      }
    }

    // Check columns
    for (let j = 0; j < gridSize; j++) {
      if (boardState[0][j] && boardState.every(row => row[j] === boardState[0][j])) {
        return boardState[0][j] as 'X' | 'O';
      }
    }

    // Check main diagonal
    if (boardState[0][0] && boardState.every((row, i) => row[i] === boardState[0][0])) {
      return boardState[0][0] as 'X' | 'O';
    }

    // Check anti-diagonal
    if (boardState[0][gridSize - 1] && boardState.every((row, i) => row[gridSize - 1 - i] === boardState[0][gridSize - 1])) {
      return boardState[0][gridSize - 1] as 'X' | 'O';
    }

    // Check for draw
    if (boardState.every(row => row.every(cell => cell !== ''))) {
      return 'Draw';
    }

    return null;
  };

  const getSymbol = (value: CellValue): string => {
    if (!value) return '';
    
    switch (symbolType) {
      case 'classic':
        return value;
      case 'emoji':
        return value === 'X' ? '❌' : '⭕';
      case 'shapes':
        return value === 'X' ? '⬜' : '🔵';
      case 'custom':
        return value === 'X' ? customSymbols.x : customSymbols.o;
      default:
        return value;
    }
  };

  const getThemeStyles = () => {
    const themes = {
      classic: {
        background: 'bg-white',
        grid: 'border-gray-800',
        cell: 'bg-gray-50 hover:bg-gray-100'
      },
      neon: {
        background: 'bg-black',
        grid: 'border-cyan-400',
        cell: 'bg-gray-900 hover:bg-gray-800 border-cyan-400'
      },
      wood: {
        background: 'bg-amber-100',
        grid: 'border-amber-800',
        cell: 'bg-amber-50 hover:bg-amber-200'
      },
      space: {
        background: 'bg-purple-900',
        grid: 'border-purple-400',
        cell: 'bg-purple-800 hover:bg-purple-700'
      },
      ocean: {
        background: 'bg-blue-100',
        grid: 'border-blue-800',
        cell: 'bg-blue-50 hover:bg-blue-200'
      },
      custom: {
        background: '',
        grid: '',
        cell: ''
      }
    };
    
    return boardTheme === 'custom' ? themes.custom : themes[boardTheme];
  };

  const resetGame = () => {
    initializeBoard();
  };

  const resetStats = () => {
    setGameStats({ xWins: 0, oWins: 0, draws: 0, totalGames: 0 });
  };

  const themeStyles = getThemeStyles();

  const isCellInWinningLine = (rowIndex: number, colIndex: number) => {
    if (!winningLine) return false;
    return winningLine.some(([row, col]) => row === rowIndex && col === colIndex);
  };

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
          <h1 className="text-4xl font-bold text-white">⭕ Tic Tac Toe Pro</h1>
          <div className="flex gap-2">
            <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                  📖 How to Play
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>How to Play Tic Tac Toe</DialogTitle>
                  <DialogDescription>Master the classic strategy game</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">🎯 Objective</h3>
                    <p>Be the first to get {gridSize} of your symbols in a row (horizontally, vertically, or diagonally).</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">🎮 How to Play</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Players take turns placing their symbol on the grid</li>
                      <li>X always goes first</li>
                      <li>Click on an empty cell to place your symbol</li>
                      <li>The first player to get {gridSize} in a row wins!</li>
                      <li>If all cells are filled with no winner, it's a draw</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">💡 Strategy Tips</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Control the center when possible</li>
                      <li>Block your opponent's winning moves</li>
                      <li>Create multiple winning opportunities</li>
                      <li>Think two moves ahead</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showConcept} onOpenChange={setShowConcept}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                  🧠 Concept
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Strategic Thinking & Pattern Recognition</DialogTitle>
                  <DialogDescription>Develop cognitive skills through classic gameplay</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="animate-fade-in">
                    <h3 className="font-bold text-lg mb-3">🧠 Cognitive Benefits</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Strategic Planning:</strong> Thinking multiple moves ahead</li>
                      <li><strong>Pattern Recognition:</strong> Identifying winning combinations</li>
                      <li><strong>Logical Reasoning:</strong> Making optimal decisions</li>
                      <li><strong>Spatial Intelligence:</strong> Understanding grid relationships</li>
                    </ul>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      <a href="https://en.wikipedia.org/wiki/Tic-tac-toe" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Tic-tac-toe</a>
                      <a href="https://en.wikipedia.org/wiki/Game_theory" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Game Theory</a>
                      <a href="https://en.wikipedia.org/wiki/Strategic_thinking" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Strategic Thinking</a>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          <div className="space-y-4">
            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Grid Size: {gridSize}x{gridSize}</label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={(value) => setGridSize(value[0])}
                    max={6}
                    min={3}
                    step={1}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="player-vs-player">👥 Player vs Player</SelectItem>
                      <SelectItem value="player-vs-ai">🤖 Player vs AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {gameMode.includes('ai') && (
                  <div>
                    <label className="text-sm font-medium">AI Difficulty</label>
                    <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">😊 Easy</SelectItem>
                        <SelectItem value="medium">😐 Medium</SelectItem>
                        <SelectItem value="hard">😤 Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={boardTheme} onValueChange={(value) => setBoardTheme(value as BoardTheme)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">📋 Classic</SelectItem>
                      <SelectItem value="neon">💫 Neon</SelectItem>
                      <SelectItem value="wood">🪵 Wood</SelectItem>
                      <SelectItem value="space">🌌 Space</SelectItem>
                      <SelectItem value="ocean">🌊 Ocean</SelectItem>
                      <SelectItem value="custom">🎨 Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Symbols</label>
                  <Select value={symbolType} onValueChange={(value) => setSymbolType(value as SymbolType)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">XO Classic</SelectItem>
                      <SelectItem value="emoji">😊 Emoji</SelectItem>
                      <SelectItem value="shapes">🔷 Shapes</SelectItem>
                      <SelectItem value="custom">✨ Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {symbolType === 'custom' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">X Symbol</label>
                      <input
                        type="text"
                        value={customSymbols.x}
                        onChange={(e) => setCustomSymbols(prev => ({ ...prev, x: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-sm"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label className="text-xs">O Symbol</label>
                      <input
                        type="text"
                        value={customSymbols.o}
                        onChange={(e) => setCustomSymbols(prev => ({ ...prev, o: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-sm"
                        maxLength={2}
                      />
                    </div>
                  </div>
                )}

                {boardTheme === 'custom' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">Background</label>
                      <input
                        type="color"
                        value={customColors.background}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, background: e.target.value }))}
                        className="w-full h-8 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Grid Color</label>
                      <input
                        type="color"
                        value={customColors.grid}
                        onChange={(e) => setCustomColors(prev => ({ ...prev, grid: e.target.value }))}
                        className="w-full h-8 rounded"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className={`${themeStyles.background} p-6 relative`} style={boardTheme === 'custom' ? { backgroundColor: customColors.background } : {}}>
              <CardContent className="flex flex-col items-center space-y-4">
                {showWinCelebration && (
                  <div className="absolute inset-0 z-10 overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-confetti"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          background: `${['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'][Math.floor(Math.random() * 5)]}`,
                          width: `${Math.random() * 10 + 5}px`,
                          height: `${Math.random() * 10 + 5}px`,
                          borderRadius: Math.random() > 0.5 ? '50%' : '0',
                          animationDuration: `${Math.random() * 2 + 1}s`,
                          animationDelay: `${Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">
                    {winner ? 
                      winner === 'Draw' ? "It's a Draw! 🤝" : 
                      `${getSymbol(winner)} Wins! ${winner === 'X' ? '🎉' : '🎊'}` :
                      `Current Player: ${getSymbol(currentPlayer)} ${aiThinking ? '(AI Thinking...)' : ''}`
                    }
                  </h2>
                </div>

                <div 
                  className={`grid gap-2 ${themeStyles.grid}`}
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    borderColor: boardTheme === 'custom' ? customColors.grid : undefined
                  }}
                >
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-16 h-16 border-2 ${themeStyles.cell} flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                          animationsEnabled ? 'transform hover:scale-105' : ''
                        } ${isCellInWinningLine(rowIndex, colIndex) ? 'bg-yellow-200 animate-pulse' : ''}`}
                        style={boardTheme === 'custom' ? { 
                          borderColor: customColors.grid,
                          color: cell === 'X' ? customColors.x : customColors.o 
                        } : {}}
                        onClick={() => makeMove(rowIndex, colIndex)}
                        disabled={!!winner || aiThinking || (gameMode === 'player-vs-ai' && currentPlayer === 'O')}
                      >
                        <span className={animationsEnabled && cell ? 'animate-scale-in' : ''}>
                          {getSymbol(cell)}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                <div className="flex gap-4">
                  <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                    🔄 New Game
                  </Button>
                  <Button onClick={resetStats} variant="outline">
                    📊 Reset Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>X Wins:</span>
                  <span className="font-bold">{gameStats.xWins}</span>
                </div>
                <div className="flex justify-between">
                  <span>O Wins:</span>
                  <span className="font-bold">{gameStats.oWins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Draws:</span>
                  <span className="font-bold">{gameStats.draws}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Games:</span>
                  <span className="font-bold">{gameStats.totalGames}</span>
                </div>
                {gameStats.totalGames > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-600">Win Rate</div>
                    <div className="text-sm">
                      X: {((gameStats.xWins / gameStats.totalGames) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm">
                      O: {((gameStats.oWins / gameStats.totalGames) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Strategy Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="animate-fade-in">
                  <h4 className="font-bold">Take the Center</h4>
                  <p className="text-gray-600">The center position provides the most winning opportunities</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h4 className="font-bold">Watch the Corners</h4>
                  <p className="text-gray-600">Corner positions can create diagonal winning threats</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">Block Immediate Threats</h4>
                  <p className="text-gray-600">Don't let your opponent create a line of two pieces without blocking</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <h4 className="font-bold">Create Forks</h4>
                  <p className="text-gray-600">Set up multiple winning opportunities at once</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Animations</span>
                  <Button
                    size="sm"
                    variant={animationsEnabled ? "default" : "outline"}
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  >
                    {animationsEnabled ? "✅" : "❌"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sound</span>
                  <Button
                    size="sm"
                    variant={soundEnabled ? "default" : "outline"}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? "🔊" : "🔇"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(var(--translate-x, -100px), var(--translate-y, 100px)) rotate(var(--rotate, 360deg)); }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
          --translate-x: ${Math.random() * 200 - 100}px;
          --translate-y: ${Math.random() * 200 - 100}px;
          --rotate: ${Math.random() * 360}deg;
        }
      `}</style>
    </div>
  );
};
