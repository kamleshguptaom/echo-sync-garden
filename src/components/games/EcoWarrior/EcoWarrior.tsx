
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Recycle, Leaf } from 'lucide-react';

interface RecycleItem {
  name: string;
  emoji: string;
  category: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic';
  color: string;
}

interface EcoWarriorProps {
  onBack: () => void;
}

const recycleItems: RecycleItem[] = [
  { name: 'Plastic Bottle', emoji: '🍼', category: 'plastic', color: 'bg-blue-400' },
  { name: 'Newspaper', emoji: '📰', category: 'paper', color: 'bg-yellow-400' },
  { name: 'Glass Jar', emoji: '🫙', category: 'glass', color: 'bg-green-400' },
  { name: 'Soda Can', emoji: '🥤', category: 'metal', color: 'bg-gray-400' },
  { name: 'Apple Core', emoji: '🍎', category: 'organic', color: 'bg-brown-400' },
  { name: 'Cardboard Box', emoji: '📦', category: 'paper', color: 'bg-yellow-400' },
  { name: 'Wine Bottle', emoji: '🍾', category: 'glass', color: 'bg-green-400' },
  { name: 'Tin Can', emoji: '🥫', category: 'metal', color: 'bg-gray-400' }
];

const bins = [
  { category: 'plastic', name: 'Plastic Bin', emoji: '♻️', color: 'bg-blue-500' },
  { category: 'paper', name: 'Paper Bin', emoji: '📄', color: 'bg-yellow-500' },
  { category: 'glass', name: 'Glass Bin', emoji: '🫙', color: 'bg-green-500' },
  { category: 'metal', name: 'Metal Bin', emoji: '🥫', color: 'bg-gray-500' },
  { category: 'organic', name: 'Compost Bin', emoji: '🌱', color: 'bg-brown-500' }
];

export const EcoWarrior: React.FC<EcoWarriorProps> = ({ onBack }) => {
  const [currentItem, setCurrentItem] = useState<RecycleItem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    generateNewItem();
  }, []);

  const generateNewItem = () => {
    const randomItem = recycleItems[Math.floor(Math.random() * recycleItems.length)];
    setCurrentItem(randomItem);
    setFeedback('');
  };

  const handleBinClick = (binCategory: string) => {
    if (!currentItem) return;

    const isCorrect = currentItem.category === binCategory;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setFeedback('🎉 Great job! You\'re helping save the planet!');
      
      if (streak > 0 && streak % 5 === 4) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setStreak(0);
      setFeedback('❌ Oops! Try again. Think about what material this is made of.');
    }

    setTimeout(() => {
      generateNewItem();
    }, 2000);
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
            <Leaf className="w-6 h-6" />
            <span className="font-bold">Streak: {streak}</span>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Level {level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold">{score}</span>
                </div>
              </div>
              <Progress value={(streak % 5) * 20} className="w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Current Item */}
        {currentItem && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Sort This Item!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`${currentItem.color} rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4 animate-bounce`}>
                <span className="text-6xl">{currentItem.emoji}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{currentItem.name}</h3>
              <p className="text-lg text-gray-600">Which bin should this go in?</p>
              
              {feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                  feedback.includes('Great') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
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
