import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { ItemCard } from './components/ItemCard';
import { RecycleBin } from './components/RecycleBin';
import { SoundControl } from './components/SoundControl';
import { useGameLogic } from './hooks/useGameLogic';
import { RecycleItem } from './types';

interface EcoWarriorProps {
  onBack: () => void;
}

export const EcoWarrior: React.FC<EcoWarriorProps> = ({ onBack }) => {
  const {
    gameState,
    bins,
    currentItems,
    selectedItem,
    setSelectedItem,
    handleItemDrop,
    toggleSound,
    resetGame
  } = useGameLogic();

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const handleDragStart = (e: React.DragEvent, item: RecycleItem) => {
    setDraggedItem(item.id);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setActiveZone(null);
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setActiveZone(category);
  };

  const handleDragLeave = () => {
    setActiveZone(null);
  };

  const handleDrop = (itemId: string, binCategory: string) => {
    const item = currentItems.find(i => i.id === itemId);
    if (!item) return;

    const isCorrect = item.category === binCategory;
    
    if (isCorrect) {
      setFeedback(`🎉 Perfect! ${item.name} belongs in ${binCategory} recycling! ${item.fact}`);
    } else {
      setFeedback(`❌ Not quite! ${item.name} belongs in ${item.category} recycling. ${item.tip}`);
    }

    handleItemDrop(itemId, binCategory);
    
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            ♻️ Eco Warrior
          </h1>
          <div className="flex items-center gap-2">
            <SoundControl soundEnabled={gameState.soundEnabled} onToggleSound={toggleSound} />
            <Button onClick={resetGame} variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-lg">Level {gameState.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-lg">{gameState.score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-lg">Streak: {gameState.streak}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Items Recycled: {gameState.itemsRecycled}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Level Progress</p>
                <Progress value={(gameState.itemsRecycled % 5) * 20} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items to Recycle */}
        <Card className="mb-6 bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-800">
              🌍 Items to Recycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isDragging={draggedItem === item.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onClick={setSelectedItem}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recycling Bins */}
        <Card className="mb-6 bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-800">
              🗂️ Recycling Bins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bins.map((bin) => (
                <RecycleBin
                  key={bin.category}
                  bin={bin}
                  onDrop={handleDrop}
                  isDragOver={activeZone === bin.category}
                  onDragOver={(e) => handleDragOver(e, bin.category)}
                  onDragLeave={handleDragLeave}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {feedback && (
          <Card className={`mb-6 border-0 shadow-xl ${
            feedback.includes('Perfect') ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <CardContent className="p-4">
              <p className={`text-center font-medium text-lg ${
                feedback.includes('Perfect') ? 'text-green-800' : 'text-orange-800'
              }`}>
                {feedback}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Item Info Panel */}
        {selectedItem && (
          <Card className="bg-blue-50 border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-xl text-blue-800">
                Learn About This Item
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedItem.name}</h3>
              <div className={`inline-block px-4 py-2 rounded-full text-white font-medium mb-4 ${selectedItem.color}`}>
                Goes in {selectedItem.category} recycling
              </div>
              <div className="space-y-2">
                <p className="text-lg text-blue-700">💡 {selectedItem.fact}</p>
                <p className="text-base text-blue-600">💭 {selectedItem.tip}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Celebration Modal */}
        {gameState.showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce shadow-2xl">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're an amazing Eco Warrior!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-3xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                    ♻️
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};