import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const MathGames = () => {
  const navigate = useNavigate();

  const mathGames = [
    {
      id: 'math',
      title: 'Math Adventure',
      emoji: '🔢',
      description: 'Solve exciting math problems and build number skills!',
      difficulty: 'medium'
    },
    {
      id: 'geometry',
      title: 'Shape Master',
      emoji: '📐',
      description: 'Learn about shapes, angles, and spatial reasoning!',
      difficulty: 'medium'
    },
    {
      id: 'clocklearning',
      title: 'Time Master',
      emoji: '🕐',
      description: 'Learn to tell time and understand clocks!',
      difficulty: 'medium'
    },
    {
      id: 'moneymath',
      title: 'Coin Counter',
      emoji: '💰',
      description: 'Learn counting money and making change!',
      difficulty: 'medium'
    },
    {
      id: 'fractions',
      title: 'Fraction Fun',
      emoji: '🍕',
      description: 'Master fractions through visual and interactive lessons!',
      difficulty: 'hard'
    },
    {
      id: 'algebra',
      title: 'Algebra Quest',
      emoji: '🧮',
      description: 'Solve algebraic equations and learn variables!',
      difficulty: 'expert'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    navigate(`/?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white">🔢 Math Adventures</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-8 text-center max-w-2xl mx-auto">
          Explore the fascinating world of mathematics! From basic counting to advanced algebra, 
          make math fun and engaging with interactive games.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mathGames.map((game) => (
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
                  game.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
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

export default MathGames;