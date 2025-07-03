
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy } from 'lucide-react';

interface MagnetMagicProps {
  onBack: () => void;
}

interface MagnetItem {
  name: string;
  emoji: string;
  isMagnetic: boolean;
  material: string;
}

const items: MagnetItem[] = [
  { name: 'Iron Nail', emoji: '📍', isMagnetic: true, material: 'iron' },
  { name: 'Plastic Toy', emoji: '🧸', isMagnetic: false, material: 'plastic' },
  { name: 'Wooden Spoon', emoji: '🥄', isMagnetic: false, material: 'wood' },
  { name: 'Steel Can', emoji: '🥫', isMagnetic: true, material: 'steel' },
  { name: 'Glass Bottle', emoji: '🍾', isMagnetic: false, material: 'glass' },
  { name: 'Copper Coin', emoji: '🪙', isMagnetic: false, material: 'copper' },
  { name: 'Iron Key', emoji: '🗝️', isMagnetic: true, material: 'iron' },
  { name: 'Paper', emoji: '📄', isMagnetic: false, material: 'paper' }
];

export const MagnetMagic: React.FC<MagnetMagicProps> = ({ onBack }) => {
  const [currentItem, setCurrentItem] = useState<MagnetItem | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [magnetPosition, setMagnetPosition] = useState({ x: 50, y: 50 });
  const [isAttracting, setIsAttracting] = useState(false);

  useEffect(() => {
    generateNewItem();
  }, []);

  const generateNewItem = () => {
    const item = items[Math.floor(Math.random() * items.length)];
    setCurrentItem(item);
    setFeedback('');
    setIsAttracting(false);
    setMagnetPosition({ x: 50, y: 50 });
  };

  const handleMagnetChoice = (willAttract: boolean) => {
    if (!currentItem) return;

    if (willAttract === currentItem.isMagnetic) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setIsAttracting(currentItem.isMagnetic);
      
      if (currentItem.isMagnetic) {
        setFeedback(`🧲 Yes! ${currentItem.name} is magnetic because it contains ${currentItem.material}!`);
        // Animate attraction
        setMagnetPosition({ x: 20, y: 30 });
      } else {
        setFeedback(`✅ Correct! ${currentItem.name} is not magnetic because ${currentItem.material} doesn't stick to magnets!`);
      }
      
      if (streak > 0 && streak % 5 === 4) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      setTimeout(generateNewItem, 3000);
    } else {
      setStreak(0);
      setFeedback(`Try again! Think about what ${currentItem.name} is made of.`);
    }
  };

  if (!currentItem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🧲 Magnet Magic
          </h1>
          <div className="flex items-center gap-2 text-white">
            <span className="font-bold">Level {level}</span>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-red-500" />
                  <span className="font-bold">Streak: {streak}</span>
                </div>
              </div>
              <Progress value={(streak % 5) * 20} className="w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Experiment Area */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Will this stick to a magnet?
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Interactive Area */}
            <div className="relative bg-gray-100 rounded-lg h-80 mb-6 overflow-hidden">
              {/* Magnet */}
              <div 
                className="absolute w-20 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-1000"
                style={{
                  left: `${magnetPosition.x}%`,
                  top: `${magnetPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🧲
              </div>
              
              {/* Item */}
              <div 
                className={`absolute w-24 h-24 flex items-center justify-center text-6xl transition-all duration-1000 ${
                  isAttracting ? 'transform scale-110' : ''
                }`}
                style={{
                  right: `${isAttracting ? '70%' : '20%'}`,
                  top: '40%',
                  transform: `translate(50%, -50%) ${isAttracting ? 'scale(1.1)' : 'scale(1)'}`
                }}
              >
                {currentItem.emoji}
              </div>
              
              {/* Magnetic field lines when attracting */}
              {isAttracting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl animate-ping">✨</div>
                  <div className="text-4xl animate-ping animation-delay-200">⚡</div>
                  <div className="text-4xl animate-ping animation-delay-400">✨</div>
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{currentItem.name}</h3>
              <p className="text-lg text-gray-600">Made of: {currentItem.material}</p>
            </div>

            {/* Choice Buttons */}
            <div className="flex justify-center gap-6 mb-6">
              <Button
                onClick={() => handleMagnetChoice(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl"
              >
                🧲 Will Stick!
              </Button>
              <Button
                onClick={() => handleMagnetChoice(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
              >
                ❌ Won't Stick!
              </Button>
            </div>

            {feedback && (
              <div className={`p-3 rounded-lg text-center ${
                feedback.includes('Yes!') || feedback.includes('Correct!') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                <p className="text-lg font-medium">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Panel */}
        <Card className="bg-blue-100 border-blue-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-2">🔬 Science Fact:</h3>
            <p className="text-blue-700">
              Magnets attract objects made of iron, steel, nickel, and cobalt. 
              They don't attract wood, plastic, glass, or most other materials!
            </p>
          </CardContent>
        </Card>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🧲</div>
              <h3 className="text-3xl font-bold text-red-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're a Magnet Scientist!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
