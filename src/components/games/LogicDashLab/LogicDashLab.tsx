
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState, GameItem, GameRule } from './types';
import { gameLevels, worlds } from './gameData';
import { DragDropItem } from './components/DragDropItem';
import { LogicBlockBuilder } from './components/LogicBlockBuilder';
import { DropZone } from './components/DropZone';

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
  const [selectedRule, setSelectedRule] = useState<GameRule | null>(null);

  const currentLevel = gameLevels[gameState.currentLevel];

  useEffect(() => {
    setGameItems(currentLevel.items);
    setHealthyBasket([]);
    setTrashBasket([]);
    setSelectedRule(null);
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
    const isCorrectDrop = checkLogic(item, zoneId);

    if (isCorrectDrop) {
      // Correct drop
      if (zoneId === 'healthy') {
        setHealthyBasket(prev => [...prev, item]);
      } else {
        setTrashBasket(prev => [...prev, item]);
      }
      setGameItems(prev => prev.filter(i => i.id !== item.id));
      setGameState(prev => ({ ...prev, score: prev.score + 10 }));
    } else {
      // Wrong drop
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      // Add shake animation or feedback here
    }
  };

  const checkLogic = (item: GameItem, zoneId: string): boolean => {
    if (!selectedRule) return false;

    // Implement logic checking based on selected rule
    if (selectedRule.id === 'fruit-red') {
      return item.category === 'fruit' && item.color === 'red' && zoneId === 'healthy';
    }
    if (selectedRule.id === 'junk-food') {
      return item.category === 'junk' && zoneId === 'trash';
    }
    if (selectedRule.id === 'green-vegetable') {
      return item.category === 'vegetable' && item.color === 'green' && zoneId === 'healthy';
    }
    
    return false;
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
  };

  const isLevelComplete = gameItems.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🧩 Logic Dash Lab
          </h1>
          <div className="text-white font-bold">
            Score: {gameState.score}
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
              <span>Difficulty: {currentLevel.difficulty}</span>
              <span>Mistakes: {gameState.mistakes}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logic Builder */}
          <div className="lg:col-span-1">
            <LogicBlockBuilder
              rules={currentLevel.rules}
              onRuleSelect={setSelectedRule}
              selectedRule={selectedRule}
              showExplanation={gameState.showExplanation}
              onToggleExplanation={() => setGameState(prev => ({ 
                ...prev, 
                showExplanation: !prev.showExplanation 
              }))}
            />
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur rounded-lg p-6 min-h-96">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🛒 Shopping Area</h3>
              
              {/* Items */}
              <div className="relative mb-6 min-h-32 bg-gray-50 rounded-lg p-4">
                {gameItems.map((item) => (
                  <DragDropItem
                    key={item.id}
                    item={item}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={gameState.draggedItem?.id === item.id}
                  />
                ))}
              </div>

              {/* Drop Zones */}
              <div className="flex gap-4 justify-center">
                <DropZone
                  id="healthy"
                  title="Healthy Basket"
                  emoji="🥗"
                  color="bg-green-100"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  items={healthyBasket}
                  isCorrectZone={selectedRule?.action.includes('healthy') || false}
                />
                <DropZone
                  id="trash"
                  title="Trash Bin"
                  emoji="🗑️"
                  color="bg-red-100"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  items={trashBasket}
                  isCorrectZone={selectedRule?.action.includes('trash') || false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Level Complete */}
        {isLevelComplete && (
          <Card className="mt-6 bg-green-100 border-green-500">
            <CardContent className="text-center py-6">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Level Complete!</h3>
              <p className="text-green-700 mb-4">Great job! You sorted all items correctly!</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetLevel} variant="outline">
                  Try Again
                </Button>
                {gameState.currentLevel < gameLevels.length - 1 && (
                  <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600">
                    Next Level
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
