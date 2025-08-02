import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const LanguageReading = () => {
  const navigate = useNavigate();

  const languageGames = [
    {
      id: 'phonics',
      title: 'Phonics Fun',
      emoji: '🔤',
      description: 'Learn letter sounds and build reading skills!',
      difficulty: 'easy'
    },
    {
      id: 'word',
      title: 'Word Explorer',
      emoji: '📝',
      description: 'Discover new words and improve your vocabulary!',
      difficulty: 'easy'
    },
    {
      id: 'word-game',
      title: 'Word Masters',
      emoji: '📚',
      description: 'Comprehensive word game with spelling, grammar, and vocabulary!',
      difficulty: 'medium'
    },
    {
      id: 'grammar',
      title: 'Grammar Guide',
      emoji: '📖',
      description: 'Master grammar rules and sentence structure!',
      difficulty: 'medium'
    },
    {
      id: 'speed-reading',
      title: 'Speed Reading',
      emoji: '⚡',
      description: 'Improve reading speed and comprehension skills!',
      difficulty: 'hard'
    },
    {
      id: 'typing',
      title: 'Typing Master',
      emoji: '⌨️',
      description: 'Learn to type fast and accurately!',
      difficulty: 'medium'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    navigate(`/?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white">📚 Language & Reading</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-8 text-center max-w-2xl mx-auto">
          Master the art of language! Build vocabulary, improve grammar, enhance reading skills, 
          and become a confident communicator.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {languageGames.map((game) => (
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

export default LanguageReading;