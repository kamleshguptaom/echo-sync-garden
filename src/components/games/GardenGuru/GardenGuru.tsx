
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Droplets, Sun } from 'lucide-react';

interface GardenGuruProps {
  onBack: () => void;
}

interface Plant {
  name: string;
  emoji: string;
  stage: number;
  maxStage: number;
  waterLevel: number;
  sunLevel: number;
  isHealthy: boolean;
}

export const GardenGuru: React.FC<GardenGuruProps> = ({ onBack }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dayCount, setDayCount] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  const plantTypes = [
    { name: 'Sunflower', emoji: '🌻', stages: ['🌱', '🌿', '🌻'] },
    { name: 'Rose', emoji: '🌹', stages: ['🌱', '🪴', '🌹'] },
    { name: 'Tulip', emoji: '🌷', stages: ['🌱', '🌿', '🌷'] },
    { name: 'Cactus', emoji: '🌵', stages: ['🌱', '🌿', '🌵'] }
  ];

  useEffect(() => {
    initializeGarden();
  }, []);

  const initializeGarden = () => {
    const newPlants: Plant[] = [];
    for (let i = 0; i < 4; i++) {
      const plantType = plantTypes[i];
      newPlants.push({
        name: plantType.name,
        emoji: plantType.stages[0],
        stage: 0,
        maxStage: 2,
        waterLevel: 50,
        sunLevel: 50,
        isHealthy: true
      });
    }
    setPlants(newPlants);
  };

  const waterPlant = (index: number) => {
    setPlants(prev => prev.map((plant, i) => 
      i === index 
        ? { ...plant, waterLevel: Math.min(100, plant.waterLevel + 25) }
        : plant
    ));
  };

  const giveSunlight = (index: number) => {
    setPlants(prev => prev.map((plant, i) => 
      i === index 
        ? { ...plant, sunLevel: Math.min(100, plant.sunLevel + 25) }
        : plant
    ));
  };

  const nextDay = () => {
    setPlants(prev => prev.map((plant, plantIndex) => {
      const newWaterLevel = Math.max(0, plant.waterLevel - 20);
      const newSunLevel = Math.max(0, plant.sunLevel - 15);
      const isHealthy = newWaterLevel > 20 && newSunLevel > 20;
      
      let newStage = plant.stage;
      let newEmoji = plant.emoji;
      
      // Grow if healthy
      if (isHealthy && newWaterLevel > 60 && newSunLevel > 60 && plant.stage < plant.maxStage) {
        newStage = plant.stage + 1;
        newEmoji = plantTypes[plantIndex].stages[newStage];
        
        // Add score for growth
        setScore(prev => prev + 15);
      }
      
      return {
        ...plant,
        waterLevel: newWaterLevel,
        sunLevel: newSunLevel,
        isHealthy,
        stage: newStage,
        emoji: newEmoji
      };
    }));
    
    setDayCount(prev => prev + 1);
    
    // Check if all plants are fully grown
    const allFullyGrown = plants.every(plant => plant.stage >= plant.maxStage);
    if (allFullyGrown) {
      setFeedback('🎉 Amazing! All your plants are fully grown!');
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        initializeGarden(); // Start new garden
        setLevel(prev => prev + 1);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🌱 Garden Guru
          </h1>
          <div className="flex items-center gap-2 text-white">
            <span className="font-bold">Day {dayCount}</span>
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
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold">Level: {level}</span>
                </div>
              </div>
              <Button
                onClick={nextDay}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
              >
                🌅 Next Day
              </Button>
            </div>
          </CardContent>
        </Card>

        {feedback && (
          <Card className="mb-6 bg-green-100 border-green-300">
            <CardContent className="p-4 text-center">
              <p className="text-lg font-medium text-green-800">{feedback}</p>
            </CardContent>
          </Card>
        )}

        {/* Garden */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {plants.map((plant, index) => (
            <Card key={`${plant.name}-${index}`} className="bg-white/95 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">{plant.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* Plant Display */}
                <div className={`text-6xl mb-3 transition-all duration-500 ${
                  plant.isHealthy ? 'animate-bounce' : 'grayscale'
                }`}>
                  {plant.emoji}
                </div>
                
                {/* Health Status */}
                <div className={`text-sm font-medium mb-3 ${
                  plant.isHealthy ? 'text-green-600' : 'text-red-600'
                }`}>
                  {plant.isHealthy ? '💚 Healthy' : '💔 Needs Care'}
                </div>

                {/* Water Level */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>💧 Water</span>
                    <span>{plant.waterLevel}%</span>
                  </div>
                  <Progress value={plant.waterLevel} className="h-2" />
                </div>

                {/* Sun Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>☀️ Sun</span>
                    <span>{plant.sunLevel}%</span>
                  </div>
                  <Progress value={plant.sunLevel} className="h-2" />
                </div>

                {/* Care Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => waterPlant(index)}
                    disabled={plant.waterLevel >= 100}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Droplets className="w-4 h-4 mr-2" />
                    Water
                  </Button>
                  <Button
                    onClick={() => giveSunlight(index)}
                    disabled={plant.sunLevel >= 100}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Sunlight
                  </Button>
                </div>

                {/* Growth Stage */}
                <div className="mt-3 text-xs text-gray-500">
                  Stage {plant.stage + 1}/{plant.maxStage + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Panel */}
        <Card className="bg-green-100 border-green-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-green-800 mb-2">🌿 Gardening Tips:</h3>
            <ul className="text-green-700 space-y-1">
              <li>• Plants need water and sunlight to grow!</li>
              <li>• Check your plants every day</li>
              <li>• Healthy plants grow bigger and stronger</li>
              <li>• Different plants need different amounts of care</li>
            </ul>
          </CardContent>
        </Card>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🌻</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Garden Complete!</h3>
              <p className="text-xl text-gray-600">You're a Master Gardener!</p>
              <div className="flex justify-center mt-4 gap-2">
                {['🌱', '🌿', '🌸'].map((emoji, i) => (
                  <div key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                    {emoji}
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
