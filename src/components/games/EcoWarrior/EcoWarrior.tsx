import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Recycle, Leaf, RotateCcw, Target, Volume2 } from 'lucide-react';
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
  },
  { 
    id: '9', 
    name: 'Plastic Bag', 
    emoji: '🛍️', 
    category: 'plastic', 
    color: 'bg-blue-400',
    fact: 'Plastic bags can be recycled at special collection points!',
    tip: 'Take to grocery stores with plastic bag recycling'
  },
  { 
    id: '10', 
    name: 'Magazine', 
    emoji: '📖', 
    category: 'paper', 
    color: 'bg-yellow-400',
    fact: 'Magazines can be recycled into new paper products!',
    tip: 'Remove any plastic wrapping first'
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
    description: 'For bottles, jars, and glass containers',
    examples: ['Bottles', 'Jars', 'Drinking glasses', 'Glass containers']
  },
  { 
    category: 'metal', 
    name: 'Metal Bin', 
    emoji: '🥫', 
    color: 'bg-gray-500',
    description: 'For cans, foil, and metal items',
    examples: ['Soda cans', 'Food cans', 'Aluminum foil', 'Metal containers']
  },
  { 
    category: 'organic', 
    name: 'Compost Bin', 
    emoji: '🌱', 
    color: 'bg-emerald-500',
    description: 'For food scraps and organic waste',
    examples: ['Fruit peels', 'Vegetable scraps', 'Coffee grounds', 'Yard waste']
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
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [shuffledItems, setShuffledItems] = useState<RecycleItem[]>([]);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({
    plastic: 0,
    paper: 0,
    glass: 0,
    metal: 0,
    organic: 0
  });
  const [binnedItems, setBinnedItems] = useState<Record<string, RecycleItem[]>>({
    plastic: [],
    paper: [],
    glass: [],
    metal: [],
    organic: []
  });

  useEffect(() => {
    // Shuffle items for variety
    const shuffled = [...recycleItems].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled.slice(0, 6)); // Show 6 items at a time
  }, [gameState.level]);

  const playSound = (type: 'success' | 'error' | 'encouragement') => {
    if (!window.speechSynthesis) return;
    
    const messages = {
      success: 'Great job! That\'s the correct bin!',
      error: 'Try again! Think about what material this item is made of.',
      encouragement: 'You\'re doing great! Keep protecting our planet!'
    };

    const utterance = new SpeechSynthesisUtterance(messages[type]);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleDragStart = (e: React.DragEvent, item: RecycleItem) => {
    setDraggedItem(item.id);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent, binCategory: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setActiveZone(binCategory);
  };

  const handleDragLeave = () => {
    setActiveZone(null);
  };

  const handleDrop = (e: React.DragEvent, binCategory: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = recycleItems.find(i => i.id === itemId);
    if (!item) return;

    const isCorrect = item.category === binCategory;

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + (10 * (prev.streak + 1)),
        streak: prev.streak + 1,
        itemsRecycled: prev.itemsRecycled + 1,
        correctCategories: [...new Set([...prev.correctCategories, binCategory])]
      }));
      
      setItemCounts(prev => ({
        ...prev,
        [binCategory]: prev[binCategory] + 1
      }));
      
      // Add item to bin visually
      setBinnedItems(prev => ({
        ...prev,
        [binCategory]: [...prev[binCategory], item]
      }));
      
      setFeedback(`🎉 Perfect! ${item.name} goes in ${binCategory}! ${item.fact}`);
      
      // Remove item from available items
      setShuffledItems(prev => prev.filter(i => i.id !== itemId));
      
      playSound('success');
      
      // Check for level completion
      if ((gameState.itemsRecycled + 1) % 5 === 0) {
        setGameState(prev => ({ 
          ...prev, 
          level: prev.level + 1,
          showCelebration: true
        }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, showCelebration: false }));
          // Add new items for next level
          const shuffled = [...recycleItems].sort(() => Math.random() - 0.5);
          setShuffledItems(shuffled.slice(0, 6));
        }, 3000);
      }
    } else {
      setGameState(prev => ({ ...prev, streak: 0 }));
      setFeedback(`❌ Oops! ${item.name} doesn't belong in ${binCategory}. ${item.tip}`);
      playSound('error');
    }

    setDraggedItem(null);
    setActiveZone(null);
  };

  const resetGame = () => {
    setGameState({
      level: 1,
      score: 0,
      streak: 0,
      itemsRecycled: 0,
      correctCategories: [],
      showCelebration: false
    });
    setItemCounts({ plastic: 0, paper: 0, glass: 0, metal: 0, organic: 0 });
    setBinnedItems({ plastic: [], paper: [], glass: [], metal: [], organic: [] });
    setFeedback('');
    const shuffled = [...recycleItems].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled.slice(0, 6));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white flex items-center gap-2 justify-center">
              ♻️ Eco Warrior
            </h1>
            <p className="text-white/90 text-lg">Save the planet, one item at a time! 🌍</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => playSound('encouragement')} className="bg-white/20 hover:bg-white/30 text-white">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button onClick={resetGame} className="bg-white/20 hover:bg-white/30 text-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-xl">{gameState.score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold">Level: {gameState.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Recycled: {gameState.itemsRecycled}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">Streak: {gameState.streak}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold">Categories: {gameState.correctCategories.length}/5</span>
                </div>
              </div>
            </div>
            <Progress value={(gameState.correctCategories.length / 5) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Items to Recycle - Single Row */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-2xl">🌍 Items to Recycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {shuffledItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  className={`min-w-[140px] ${item.color} rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                    draggedItem === item.id ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-2 animate-bounce">{item.emoji}</div>
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <p className="text-white/90 text-sm">Drag me to the right bin!</p>
                  </div>
                </div>
              ))}
            </div>
            {shuffledItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">🎉 All items sorted! Get ready for the next level!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recycling Bins - Single Row */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-2xl">♻️ Recycling Bins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {bins.map((bin) => (
                <div key={bin.category} className="space-y-3">
                  <div className={`${bin.color} rounded-lg p-4 text-center text-white relative overflow-hidden min-h-[200px]`}>
                    <div className="text-4xl mb-2 animate-bounce">{bin.emoji}</div>
                    <h3 className="font-bold text-lg">{bin.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{bin.description}</p>
                    
                    {/* Items in bin visual */}
                    <div className="mt-2 min-h-[60px] flex flex-wrap gap-1 justify-center">
                      {binnedItems[bin.category]?.map((item, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm animate-bounce backdrop-blur"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {item.emoji}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xs mt-2 font-bold bg-white/20 rounded-full py-1 px-2 inline-block">
                      Items: {itemCounts[bin.category]}
                    </p>
                  </div>
                  
                  {/* Enhanced Drop Zone */}
                  <div
                    onDrop={(e) => handleDrop(e, bin.category)}
                    onDragOver={(e) => handleDragOver(e, bin.category)}
                    onDragLeave={handleDragLeave}
                    className={`w-full h-20 border-4 border-dashed rounded-lg flex items-center justify-center transition-all duration-300 ${
                      activeZone === bin.category 
                        ? 'border-green-500 bg-green-100 scale-105 shadow-xl animate-pulse' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`text-3xl transition-transform ${
                      activeZone === bin.category ? 'scale-125 animate-bounce' : ''
                    }`}>
                      {activeZone === bin.category ? '✨' : '🗂️'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        {feedback && (
          <Card className="mt-6 bg-white/95 backdrop-blur">
            <CardContent className="p-4">
              <div className={`text-center p-4 rounded-lg ${
                feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="text-lg font-medium">{feedback}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eco Tips */}
        <Card className="mt-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-xl">🌱 Eco Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">♻️</div>
                <p><strong>Reduce:</strong> Use less and choose reusable items!</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🔄</div>
                <p><strong>Reuse:</strong> Find new ways to use old items!</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🌍</div>
                <p><strong>Recycle:</strong> Sort items into the right bins!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Celebration Modal */}
        {gameState.showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Level Complete!</h3>
              <p className="text-xl text-gray-600 mb-4">You're an amazing Eco Warrior!</p>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-500 fill-current animate-spin" />
                ))}
              </div>
              <p className="text-lg">🌍 Thanks for saving our planet!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};