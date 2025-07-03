import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState, GameItem } from './types';
import { gameLevels, worlds } from './gameData';
import { DragDropItem } from './components/DragDropItem';
import { DropZone } from './components/DropZone';
import { HowToPlayDialog } from './components/HowToPlayDialog';
import { HintPanel } from './components/HintPanel';

interface LogicDashLabProps {
  onBack: () => void;
}

export const LogicDashLab: React.FC<LogicDashLabProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    score: 0,
    completedLevels: [],
    logicBlocks: [],
    draggedItem: null,
    showHint: false,
    showExplanation: false,
    mistakes: 0,
    timer: 0
  });

  const [gameItems, setGameItems] = useState<GameItem[]>(gameLevels[0].items);
  const [healthyBasket, setHealthyBasket] = useState<GameItem[]>([]);
  const [trashBasket, setTrashBasket] = useState<GameItem[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentLevel = gameLevels[gameState.currentLevel];

  // Dynamic basket name based on level
  const getBasketName = () => {
    switch (currentLevel.world) {
      case 'Grocery Dash':
      case 'Kitchen Creator':
        return 'Healthy Basket';
      case 'School Zone':
        return 'School Bag';
      case 'Bathroom Zone':
        return 'Hygiene Kit';
      case 'Bedroom Zone':
        return 'Bedtime Box';
      case 'Eco Zone':
        return 'Recycle Bin';
      case 'Math Zone':
        return 'Keep Box';
      default:
        return 'Good Items';
    }
  };

  const getBasketEmoji = () => {
    switch (currentLevel.world) {
      case 'Grocery Dash':
      case 'Kitchen Creator':
        return '🥗';
      case 'School Zone':
      case 'Math Zone':
        return '🎒';
      case 'Bathroom Zone':
        return '🧴';
      case 'Bedroom Zone':
        return '📦';
      case 'Eco Zone':
        return '♻️';
      default:
        return '✅';
    }
  };

  useEffect(() => {
    setGameItems(currentLevel.items);
    setHealthyBasket([]);
    setTrashBasket([]);
  }, [gameState.currentLevel]);

  const handleDragStart = (item: GameItem) => {
    setGameState(prev => ({ ...prev, draggedItem: item }));
  };

  const handleDragEnd = () => {
    setGameState(prev => ({ ...prev, draggedItem: null }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (zoneId: string) => {
    if (!gameState.draggedItem) return;

    const item = gameState.draggedItem;
    const isCorrectDrop = (item.isHealthy && zoneId === 'healthy') || (!item.isHealthy && zoneId === 'trash');

    if (isCorrectDrop) {
      // Correct drop
      if (zoneId === 'healthy') {
        setHealthyBasket(prev => [...prev, item]);
      } else {
        setTrashBasket(prev => [...prev, item]);
      }
      setGameItems(prev => prev.filter(i => i.id !== item.id));
      setGameState(prev => ({ ...prev, score: prev.score + 10 }));
      
      setShowFeedback({ type: 'success', message: `Great job! ${item.name} is ${item.isHealthy ? 'healthy' : 'unhealthy'}!` });
      setTimeout(() => setShowFeedback(null), 2000);
    } else {
      // Wrong drop - animated error message
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      setShowFeedback({ 
        type: 'error', 
        message: `Oops! ${item.name} should go in the ${item.isHealthy ? getBasketName() : 'trash bin'}!` 
      });
      // Vanish error message after exactly 1 second
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  const nextLevel = () => {
    if (gameState.currentLevel < gameLevels.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        completedLevels: [...prev.completedLevels, prev.currentLevel]
      }));
    }
  };

  const resetLevel = () => {
    setGameItems(currentLevel.items);
    setHealthyBasket([]);
    setTrashBasket([]);
    setGameState(prev => ({ 
      ...prev, 
      mistakes: 0, 
      draggedItem: null,
      showHint: false 
    }));
    setShowFeedback(null);
  };

  const isLevelComplete = gameItems.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🧩 Logic Dash Lab
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowHowToPlay(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              ❓ How to Play
            </Button>
            <div className="text-white font-bold bg-white/20 px-4 py-2 rounded-lg">
              Score: {gameState.score}
            </div>
          </div>
        </div>

        {/* Level Info */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{worlds.find(w => w.name === currentLevel.world)?.emoji}</span>
              Level {gameState.currentLevel + 1}: {currentLevel.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">{currentLevel.description}</p>
            <div className="flex gap-4 text-sm">
              <span>World: {currentLevel.world}</span>
              <span>Items to sort: {gameItems.length}</span>
              <span>Mistakes: {gameState.mistakes}</span>
            </div>
          </CardContent>
        </Card>

        {/* Animated Feedback Message */}
        {showFeedback && (
          <div className={`
            mb-4 p-4 rounded-lg text-center font-bold transform transition-all duration-300
            ${showFeedback.type === 'success' 
              ? 'bg-green-100 text-green-800 border-2 border-green-300 animate-bounce' 
              : 'bg-red-100 text-red-800 border-2 border-red-300 animate-pulse scale-105'
            }
          `}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">
                {showFeedback.type === 'success' ? '🎉' : '❌'}
              </span>
              {showFeedback.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Hint Panel */}
          <div className="lg:col-span-1">
            <HintPanel 
              isVisible={gameState.showHint}
              onToggle={() => setGameState(prev => ({ ...prev, showHint: !prev.showHint }))}
              currentItems={gameItems}
            />
          </div>

          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 min-h-96">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🛒 Items to Sort</h3>
              
              {/* Items Grid */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg min-h-32">
                {gameItems.map((item) => (
                  <DragDropItem
                    key={item.id}
                    item={item}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={gameState.draggedItem?.id === item.id}
                  />
                ))}
                {gameItems.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    All items sorted! 🎉
                  </div>
                )}
              </div>

              {/* Drop Zones with Dynamic Names */}
              <div className="flex gap-6 justify-center">
                <DropZone
                  id="healthy"
                  title={getBasketName()}
                  emoji={getBasketEmoji()}
                  color="bg-green-100"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  items={healthyBasket}
                  isCorrectZone={true}
                />
                <DropZone
                  id="trash"
                  title="Trash Bin"
                  emoji="🗑️"
                  color="bg-red-100"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  items={trashBasket}
                  isCorrectZone={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Level Complete */}
        {isLevelComplete && (
          <Card className="mt-6 bg-green-100 border-green-500">
            <CardContent className="text-center py-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-800 mb-2">Level Complete!</h3>
              <p className="text-green-700 mb-4">Fantastic! You sorted all the items correctly!</p>
              <p className="text-sm text-green-600 mb-4">
                Score: {gameState.score} points | Mistakes: {gameState.mistakes}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetLevel} variant="outline">
                  Try Again
                </Button>
                {gameState.currentLevel < gameLevels.length - 1 && (
                  <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600">
                    Next Level →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <HowToPlayDialog 
          isOpen={showHowToPlay} 
          onClose={() => setShowHowToPlay(false)} 
        />
      </div>
    </div>
  );
};
