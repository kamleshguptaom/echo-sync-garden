import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const BrainMemoryTraining = () => {
  const navigate = useNavigate();

  const brainGames = [
    {
      id: 'concentration',
      title: 'Concentration',
      emoji: '🧠',
      description: 'Enhance your focus and concentration skills!',
      difficulty: 'medium'
    },
    {
      id: 'attention',
      title: 'Attention Training',
      emoji: '👁️',
      description: 'Train your attention and visual processing!',
      difficulty: 'medium'
    },
    {
      id: 'brain-training',
      title: 'Brain Training',
      emoji: '🧠',
      description: 'Comprehensive cognitive training with multiple challenges!',
      difficulty: 'hard'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      emoji: '🃏',
      description: 'Test your memory with colorful cards and patterns!',
      difficulty: 'easy'
    },
    {
      id: 'visual-perception',
      title: 'Visual Perception Training',
      emoji: '👀',
      description: 'Enhance your visual processing and perception skills!',
      difficulty: 'medium'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    navigate(`/?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white">🧠 Brain & Memory Training</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-8 text-center max-w-2xl mx-auto">
          Boost your cognitive abilities, enhance memory, and sharpen focus with our 
          scientifically-designed brain training games!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {brainGames.map((game) => (
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

export default BrainMemoryTraining;