
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Droplets, Sun, Flower } from 'lucide-react';

interface GardenGuruProps {
  onBack: () => void;
}

interface Plant {
  id: string;
  name: string;
  emoji: string;
  stage: 'seed' | 'sprout' | 'growing' | 'flowering' | 'mature';
  water: number;
  sunlight: number;
  happiness: number;
  daysGrown: number;
}

const plantTypes = [
  { name: 'Sunflower', emoji: '🌻', waterNeed: 70, sunNeed: 90, growthTime: 5 },
  { name: 'Rose', emoji: '🌹', waterNeed: 60, sunNeed: 80, growthTime: 7 },
  { name: 'Tulip', emoji: '🌷', waterNeed: 50, sunNeed: 70, growthTime: 4 },
  { name: 'Daisy', emoji: '🌼', waterNeed: 40, sunNeed: 75, growthTime: 3 }
];

const stageEmojis = {
  seed: '🌰',
  sprout: '🌱',
  growing: '🌿',
  flowering: '🌸',
  mature: '🌻'
};

export const GardenGuru: React.FC<GardenGuruProps> = ({ onBack }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny');
  const [gameDay, setGameDay] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Change weather randomly
    const weatherInterval = setInterval(() => {
      const weathers: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'cloudy', 'rainy'];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 8000);

    return () => clearInterval(weatherInterval);
  }, []);

  const plantSeed = (plantType: typeof plantTypes[0]) => {
    if (plants.length >= 6) return;

    const newPlant: Plant = {
      id: `${plantType.name}-${Date.now()}`,
      name: plantType.name,
      emoji: plantType.emoji,
      stage: 'seed',
      water: 50,
      sunlight: 30,
      happiness: 50,
      daysGrown: 0
    };

    setPlants(prev => [...prev, newPlant]);
    setScore(prev => prev + 5);
  };

  const waterPlant = (plantId: string) => {
    setPlants(prev => prev.map(plant => 
      plant.id === plantId 
        ? { ...plant, water: Math.min(100, plant.water + 30), happiness: Math.min(100, plant.happiness + 10) }
        : plant
    ));
    setScore(prev => prev + 2);
  };

  const giveSunlight = (plantId: string) => {
    setPlants(prev => prev.map(plant => 
      plant.id === plantId 
        ? { ...plant, sunlight: Math.min(100, plant.sunlight + 25), happiness: Math.min(100, plant.happiness + 8) }
        : plant
    ));
    setScore(prev => prev + 2);
  };

  const passDay = () => {
    setGameDay(prev => prev + 1);
    setPlants(prev => prev.map(plant => {
      let newStage = plant.stage;
      let newDaysGrown = plant.daysGrown + 1;
      let newWater = Math.max(0, plant.water - 15);
      let newSunlight = Math.max(0, plant.sunlight - 10);
      let newHappiness = plant.happiness;

      // Weather effects
      if (weather === 'rainy') {
        newWater = Math.min(100, newWater + 20);
      } else if (weather === 'sunny') {
        newSunlight = Math.min(100, newSunlight + 15);
      }

      // Growth stages
      if (newDaysGrown >= 1 && plant.stage === 'seed') newStage = 'sprout';
      if (newDaysGrown >= 2 && plant.stage === 'sprout') newStage = 'growing';
      if (newDaysGrown >= 4 && plant.stage === 'growing') newStage = 'flowering';
      if (newDaysGrown >= 6 && plant.stage === 'flowering') newStage = 'mature';

      // Happiness calculation
      if (newWater > 70 && newSunlight > 60) {
        newHappiness = Math.min(100, newHappiness + 15);
      } else if (newWater < 30 || newSunlight < 20) {
        newHappiness = Math.max(0, newHappiness - 10);
      }

      return {
        ...plant,
        stage: newStage,
        daysGrown: newDaysGrown,
        water: newWater,
        sunlight: newSunlight,
        happiness: newHappiness
      };
    }));

    // Check for mature plants
    const maturePlants = plants.filter(p => p.stage === 'mature').length;
    if (maturePlants > 0 && maturePlants % 3 === 0) {
      setLevel(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const getPlantDisplay = (plant: Plant) => {
    if (plant.happiness < 20) return '😵';
    if (plant.stage === 'mature') return plant.emoji;
    return stageEmojis[plant.stage];
  };

  const getWeatherEmoji = () => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      default: return '☀️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🌱 Garden Guru
          </h1>
          <div className="flex items-center gap-4 text-white">
            <div className="text-3xl">{getWeatherEmoji()}</div>
            <div className="text-right">
              <div className="font-bold">Day {gameDay}</div>
              <div className="text-sm capitalize">{weather}</div>
            </div>
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
                <div className="flex items-center gap-1">
                  <Flower className="w-5 h-5 text-pink-500" />
                  <span className="font-bold">Plants: {plants.length}/6</span>
                </div>
              </div>
              <Button onClick={passDay} className="bg-blue-500 hover:bg-blue-600 text-white">
                Next Day ⏰
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Garden Plot */}
          <Card className="lg:col-span-2 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Magic Garden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-amber-100 to-green-200 rounded-lg">
                {Array.from({ length: 6 }).map((_, index) => {
                  const plant = plants[index];
                  return (
                    <div
                      key={index}
                      className={`w-24 h-32 bg-amber-200 rounded-lg border-4 border-amber-300 flex flex-col items-center justify-end p-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedPlant?.id === plant?.id ? 'ring-4 ring-blue-500' : ''
                      }`}
                      onClick={() => plant && setSelectedPlant(plant)}
                    >
                      {plant ? (
                        <>
                          <div className="text-4xl mb-2 animate-bounce">
                            {getPlantDisplay(plant)}
                          </div>
                          <div className="w-full space-y-1">
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${plant.water}%` }}
                              />
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${plant.sunlight}%` }}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl text-gray-400">🕳️</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Plant Seeds */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-xl">Plant Seeds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {plantTypes.map((plantType) => (
                    <Button
                      key={plantType.name}
                      onClick={() => plantSeed(plantType)}
                      disabled={plants.length >= 6}
                      className="p-4 h-auto bg-green-500 hover:bg-green-600 text-white"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{plantType.emoji}</div>
                        <div className="text-xs">{plantType.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plant Care */}
            {selectedPlant && (
              <Card className="bg-white/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-center text-xl">Care for {selectedPlant.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getPlantDisplay(selectedPlant)}</div>
                    <div className="text-lg font-bold">{selectedPlant.name}</div>
                    <div className="text-sm text-gray-600">Day {selectedPlant.daysGrown}</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          Water
                        </span>
                        <span className="text-sm">{selectedPlant.water}%</span>
                      </div>
                      <Progress value={selectedPlant.water} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Sun className="w-4 h-4 text-yellow-500" />
                          Sunlight
                        </span>
                        <span className="text-sm">{selectedPlant.sunlight}%</span>
                      </div>
                      <Progress value={selectedPlant.sunlight} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Flower className="w-4 h-4 text-pink-500" />
                          Happiness
                        </span>
                        <span className="text-sm">{selectedPlant.happiness}%</span>
                      </div>
                      <Progress value={selectedPlant.happiness} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => waterPlant(selectedPlant.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Droplets className="w-4 h-4 mr-2" />
                      Water
                    </Button>
                    <Button
                      onClick={() => giveSunlight(selectedPlant.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Sunlight
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Garden Tips */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-xl">Garden Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">💧</div>
                    <span>Water daily to keep plants healthy!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg">☀️</div>
                    <span>Sunlight helps plants grow strong!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg">🌧️</div>
                    <span>Rain gives extra water naturally!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg">😊</div>
                    <span>Happy plants grow faster!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🌻</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Garden Master!</h3>
              <p className="text-xl text-gray-600">You've grown beautiful plants!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Flower key={i} className="w-8 h-8 text-pink-500 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
