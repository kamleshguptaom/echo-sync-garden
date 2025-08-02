import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const LogicPuzzles = () => {
  const navigate = useNavigate();

  const puzzleGames = [
    {
      id: 'logic',
      title: 'Logic Puzzles',
      emoji: '🧩',
      description: 'Challenge your mind with brain-teasing logic games!',
      difficulty: 'hard'
    },
    {
      id: 'sudoku',
      title: 'Number Sudoku',
      emoji: '🔢',
      description: 'Fill the grid with numbers using logic and reasoning!',
      difficulty: 'expert'
    },
    {
      id: 'mind-maze',
      title: 'Mind Maze',
      emoji: '🌀',
      description: 'Navigate through complex cognitive puzzles and challenges!',
      difficulty: 'hard'
    },
    {
      id: 'jigsaw',
      title: 'Jigsaw Puzzle',
      emoji: '🧩',
      description: 'Piece together beautiful images in this classic puzzle!',
      difficulty: 'medium'
    },
    {
      id: 'pattern',
      title: 'Pattern Game',
      emoji: '🔶',
      description: 'Recognize and complete complex patterns!',
      difficulty: 'medium'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    navigate(`/?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white">🧩 Logic & Puzzles</h1>
        </div>
        
        <p className="text-white/90 text-lg mb-8 text-center max-w-2xl mx-auto">
          Challenge your logical thinking and problem-solving skills with our collection 
          of mind-bending puzzles and brain teasers!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {puzzleGames.map((game) => (
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

export default LogicPuzzles;