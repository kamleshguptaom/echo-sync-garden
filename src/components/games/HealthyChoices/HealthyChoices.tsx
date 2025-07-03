
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Heart, RotateCcw } from 'lucide-react';

interface Food {
  name: string;
  emoji: string;
  category: 'healthy' | 'unhealthy';
  benefits?: string;
  warning?: string;
}

interface HealthyChoicesProps {
  onBack: () => void;
}

const foods: Food[] = [
  { name: 'Apple', emoji: '🍎', category: 'healthy', benefits: 'Full of vitamins and fiber!' },
  { name: 'Broccoli', emoji: '🥦', category: 'healthy', benefits: 'Makes your bones and muscles strong!' },
  { name: 'Candy', emoji: '🍭', category: 'unhealthy', warning: 'Too much sugar can hurt your teeth!' },
  { name: 'Carrot', emoji: '🥕', category: 'healthy', benefits: 'Great for your eyes and skin!' },
  { name: 'Burger', emoji: '🍔', category: 'unhealthy', warning: 'Too much can make you feel sluggish!' },
  { name: 'Banana', emoji: '🍌', category: 'healthy', benefits: 'Gives you energy to play!' },
  { name: 'Pizza', emoji: '🍕', category: 'unhealthy', warning: 'Better as an occasional treat!' },
  { name: 'Orange', emoji: '🍊', category: 'healthy', benefits: 'Vitamin C keeps you from getting sick!' },
  { name: 'Soda', emoji: '🥤', category: 'unhealthy', warning: 'Too much sugar and no nutrients!' },
  { name: 'Fish', emoji: '🐟', category: 'healthy', benefits: 'Helps your brain grow strong!' }
];

export const HealthyChoices: React.FC<HealthyChoicesProps> = ({ onBack }) => {
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [score, setScore] = useState(0);
  const [healthyCount, setHealthyCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    generateNewFood();
  }, []);

  const generateNewFood = () => {
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
    setFeedback('');
    setShowInfo(false);
  };

  const handleChoice = (choice: 'healthy' | 'unhealthy') => {
    if (!currentFood) return;

    const isCorrect = currentFood.category === choice;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      if (choice === 'healthy') {
        setHealthyCount(prev => prev + 1);
      }
      setFeedback(`🎉 Correct! ${currentFood.name} is ${choice}!`);
      setShowInfo(true);
      
      if (streak > 0 && streak % 5 === 4) {
        setLevel(prev => prev + 1);
      }
    } else {
      setStreak(0);
      setFeedback(`❌ Oops! ${currentFood.name} is actually ${currentFood.category}!`);
      setShowInfo(true);
    }

    setTimeout(() => {
      generateNewFood();
    }, 3000);
  };

  const speakFoodInfo = () => {
    if (currentFood && window.speechSynthesis) {
      const info = currentFood.category === 'healthy' 
        ? currentFood.benefits 
        : currentFood.warning;
      const utterance = new SpeechSynthesisUtterance(
        `${currentFood.name}. ${info}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-lime-500 to-emerald-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🥕 Healthy Choices
          </h1>
          <Button onClick={generateNewFood} className="bg-white/20 hover:bg-white/30 text-white">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Level {level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  <span className="font-bold">{healthyCount} Healthy</span>
                </div>
              </div>
              <span className="text-sm font-medium">Streak: {streak}</span>
            </div>
            <Progress value={(streak % 5) * 20} className="h-2" />
          </CardContent>
        </Card>

        {/* Current Food */}
        {currentFood && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Is this food healthy or unhealthy?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-4 cursor-pointer animate-bounce hover:scale-110 transition-transform"
                onClick={speakFoodInfo}
              >
                <span className="text-7xl">{currentFood.emoji}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">{currentFood.name}</h3>
              
              {!showInfo && (
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => handleChoice('healthy')}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl font-bold rounded-xl transform hover:scale-105"
                  >
                    💚 Healthy
                  </Button>
                  <Button
                    onClick={() => handleChoice('unhealthy')}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl font-bold rounded-xl transform hover:scale-105"
                  >
                    ❤️ Unhealthy
                  </Button>
                </div>
              )}
              
              {feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <p className="text-lg font-medium">{feedback}</p>
                </div>
              )}
              
              {showInfo && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                  <p className="text-lg font-medium text-blue-800">
                    💡 {currentFood.category === 'healthy' ? currentFood.benefits : currentFood.warning}
                  </p>
                  <p className="text-sm text-blue-600 mt-2">Click the food to hear more!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Health Tips */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-100 rounded-lg">
                <div className="text-3xl mb-2">🥗</div>
                <p className="font-semibold text-green-800">Eat colorful fruits and vegetables every day!</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <div className="text-3xl mb-2">💧</div>
                <p className="font-semibold text-blue-800">Drink plenty of water to stay hydrated!</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg">
                <div className="text-3xl mb-2">🏃</div>
                <p className="font-semibold text-yellow-800">Exercise and play to keep your body strong!</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <div className="text-3xl mb-2">😴</div>
                <p className="font-semibold text-purple-800">Get enough sleep to help your body grow!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
