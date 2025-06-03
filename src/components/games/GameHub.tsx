
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicTacToe } from './TicTacToe/TicTacToe';
import { JigsawPuzzle } from './JigsawPuzzle/JigsawPuzzle';
import { Sudoku } from './Sudoku/Sudoku';
import { MathGame } from './MathGame/MathGame';
import { GeometryGame } from './GeometryGame/GeometryGame';
import { MemoryGame } from './MemoryGame/MemoryGame';
import { WordGame } from './WordGame/WordGame';
import { AimingGame } from './AimingGame/AimingGame';

export type GameType = 
  | 'hub' 
  | 'tic-tac-toe' 
  | 'jigsaw' 
  | 'sudoku' 
  | 'math' 
  | 'geometry' 
  | 'memory' 
  | 'word' 
  | 'aiming';

export const GameHub = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('hub');

  const gameCategories = [
    {
      title: "Logic & Strategy",
      games: [
        { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', description: 'Classic strategy game with multiple variants' },
        { id: 'sudoku', name: 'Sudoku', icon: '🔢', description: 'Number puzzle with different difficulty levels' },
        { id: 'memory', name: 'Memory Game', icon: '🧠', description: 'Test your memory with various challenges' },
      ]
    },
    {
      title: "Puzzles & Creative",
      games: [
        { id: 'jigsaw', name: 'Jigsaw Puzzle', icon: '🧩', description: 'Interactive puzzles with custom images' },
        { id: 'word', name: 'Word Games', icon: '📝', description: 'Vocabulary and spelling challenges' },
      ]
    },
    {
      title: "Educational",
      games: [
        { id: 'math', name: 'Math Games', icon: '➕', description: 'Mathematical challenges for all levels' },
        { id: 'geometry', name: 'Geometry', icon: '📐', description: 'Shape and spatial reasoning games' },
      ]
    },
    {
      title: "Skill & Action",
      games: [
        { id: 'aiming', name: 'Aiming Games', icon: '🎯', description: 'Test your precision and reflexes' },
      ]
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'tic-tac-toe':
        return <TicTacToe onBack={() => setCurrentGame('hub')} />;
      case 'jigsaw':
        return <JigsawPuzzle onBack={() => setCurrentGame('hub')} />;
      case 'sudoku':
        return <Sudoku onBack={() => setCurrentGame('hub')} />;
      case 'math':
        return <MathGame onBack={() => setCurrentGame('hub')} />;
      case 'geometry':
        return <GeometryGame onBack={() => setCurrentGame('hub')} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame('hub')} />;
      case 'word':
        return <WordGame onBack={() => setCurrentGame('hub')} />;
      case 'aiming':
        return <AimingGame onBack={() => setCurrentGame('hub')} />;
      default:
        return renderHub();
    }
  };

  const renderHub = () => (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-white mb-4 animate-bounce">
          🎮 Brain Games Hub 🎮
        </h1>
        <p className="text-xl text-white/90">
          Interactive learning games with multiple levels and customization
        </p>
      </div>

      <div className="space-y-8">
        {gameCategories.map((category, categoryIndex) => (
          <div key={category.title} className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.games.map((game, gameIndex) => (
                <Card 
                  key={game.id} 
                  className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/90 hover:bg-white border-2 hover:border-purple-500 animate-scale-in"
                  style={{ animationDelay: `${(categoryIndex * 3 + gameIndex) * 0.1}s` }}
                  onClick={() => setCurrentGame(game.id as GameType)}
                >
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-2">{game.icon}</div>
                    <CardTitle className="text-xl text-purple-800">{game.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">{game.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentGame(game.id as GameType);
                      }}
                    >
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {renderGame()}
    </div>
  );
};
