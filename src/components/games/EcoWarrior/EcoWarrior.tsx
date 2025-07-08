
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Recycle, Leaf, RotateCcw, Target } from 'lucide-react';
import { DraggableItem } from './components/DraggableItem';
import { DragDropZone } from './components/DragDropZone';
import { RecycleItem, Bin, GameState } from './types';

interface EcoWarriorProps {
  onBack: () => void;
}

const recycleItems: RecycleItem[] = [
  { 
    id: '1', 
    name: 'Plastic Bottle', 
    emoji: '🍼', 
    category: 'plastic', 
    color: 'bg-blue-400',
    fact: 'Plastic bottles can be recycled into new bottles or clothing!',
    tip: 'Remove caps and labels before recycling'
  },
  { 
    id: '2', 
    name: 'Newspaper', 
    emoji: '📰', 
    category: 'paper', 
    color: 'bg-yellow-400',
    fact: 'Recycled paper saves trees and reduces landfill waste!',
    tip: 'Keep paper dry and clean for best recycling'
  },
  { 
    id: '3', 
    name: 'Glass Jar', 
    emoji: '🫙', 
    category: 'glass', 
    color: 'bg-green-400',
    fact: 'Glass can be recycled infinitely without losing quality!',
    tip: 'Rinse containers and remove lids'
  },
  { 
    id: '4', 
    name: 'Soda Can', 
    emoji: '🥤', 
    category: 'metal', 
    color: 'bg-gray-400',
    fact: 'Aluminum cans can be recycled and back on shelves in 60 days!',
    tip: 'Rinse cans to remove food residue'
  },
  { 
    id: '5', 
    name: 'Apple Core', 
    emoji: '🍎', 
    category: 'organic', 
    color: 'bg-brown-400',
    fact: 'Organic waste becomes rich compost for growing plants!',
    tip: 'Compost fruit peels, vegetable scraps, and yard waste'
  },
  { 
    id: '6', 
    name: 'Cardboard Box', 
    emoji: '📦', 
    category: 'paper', 
    color: 'bg-yellow-400',
    fact: 'Cardboard is made from recycled paper and can be recycled again!',
    tip: 'Flatten boxes and remove tape and staples'
  },
  { 
    id: '7', 
    name: 'Wine Bottle', 
    emoji: '🍾', 
    category: 'glass', 
    color: 'bg-green-400',
    fact: 'Glass bottles can become new bottles, jars, or even road material!',
    tip: 'Remove cork and any plastic wrapping'
  },
  { 
    id: '8', 
    name: 'Tin Can', 
    emoji: '🥫', 
    category: 'metal', 
    color: 'bg-gray-400',
    fact: 'Steel cans are 100% recyclable and can become anything made of steel!',
    tip: 'Remove labels and rinse clean'
  }
];

const bins: Bin[] = [
  { 
    category: 'plastic', 
    name: 'Plastic Bin', 
    emoji: '♻️', 
    color: 'bg-blue-500',
    description: 'For bottles, containers, and plastic packaging',
    examples: ['Bottles', 'Food containers', 'Plastic bags', 'Toys']
  },
  { 
    category: 'paper', 
    name: 'Paper Bin', 
    emoji: '📄', 
    color: 'bg-yellow-500',
    description: 'For newspapers, magazines, and cardboard',
    examples: ['Newspapers', 'Magazines', 'Cardboard', 'Office paper']
  },
  { 
    category: 'glass', 
    name: 'Glass Bin', 
    emoji: '🫙', 
    color: 'bg-green-500',
    description: 'For bottles and jars made of glass',
    examples: ['Bottles', 'Jars', 'Drinking glasses', 'Windows']
  },
  { 
    category: 'metal', 
    name: 'Metal Bin', 
    emoji: '🥫', 
    color: 'bg-gray-500',
    description: 'For aluminum and steel cans',
    examples: ['Soda cans', 'Food cans', 'Bottle caps', 'Foil']
  },
  { 
    category: 'organic', 
    name: 'Compost Bin', 
    emoji: '🌱', 
    color: 'bg-brown-500',
    description: 'For food scraps and yard waste',
    examples: ['Fruit peels', 'Vegetable scraps', 'Leaves', 'Grass']
  }
];

export const EcoWarrior: React.FC<EcoWarriorProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    streak: 0,
    itemsRecycled: 0,
    correctCategories: [],
    showCelebration: false
  });
  
  const [gameItems, setGameItems] = useState<RecycleItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverBin, setDragOverBin] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [gameMode, setGameMode] = useState<'drag' | 'click'>('drag');

  useEffect(() => {
    generateNewRound();
  }, [gameState.level]);

  const generateNewRound = () => {
    // Generate 3-5 random items based on level
    const itemCount = Math.min(3 + gameState.level, 5);
    const shuffled = [...recycleItems].sort(() => Math.random() - 0.5);
    setGameItems(shuffled.slice(0, itemCount));
    setFeedback('');
  };

  const handleDragStart = (e: React.DragEvent, item: RecycleItem) => {
    setDraggedItem(item.id);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverBin(null);
  };

  const handleDragOver = (e: React.DragEvent, binCategory: string) => {
    e.preventDefault();
    setDragOverBin(binCategory);
  };

  const handleDragLeave = () => {
    setDragOverBin(null);
  };

  const handleDrop = (itemId: string, binCategory: string) => {
    const item = recycleItems.find(i => i.id === itemId);
    if (!item) return;

    const isCorrect = item.category === binCategory;
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 15,
        streak: prev.streak + 1,
        itemsRecycled: prev.itemsRecycled + 1,
        correctCategories: [...new Set([...prev.correctCategories, item.category])]
      }));
      
      setFeedback(`🎉 Perfect! ${item.fact} ${item.tip}`);
      
      // Remove the item from the game
      setGameItems(prev => prev.filter(gi => gi.id !== itemId));
      
      // Check for level up
      if ((gameState.streak + 1) % 5 === 0) {
        setGameState(prev => ({ ...prev, level: prev.level + 1, showCelebration: true }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, showCelebration: false }));
        }, 2000);
      }
      
      // Check if round is complete
      if (gameItems.length === 1) {
        setTimeout(generateNewRound, 2000);
      }
    } else {
      setGameState(prev => ({ ...prev, streak: 0 }));
      setFeedback(`❌ Try again! ${item.name} belongs in the ${item.category} bin. ${item.tip}`);
    }
    
    setDraggedItem(null);
    setDragOverBin(null);
  };

  const handleBinClick = (binCategory: string) => {
    if (gameMode !== 'click' || gameItems.length === 0) return;
    
    const item = gameItems[0]; // Use first item for click mode
    handleDrop(item.id, binCategory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-teal-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            ♻️ Eco Warrior
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Button 
              onClick={() => setGameMode(gameMode === 'drag' ? 'click' : 'drag')}
              className="bg-white/20 hover:bg-white/30 text-white text-sm"
            >
              {gameMode === 'drag' ? 'Switch to Click' : 'Switch to Drag'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Level {gameState.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold">{gameState.score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Streak: {gameState.streak}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Items to Sort: {gameItems.length}</div>
                <Progress value={(gameState.streak % 5) * 20} className="w-32 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Mode Instructions */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-bold text-blue-800 mb-2">
                {gameMode === 'drag' ? '🖱️ Drag & Drop Mode' : '👆 Click Mode'}
              </h3>
              <p className="text-blue-700">
                {gameMode === 'drag' 
                  ? 'Drag items to the correct recycling bins!' 
                  : 'Click the correct bin for each item!'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Game Items */}
        {gameMode === 'drag' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items to Sort */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-xl">Items to Sort</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {gameItems.map((item) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      isDragging={draggedItem === item.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
                {feedback && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    <p className="text-sm font-medium">{feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drop Zones */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-xl">Recycling Bins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bins.map((bin) => (
                    <div key={bin.category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{bin.emoji}</span>
                        <div>
                          <h4 className="font-bold">{bin.name}</h4>
                          <p className="text-xs text-gray-600">{bin.description}</p>
                        </div>
                      </div>
                      <DragDropZone
                        item={gameItems[0] || recycleItems[0]}
                        bin={bin}
                        onDrop={handleDrop}
                        isDragOver={dragOverBin === bin.category}
                        onDragOver={(e) => handleDragOver(e, bin.category)}
                        onDragLeave={handleDragLeave}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Click Mode */
          <div className="space-y-6">
            {gameItems.length > 0 && (
              <Card className="bg-white/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Sort This Item!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`${gameItems[0].color} rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4 animate-bounce`}>
                    <span className="text-6xl">{gameItems[0].emoji}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{gameItems[0].name}</h3>
                  <p className="text-lg text-gray-600">Which bin should this go in?</p>
                  
                  {feedback && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      <p className="text-lg font-medium">{feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recycling Bins */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bins.map((bin) => (
                <Card 
                  key={bin.category}
                  className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
                  onClick={() => handleBinClick(bin.category)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${bin.color} rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-3`}>
                      <span className="text-3xl">{bin.emoji}</span>
                    </div>
                    <h4 className="font-bold text-gray-800">{bin.name}</h4>
                    <p className="text-xs text-gray-600">{bin.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-xl text-green-800">🌍 Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl mb-2">♻️</div>
                <p className="font-semibold text-green-800">Items Recycled: {gameState.itemsRecycled}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl mb-2">🌱</div>
                <p className="font-semibold text-green-800">Categories Mastered: {gameState.correctCategories.length}/5</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl mb-2">🌟</div>
                <p className="font-semibold text-green-800">Eco Level: {gameState.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Celebration Modal */}
        {gameState.showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're becoming an Eco Warrior!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Leaf key={i} className="w-8 h-8 text-green-500 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
