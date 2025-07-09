import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, RotateCcw, Play } from 'lucide-react';
import { VehicleCard } from './components/VehicleCard';
import { TransportZone } from './components/TransportZone';
import { SoundControl } from './components/SoundControl';
import { useGameLogic } from './hooks/useGameLogic';
import { Vehicle, TransportCategory } from './types';

interface VehicleVoyageProps {
  onBack: () => void;
}

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
  const {
    vehicles,
    gameProgress,
    selectedVehicle,
    vehicleCounts,
    handleVehicleSort,
    handleVehicleSelect,
    toggleSound,
    resetGame,
    setSelectedVehicle
  } = useGameLogic();

  const [gameMode, setGameMode] = useState<'sort' | 'learn'>('sort');
  const [draggedVehicle, setDraggedVehicle] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleDragStart = (e: React.DragEvent, vehicle: Vehicle) => {
    setDraggedVehicle(vehicle.id);
    e.dataTransfer.setData('text/plain', vehicle.id);
  };

  const handleDragEnd = () => {
    setDraggedVehicle(null);
    setActiveZone(null);
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

    const isCorrect = handleVehicleSort(draggedVehicle, category);
    
    if (isCorrect) {
      setFeedback(`🎉 Perfect! ${vehicle.name} travels ${category === 'air' ? 'in the air' : `on ${category}`}! ${vehicle.fact}`);
      
      if ((gameProgress.vehiclesSorted + 1) % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setFeedback(`❌ Try again! ${vehicle.name} doesn't travel ${category === 'air' ? 'in the air' : `on ${category}`}. Think about where you see ${vehicle.name}s!`);
    }
    
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🚗 Vehicle Voyage
          </h1>
          <div className="flex gap-2">
            <SoundControl soundEnabled={gameProgress.soundEnabled} onToggleSound={toggleSound} />
            <Button 
              onClick={() => setGameMode(gameMode === 'sort' ? 'learn' : 'sort')}
              variant="outline"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              {gameMode === 'sort' ? <Play className="w-4 h-4" /> : '🎯'}
            </Button>
            <Button onClick={resetGame} variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur border-0 shadow-xl">
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
              <span className="text-sm font-medium">Mode: {gameMode === 'sort' ? 'Sorting' : 'Learning'}</span>
            </div>
          </CardContent>
        </Card>

        {gameMode === 'sort' ? (
          <div className="space-y-6">
            {/* All Vehicles in Single Row */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">🚗 Vehicle Fleet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isSelected={selectedVehicle?.id === vehicle.id}
                      isDragging={draggedVehicle === vehicle.id}
                      onSelect={handleVehicleSelect}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transport Categories */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">🌍 Transport Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <TransportZone
                      key={category.name}
                      category={category}
                      isActive={activeZone === category.name.toLowerCase()}
                      onDrop={handleDrop}
                      onDragOver={(e) => handleDragOver(e, category.name.toLowerCase())}
                      onDragLeave={handleDragLeave}
                      vehicleCount={vehicleCounts[category.name.toLowerCase()]}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Learn Mode */
          <div className="space-y-6">
            {selectedVehicle && (
              <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Learn about this vehicle!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-4 cursor-pointer animate-bounce hover:scale-110 transition-transform"
                    onClick={() => handleVehicleSelect(selectedVehicle)}
                  >
                    <span className="text-7xl">{selectedVehicle.emoji}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedVehicle.name}</h3>
                  <p className="text-lg text-gray-600 mb-2">Click to hear the sound!</p>
                  <p className="text-xl font-semibold text-purple-600 mb-4">{selectedVehicle.sound}</p>
                  
                  <div className="mt-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                    <p className="text-lg font-medium text-blue-800">
                      💡 {selectedVehicle.fact}
                    </p>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <p className="font-bold text-green-800">Speed: {selectedVehicle.speed}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <p className="font-bold text-purple-800">Environment: {selectedVehicle.environment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Vehicles Grid */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Choose a Vehicle to Learn About</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-primary/20"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{vehicle.emoji}</div>
                        <h4 className="font-bold text-gray-800">{vehicle.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{vehicle.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <Card className={`mt-6 border-0 shadow-xl ${
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

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce shadow-2xl">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're a Transport Expert!</p>
              <div className="flex justify-center mt-4 gap-2">
                {['🚗', '✈️', '🚢'].map((emoji, i) => (
                  <div key={i} className="text-3xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
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