import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Play, RotateCcw, ChevronRight } from 'lucide-react';

interface CodingAdventureProps {
  onBack: () => void;
}

type CommandType = 'move' | 'turn' | 'action' | 'loop';

interface Command {
  id: string;
  type: CommandType;
  action: string;
  icon: string;
  color: string;
}

interface Level {
  id: number;
  title: string;
  description: string;
  grid: string[][];
  playerStart: { x: number; y: number };
  goal: { x: number; y: number };
  collectibles: { x: number; y: number }[];
  maxCommands: number;
}

const CodingAdventure: React.FC<CodingAdventureProps> = ({ onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequence, setSequence] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [playerDirection, setPlayerDirection] = useState(0); // 0: right, 1: down, 2: left, 3: up
  const [collected, setCollected] = useState<{x: number, y: number}[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [score, setScore] = useState(0);

  const availableCommands: Command[] = [
    { id: 'move', type: 'move', action: 'Move Forward', icon: '→', color: 'bg-blue-500' },
    { id: 'turn-right', type: 'turn', action: 'Turn Right', icon: '↻', color: 'bg-green-500' },
    { id: 'turn-left', type: 'turn', action: 'Turn Left', icon: '↺', color: 'bg-yellow-500' },
    { id: 'collect', type: 'action', action: 'Collect', icon: '✋', color: 'bg-purple-500' },
    { id: 'loop-2', type: 'loop', action: 'Repeat 2x', icon: '2⟲', color: 'bg-red-500' },
    { id: 'loop-3', type: 'loop', action: 'Repeat 3x', icon: '3⟲', color: 'bg-red-500' }
  ];

  const levels: Level[] = [
    {
      id: 1,
      title: "First Steps",
      description: "Move the robot to the goal",
      grid: [
        ['·', '·', '·', '·', '·'],
        ['·', '·', '·', '·', '·'],
        ['·', '·', '·', '·', '·']
      ],
      playerStart: { x: 0, y: 1 },
      goal: { x: 4, y: 1 },
      collectibles: [],
      maxCommands: 5
    },
    {
      id: 2,
      title: "Turn and Move",
      description: "Navigate around obstacles",
      grid: [
        ['·', '·', '·', '·', '·'],
        ['·', '█', '█', '·', '·'],
        ['·', '·', '·', '·', '·']
      ],
      playerStart: { x: 0, y: 0 },
      goal: { x: 4, y: 2 },
      collectibles: [],
      maxCommands: 8
    },
    {
      id: 3,
      title: "Collect Gems",
      description: "Collect all gems before reaching the goal",
      grid: [
        ['·', '·', '·', '·', '·'],
        ['·', '·', '·', '·', '·'],
        ['·', '·', '·', '·', '·']
      ],
      playerStart: { x: 0, y: 1 },
      goal: { x: 4, y: 1 },
      collectibles: [{ x: 2, y: 1 }, { x: 3, y: 1 }],
      maxCommands: 8
    },
    {
      id: 4,
      title: "Loop Challenge",
      description: "Use loops to optimize your solution",
      grid: [
        ['·', '·', '·', '·', '·', '·'],
        ['·', '·', '·', '·', '·', '·'],
        ['·', '·', '·', '·', '·', '·']
      ],
      playerStart: { x: 0, y: 1 },
      goal: { x: 5, y: 1 },
      collectibles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }],
      maxCommands: 4
    }
  ];

  const currentLevelData = levels.find(l => l.id === currentLevel) || levels[0];

  const playSound = useCallback((type: 'move' | 'collect' | 'success' | 'error') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'move':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        break;
      case 'collect':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  const resetLevel = useCallback(() => {
    setPlayerPos(currentLevelData.playerStart);
    setPlayerDirection(0);
    setCollected([]);
    setGameState('playing');
    setIsRunning(false);
  }, [currentLevelData.playerStart]);

  useEffect(() => {
    resetLevel();
  }, [currentLevel, resetLevel]);

  const addCommand = (command: Command) => {
    if (sequence.length < currentLevelData.maxCommands) {
      setSequence(prev => [...prev, { ...command, id: `${command.id}-${Date.now()}` }]);
    }
  };

  const removeCommand = (index: number) => {
    setSequence(prev => prev.filter((_, i) => i !== index));
  };

  const clearSequence = () => {
    setSequence([]);
  };

  const executeCommands = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    resetLevel();
    
    let currentPos = { ...currentLevelData.playerStart };
    let currentDir = 0;
    let currentCollected: {x: number, y: number}[] = [];
    
    const directions = [
      { x: 1, y: 0 },  // right
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 0, y: -1 }  // up
    ];

    for (const command of sequence) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (command.type === 'move') {
        const dir = directions[currentDir];
        const newPos = {
          x: currentPos.x + dir.x,
          y: currentPos.y + dir.y
        };
        
        // Check bounds and obstacles
        if (newPos.x >= 0 && newPos.x < currentLevelData.grid[0].length &&
            newPos.y >= 0 && newPos.y < currentLevelData.grid.length &&
            currentLevelData.grid[newPos.y][newPos.x] !== '█') {
          currentPos = newPos;
          setPlayerPos(currentPos);
          playSound('move');
        } else {
          playSound('error');
          setGameState('failed');
          setIsRunning(false);
          return;
        }
      } else if (command.type === 'turn') {
        if (command.id.includes('right')) {
          currentDir = (currentDir + 1) % 4;
        } else {
          currentDir = (currentDir + 3) % 4;
        }
        setPlayerDirection(currentDir);
      } else if (command.type === 'action' && command.id === 'collect') {
        const collectible = currentLevelData.collectibles.find(c => 
          c.x === currentPos.x && c.y === currentPos.y
        );
        if (collectible && !currentCollected.some(cc => cc.x === collectible.x && cc.y === collectible.y)) {
          currentCollected.push(collectible);
          setCollected([...currentCollected]);
          playSound('collect');
        }
      }
    }
    
    // Check win condition
    const allCollected = currentLevelData.collectibles.every(c =>
      currentCollected.some(cc => cc.x === c.x && cc.y === c.y)
    );
    
    if (currentPos.x === currentLevelData.goal.x && 
        currentPos.y === currentLevelData.goal.y && 
        allCollected) {
      setGameState('success');
      setScore(prev => prev + (currentLevelData.maxCommands - sequence.length + 1) * 10);
      playSound('success');
    } else {
      setGameState('failed');
      playSound('error');
    }
    
    setIsRunning(false);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(prev => prev + 1);
      setSequence([]);
    }
  };

  const getPlayerIcon = () => {
    const icons = ['🤖', '🤖', '🤖', '🤖'];
    return icons[playerDirection];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 text-white border-white/30">
            ← Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🤖 Coding Adventure</h1>
            <p className="text-white/90">Program the robot to complete challenges</p>
          </div>
          
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline"
            className="bg-white/20 text-white border-white/30"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </Button>
        </div>

        {/* Level Info */}
        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Level {currentLevel}: {currentLevelData.title}</CardTitle>
                <p className="text-gray-600">{currentLevelData.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">Score: {score}</div>
                <Badge variant="outline">
                  Commands: {sequence.length}/{currentLevelData.maxCommands}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Game Grid */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>Game World</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 p-4 bg-gray-100 rounded-lg">
                {currentLevelData.grid.map((row, y) => (
                  <div key={y} className="flex gap-2">
                    {row.map((cell, x) => {
                      const isPlayer = playerPos.x === x && playerPos.y === y;
                      const isGoal = currentLevelData.goal.x === x && currentLevelData.goal.y === y;
                      const hasCollectible = currentLevelData.collectibles.some(c => c.x === x && c.y === y);
                      const isCollected = collected.some(c => c.x === x && c.y === y);
                      
                      return (
                        <div
                          key={x}
                          className={`
                            w-12 h-12 flex items-center justify-center text-lg font-bold rounded
                            ${cell === '█' ? 'bg-gray-800 text-white' : 'bg-white border-2'}
                            ${isGoal ? 'border-green-500 bg-green-100' : 'border-gray-300'}
                          `}
                        >
                          {isPlayer && getPlayerIcon()}
                          {!isPlayer && isGoal && '🎯'}
                          {!isPlayer && hasCollectible && !isCollected && '💎'}
                          {cell === '█' && '🧱'}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={executeCommands} 
                  disabled={isRunning || sequence.length === 0}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Play size={16} className="mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                
                <Button 
                  onClick={resetLevel}
                  variant="outline"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </Button>
                
                <Button 
                  onClick={clearSequence}
                  variant="outline"
                >
                  Clear Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Programming Panel */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>Programming Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Available Commands */}
              <div>
                <h3 className="font-semibold mb-2">Available Commands:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableCommands.map((command) => (
                    <Button
                      key={command.id}
                      onClick={() => addCommand(command)}
                      disabled={sequence.length >= currentLevelData.maxCommands}
                      className={`${command.color} text-white hover:opacity-80 text-xs p-2 h-auto`}
                    >
                      <div className="text-center">
                        <div className="text-lg">{command.icon}</div>
                        <div>{command.action}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Command Sequence */}
              <div>
                <h3 className="font-semibold mb-2">Your Code:</h3>
                <div className="min-h-[200px] bg-gray-100 rounded-lg p-3">
                  {sequence.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      Add commands above to build your program
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sequence.map((command, index) => (
                        <div
                          key={command.id}
                          className="flex items-center justify-between bg-white rounded p-2 border"
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{command.icon}</span>
                            <span className="text-sm">{command.action}</span>
                          </div>
                          <Button
                            onClick={() => removeCommand(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Modal */}
        {gameState === 'success' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white max-w-md mx-4">
              <CardContent className="text-center p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Level Complete!</h2>
                <p className="text-gray-600 mb-4">
                  Great job! You solved it in {sequence.length} commands.
                </p>
                <div className="flex gap-4 justify-center">
                  {currentLevel < levels.length ? (
                    <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600 text-white">
                      Next Level <ChevronRight size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <div className="text-lg font-bold text-purple-600">
                      🏆 All levels complete!
                    </div>
                  )}
                  <Button onClick={() => setGameState('playing')} variant="outline">
                    Replay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Failure Modal */}
        {gameState === 'failed' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white max-w-md mx-4">
              <CardContent className="text-center p-8">
                <div className="text-6xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Try Again!</h2>
                <p className="text-gray-600 mb-4">
                  The robot couldn't complete the task. Check your code and try again!
                </p>
                <Button onClick={() => setGameState('playing')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingAdventure;