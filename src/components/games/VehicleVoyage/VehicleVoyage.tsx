
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, RotateCcw } from 'lucide-react';

interface Vehicle {
  name: string;
  emoji: string;
  category: 'land' | 'air' | 'water';
  sound: string;
  fact: string;
}

interface VehicleVoyageProps {
  onBack: () => void;
}

const vehicles: Vehicle[] = [
  { name: 'Car', emoji: '🚗', category: 'land', sound: 'Vroom vroom!', fact: 'Cars help families travel together!' },
  { name: 'Airplane', emoji: '✈️', category: 'air', sound: 'Whoosh!', fact: 'Airplanes can fly above the clouds!' },
  { name: 'Boat', emoji: '🚤', category: 'water', sound: 'Splash!', fact: 'Boats float on water!' },
  { name: 'Train', emoji: '🚂', category: 'land', sound: 'Choo choo!', fact: 'Trains carry many people at once!' },
  { name: 'Helicopter', emoji: '🚁', category: 'air', sound: 'Whirr whirr!', fact: 'Helicopters can hover in one place!' },
  { name: 'Ship', emoji: '🚢', category: 'water', sound: 'Toot toot!', fact: 'Big ships carry cargo across oceans!' },
  { name: 'Bus', emoji: '🚌', category: 'land', sound: 'Beep beep!', fact: 'Buses help many people travel together!' },
  { name: 'Submarine', emoji: '🛟', category: 'water', sound: 'Ping ping!', fact: 'Submarines travel underwater!' }
];

const categories = [
  { name: 'Land', emoji: '🛣️', color: 'bg-green-500' },
  { name: 'Air', emoji: '☁️', color: 'bg-blue-500' },
  { name: 'Water', emoji: '🌊', color: 'bg-cyan-500' }
];

export const VehicleVoyage: React.FC<VehicleVoyageProps> = ({ onBack }) => {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showFact, setShowFact] = useState(false);
  const [gameMode, setGameMode] = useState<'sort' | 'learn'>('sort');

  useEffect(() => {
    generateNewVehicle();
  }, []);

  const generateNewVehicle = () => {
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    setCurrentVehicle(randomVehicle);
    setFeedback('');
    setShowFact(false);
  };

  const speakVehicleSound = () => {
    if (currentVehicle && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        `${currentVehicle.name} goes ${currentVehicle.sound}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (!currentVehicle) return;

    const isCorrect = currentVehicle.category === categoryName.toLowerCase();
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback(`🎉 Correct! ${currentVehicle.name} travels on ${categoryName.toLowerCase()}!`);
      setShowFact(true);
      
      setTimeout(() => {
        generateNewVehicle();
        if (score > 0 && score % 50 === 40) {
          setLevel(prev => prev + 1);
        }
      }, 3000);
    } else {
      setFeedback(`❌ Try again! Think about where a ${currentVehicle.name} travels.`);
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🚗 Vehicle Voyage
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setGameMode(gameMode === 'sort' ? 'learn' : 'sort')}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              {gameMode === 'sort' ? 'Learn Mode' : 'Sort Mode'}
            </Button>
            <Button onClick={generateNewVehicle} className="bg-white/20 hover:bg-white/30 text-white">
              <RotateCcw className="w-4 h-4" />
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
                  <span className="font-bold">Level {level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">{score}</span>
                </div>
              </div>
              <span className="text-sm font-medium">Mode: {gameMode === 'sort' ? 'Sorting' : 'Learning'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Current Vehicle */}
        {currentVehicle && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {gameMode === 'sort' ? 'Where does this vehicle travel?' : 'Learn about this vehicle!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-4 cursor-pointer animate-bounce hover:scale-110 transition-transform"
                onClick={speakVehicleSound}
              >
                <span className="text-7xl">{currentVehicle.emoji}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{currentVehicle.name}</h3>
              <p className="text-lg text-gray-600 mb-2">Click to hear the sound!</p>
              <p className="text-xl font-semibold text-purple-600">{currentVehicle.sound}</p>
              
              {showFact && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300 animate-pulse">
                  <p className="text-lg font-medium text-blue-800">
                    💡 {currentVehicle.fact}
                  </p>
                </div>
              )}
              
              {feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <p className="text-lg font-medium">{feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        {gameMode === 'sort' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.name}
                className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`${category.color} rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4`}>
                    <span className="text-4xl">{category.emoji}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">{category.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Learn Mode - All Vehicles */}
        {gameMode === 'learn' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicles.map((vehicle, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
                onClick={() => setCurrentVehicle(vehicle)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{vehicle.emoji}</div>
                  <h4 className="font-bold text-gray-800">{vehicle.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{vehicle.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
