import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ExplorationDiscovery = () => {
  const navigate = useNavigate();

  const explorationGames = [
    {
      id: 'geography',
      title: 'World Explorer',
      emoji: '🌍',
      description: 'Discover countries, capitals, and amazing places around the world!',
      difficulty: 'medium'
    },
    {
      id: 'history',
      title: 'Time Travel',
      emoji: '🏛️',
      description: 'Journey through history and meet famous figures!',
      difficulty: 'hard'
    },
    {
      id: 'science',
      title: 'Science Lab',
      emoji: '🔬',
      description: 'Explore the wonders of science through exciting experiments!',
      difficulty: 'medium'
    },
    {
      id: 'virtual-lab',
      title: 'Virtual Lab',
      emoji: '⚗️',
      description: 'Advanced scientific experiments with real chemistry and physics!',
      difficulty: 'hard'
    },
    {
      id: 'solarsystem',
      title: 'Space Explorer',
      emoji: '🪐',
      description: 'Journey through our solar system and beyond!',
      difficulty: 'medium'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    navigate(`/?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white">🌍 Exploration & Discovery</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-8 text-center max-w-2xl mx-auto">
          Embark on exciting journeys of discovery! Explore the world, travel through time, 
          and uncover the mysteries of science and space.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {explorationGames.map((game) => (
            <Card 
              key={game.id} 
              className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleGameSelect(game.id)}
            >
              <CardHeader>
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">{game.emoji}</div>
                  <CardTitle className="text-xl text-gray-800">{game.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{game.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorationDiscovery;