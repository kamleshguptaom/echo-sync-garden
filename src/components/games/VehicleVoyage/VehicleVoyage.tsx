
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, RotateCcw, Volume2, Play } from 'lucide-react';
import { VehicleGarage } from './components/VehicleGarage';
import { TransportZone } from './components/TransportZone';
import { Vehicle, TransportCategory, GameProgress } from './types';

interface VehicleVoyageProps {
  onBack: () => void;
}

const vehicles: Vehicle[] = [
  { 
    id: '1',
    name: 'Car', 
    emoji: '🚗', 
    category: 'land', 
    sound: 'Vroom vroom!', 
    fact: 'Cars help families travel together on roads!',
    speed: 'Medium',
    environment: 'Roads and streets'
  },
  { 
    id: '2',
    name: 'Airplane', 
    emoji: '✈️', 
    category: 'air', 
    sound: 'Whoosh!', 
    fact: 'Airplanes can fly above the clouds at 30,000 feet!',
    speed: 'Very Fast',
    environment: 'Sky and airports'
  },
  { 
    id: '3',
    name: 'Boat', 
    emoji: '🚤', 
    category: 'water', 
    sound: 'Splash!', 
    fact: 'Boats float on water and can travel across lakes!',
    speed: 'Medium',
    environment: 'Lakes and rivers'
  },
  { 
    id: '4',
    name: 'Train', 
    emoji: '🚂', 
    category: 'land', 
    sound: 'Choo choo!', 
    fact: 'Trains can carry hundreds of people on tracks!',
    speed: 'Fast',
    environment: 'Railway tracks'
  },
  { 
    id: '5',
    name: 'Helicopter', 
    emoji: '🚁', 
    category: 'air', 
    sound: 'Whirr whirr!', 
    fact: 'Helicopters can hover in one place and land anywhere!',
    speed: 'Medium',
    environment: 'Sky and helipads'
  },
  { 
    id: '6',
    name: 'Ship', 
    emoji: '🚢', 
    category: 'water', 
    sound: 'Toot toot!', 
    fact: 'Big ships carry cargo across oceans for thousands of miles!',
    speed: 'Slow',
    environment: 'Oceans and ports'
  },
  { 
    id: '7',
    name: 'Bus', 
    emoji: '🚌', 
    category: 'land', 
    sound: 'Beep beep!', 
    fact: 'Buses help many people travel together in cities!',
    speed: 'Medium',
    environment: 'City streets'
  },
  { 
    id: '8',
    name: 'Submarine', 
    emoji: '🛟', 
    category: 'water', 
    sound: 'Ping ping!', 
    fact: 'Submarines travel underwater like fish!',
    speed: 'Medium',
    environment: 'Underwater'
  }
];

const categories: TransportCategory[] = [
  { 
    name: 'Land', 
    emoji: '🛣️', 
    color: 'bg-green-500',
    description: 'Vehicles that travel on roads and tracks',
    examples: ['Cars', 'Trains', 'Buses', 'Bicycles']
  },
  { 
    name: 'Air', 
    emoji: '☁️', 
    color: 'bg-blue-500',
    description: 'Vehicles that fly in the sky',
    examples: ['Airplanes', 'Helicopters', 'Hot air balloons', 'Rockets']
  },
  { 
    name: 'Water', 
    emoji: '🌊', 
    color: 'bg-cyan-500',
    description: 'Vehicles that travel on or under water',
    examples: ['Boats', 'Ships', 'Submarines', 'Jet skis']
  }
];

export const VehicleVoyage: React.FC<VehicleVoyageProps> = ({ onBack }) => {
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    level: 1,
    score: 0,
    vehiclesSorted: 0,
    perfectSorts: 0,
    categoriesMastered: new Set()
  });
  
  const [gameMode, setGameMode] = useState<'sort' | 'learn' | 'drag'>('drag');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [draggedVehicle, setDraggedVehicle] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [vehicleCounts, setVehicleCounts] = useState<Record<string, number>>({
    land: 0,
    air: 0,
    water: 0
  });

  const speakVehicleInfo = (vehicle: Vehicle) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        `${vehicle.name} goes ${vehicle.sound}. ${vehicle.fact}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    speakVehicleInfo(vehicle);
  };

  const handleDragStart = (e: React.DragEvent, vehicle: Vehicle) => {
    setDraggedVehicle(vehicle.id);
    e.dataTransfer.setData('text/plain', vehicle.id);
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setActiveZone(category);
  };

  const handleDragLeave = () => {
    setActiveZone(null);
  };

  const handleDrop = (category: string) => {
    if (!draggedVehicle) return;
    
    const vehicle = vehicles.find(v => v.id === draggedVehicle);
    if (!vehicle) return;

    const isCorrect = vehicle.category === category;
    
    if (isCorrect) {
      setGameProgress(prev => ({
        ...prev,
        score: prev.score + 15,
        vehiclesSorted: prev.vehiclesSorted + 1,
        perfectSorts: prev.perfectSorts + 1,
        categoriesMastered: new Set([...prev.categoriesMastered, category])
      }));
      
      setVehicleCounts(prev => ({
        ...prev,
        [category]: prev[category] + 1
      }));
      
      setFeedback(`🎉 Perfect! ${vehicle.name} travels ${category === 'air' ? 'in the air' : `on ${category}`}! ${vehicle.fact}`);
      
      if ((gameProgress.vehiclesSorted + 1) % 5 === 0) {
        setGameProgress(prev => ({ ...prev, level: prev.level + 1 }));
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setGameProgress(prev => ({ ...prev, perfectSorts: 0 }));
      setFeedback(`❌ Try again! ${vehicle.name} doesn't travel ${category === 'air' ? 'in the air' : `on ${category}`}. Think about where you see ${vehicle.name}s!`);
    }
    
    setDraggedVehicle(null);
    setActiveZone(null);
  };

  const resetGame = () => {
    setGameProgress({
      level: 1,
      score: 0,
      vehiclesSorted: 0,
      perfectSorts: 0,
      categoriesMastered: new Set()
    });
    setVehicleCounts({ land: 0, air: 0, water: 0 });
    setSelectedVehicle(null);
    setFeedback('');
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
              onClick={() => setGameMode(gameMode === 'drag' ? 'learn' : 'drag')}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              {gameMode === 'drag' ? 'Learn Mode' : 'Drag Mode'}
            </Button>
            <Button onClick={resetGame} className="bg-white/20 hover:bg-white/30 text-white">
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
                  <span className="font-bold">Level {gameProgress.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">{gameProgress.score}</span>
                </div>
                <div className="text-sm">Sorted: {gameProgress.vehiclesSorted}</div>
              </div>
              <span className="text-sm font-medium">Mode: {gameMode}</span>
            </div>
          </CardContent>
        </Card>

        {gameMode === 'drag' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VehicleGarage 
              vehicles={vehicles} 
              onVehicleSelect={handleVehicleSelect}
              selectedVehicle={selectedVehicle}
            />
            <div className="space-y-4">
              {categories.map((category) => (
                <TransportZone
                  key={category.name}
                  category={category}
                  isActive={activeZone === category.name.toLowerCase()}
                  onDrop={handleDrop}
                  onDragOver={(e) => handleDragOver(e, category.name.toLowerCase())}
                  vehicleCount={vehicleCounts[category.name.toLowerCase()]}
                />
              ))}
            </div>
          </div>
        ) : (
          selectedVehicle && (
            <Card className="mb-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Learn about this vehicle!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-4 cursor-pointer animate-bounce hover:scale-110 transition-transform"
                  onClick={() => speakVehicleInfo(selectedVehicle)}
                >
                  <span className="text-7xl">{selectedVehicle.emoji}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedVehicle.name}</h3>
                <p className="text-lg text-gray-600 mb-2">Click to hear the sound!</p>
                <p className="text-xl font-semibold text-purple-600">{selectedVehicle.sound}</p>
                
                <div className="mt-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                  <p className="text-lg font-medium text-blue-800">
                    💡 {selectedVehicle.fact}
                  </p>
                </div>
                
                {feedback && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="text-lg font-medium">{feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        )}

        {/* Learn Mode - All Vehicles */}
        {gameMode === 'learn' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicles.map((vehicle, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
                onClick={() => setSelectedVehicle(vehicle)}
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
