
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy } from 'lucide-react';

interface SpaceExplorerProps {
  onBack: () => void;
}

interface Planet {
  name: string;
  emoji: string;
  fact: string;
  size: string;
  position: number;
}

const planets: Planet[] = [
  { name: 'Mercury', emoji: '☿️', fact: 'Closest to the Sun and very hot!', size: 'small', position: 1 },
  { name: 'Venus', emoji: '♀️', fact: 'Hottest planet with thick clouds!', size: 'small', position: 2 },
  { name: 'Earth', emoji: '🌍', fact: 'Our home planet with life and water!', size: 'medium', position: 3 },
  { name: 'Mars', emoji: '♂️', fact: 'The red planet with rusty soil!', size: 'small', position: 4 },
  { name: 'Jupiter', emoji: '🪐', fact: 'Largest planet with many moons!', size: 'large', position: 5 },
  { name: 'Saturn', emoji: '🪐', fact: 'Has beautiful rings made of ice!', size: 'large', position: 6 },
  { name: 'Uranus', emoji: '🔵', fact: 'Tilted on its side and very cold!', size: 'medium', position: 7 },
  { name: 'Neptune', emoji: '🔵', fact: 'Farthest planet with strong winds!', size: 'medium', position: 8 }
];

export const SpaceExplorer: React.FC<SpaceExplorerProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<'order' | 'facts'>('order');
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [playerOrder, setPlayerOrder] = useState<Planet[]>([]);
  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (gameMode === 'order') {
      startOrderGame();
    } else {
      startFactsGame();
    }
  }, [gameMode]);

  const startOrderGame = () => {
    const shuffled = [...planets].sort(() => Math.random() - 0.5);
    setAvailablePlanets(shuffled);
    setPlayerOrder([]);
    setFeedback('');
  };

  const startFactsGame = () => {
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    setCurrentPlanet(randomPlanet);
    setFeedback('');
  };

  const addToOrder = (planet: Planet) => {
    if (playerOrder.includes(planet)) return;
    
    setPlayerOrder(prev => [...prev, planet]);
    setAvailablePlanets(prev => prev.filter(p => p.name !== planet.name));
  };

  const checkOrder = () => {
    const correctOrder = [...planets].sort((a, b) => a.position - b.position);
    const isCorrect = playerOrder.every((planet, index) => 
      planet.position === correctOrder[index].position
    );

    if (isCorrect && playerOrder.length === planets.length) {
      setScore(prev => prev + 20);
      setFeedback('🚀 Perfect! You know the order of planets!');
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setGameMode('facts');
      }, 2000);
    } else {
      setFeedback('Not quite right! Try to arrange planets from closest to farthest from the Sun.');
    }
  };

  const resetOrder = () => {
    setPlayerOrder([]);
    setAvailablePlanets([...planets].sort(() => Math.random() - 0.5));
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🪐 Space Explorer
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Star className="w-6 h-6" />
            <span className="font-bold">Score: {score}</span>
          </div>
        </div>

        {/* Game Mode Toggle */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setGameMode('order')}
                className={gameMode === 'order' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
              >
                Planet Order
              </Button>
              <Button
                onClick={() => setGameMode('facts')}
                className={gameMode === 'facts' ? 'bg-purple-500 text-white' : 'bg-gray-200'}
              >
                Planet Facts
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameMode === 'order' ? (
          <>
            {/* Order Game */}
            <Card className="mb-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Arrange the planets from closest to farthest from the Sun!
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Player's Order */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Your Order:</h3>
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    {playerOrder.map((planet, index) => (
                      <div key={planet.name} className="flex items-center gap-2 bg-blue-100 p-2 rounded">
                        <span className="text-2xl">{planet.emoji}</span>
                        <span className="font-medium">{planet.name}</span>
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Planets */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Available Planets:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availablePlanets.map((planet) => (
                      <Button
                        key={planet.name}
                        onClick={() => addToOrder(planet)}
                        className="p-4 h-auto bg-white hover:bg-gray-100 text-gray-800 border"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-1">{planet.emoji}</div>
                          <div className="text-sm font-medium">{planet.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center space-x-4">
                  <Button
                    onClick={checkOrder}
                    disabled={playerOrder.length !== planets.length}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                  >
                    Check Order
                  </Button>
                  <Button
                    onClick={resetOrder}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
                  >
                    Reset
                  </Button>
                </div>

                {feedback && (
                  <div className={`mt-4 p-3 rounded-lg text-center ${
                    feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    <p className="text-lg font-medium">{feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Facts Game */}
            {currentPlanet && (
              <Card className="mb-6 bg-white/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Learn About the Planets!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-8xl mb-4 animate-pulse">{currentPlanet.emoji}</div>
                  <h3 className="text-4xl font-bold text-purple-600 mb-4">{currentPlanet.name}</h3>
                  <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
                    <p className="text-xl">{currentPlanet.fact}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="font-bold">Position from Sun:</p>
                      <p className="text-2xl">#{currentPlanet.position}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="font-bold">Size:</p>
                      <p className="text-2xl capitalize">{currentPlanet.size}</p>
                    </div>
                  </div>
                  <Button
                    onClick={startFactsGame}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3"
                  >
                    Next Planet 🚀
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Awesome!</h3>
              <p className="text-xl text-gray-600">You're a Space Expert!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
