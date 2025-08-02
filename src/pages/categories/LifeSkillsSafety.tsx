import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const LifeSkillsSafety = () => {
  const navigate = useNavigate();

  const lifeskillsGames = [
    {
      id: 'recycling',
      title: 'Eco Warrior',
      emoji: '♻️',
      description: 'Learn about recycling and protecting our planet!',
      difficulty: 'easy'
    },
    {
      id: 'transportation',
      title: 'Vehicle Voyage',
      emoji: '🚗',
      description: 'Explore different types of transportation safely!',
      difficulty: 'easy'
    },
    {
      id: 'nutrition',
      title: 'Healthy Choices',
      emoji: '🥕',
      description: 'Learn about nutrition and healthy eating habits!',
      difficulty: 'easy'
    },
    {
      id: 'roadsafety',
      title: 'Road Safety',
      emoji: '🚦',
      description: 'Learn important road safety rules and traffic signs!',
      difficulty: 'medium'
    },
    {
      id: 'animalhabitats',
      title: 'Animal Homes',
      emoji: '🦁',
      description: 'Match animals with their natural habitats!',
      difficulty: 'easy'
    },
    {
      id: 'emotions',
      title: 'Feeling Faces',
      emoji: '😊',
      description: 'Recognize and understand different emotions!',
      difficulty: 'easy'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    navigate(`/?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white">🌟 Life Skills & Safety</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-8 text-center max-w-2xl mx-auto">
          Learn essential life skills, safety awareness, and develop social-emotional intelligence 
          through fun and interactive games!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {lifeskillsGames.map((game) => (
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

export default LifeSkillsSafety;