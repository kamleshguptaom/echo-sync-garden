import React, { useState, useEffect } from 'react';
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
import { ScienceGame } from './ScienceGame/ScienceGame';
import { GeographyGame } from './GeographyGame/GeographyGame';
import { ObjectBuilder } from './ObjectBuilder/ObjectBuilder';
import { LadderSnake } from './LadderSnake/LadderSnake';
import { WaffleGame } from './WaffleGame/WaffleGame';
import { HistoryGame } from './HistoryGame/HistoryGame';
import { LogicGame } from './LogicGame/LogicGame';

export type GameType = 
  | 'hub' 
  | 'tic-tac-toe' 
  | 'jigsaw' 
  | 'sudoku' 
  | 'math' 
  | 'geometry' 
  | 'memory' 
  | 'word' 
  | 'aiming'
  | 'science'
  | 'geography'
  | 'object-builder'
  | 'ladder-snake'
  | 'waffle'
  | 'history'
  | 'logic';

export const GameHub = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('hub');
  const [recentGames, setRecentGames] = useState<GameType[]>([]);

  // Real-time game state updates
  useEffect(() => {
    if (currentGame !== 'hub' && !recentGames.includes(currentGame)) {
      setRecentGames(prev => [currentGame, ...prev.slice(0, 2)]);
    }
  }, [currentGame]);

  const gameCategories = [
    {
      title: "Logic & Strategy",
      games: [
        { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', description: 'Classic strategy game with multiple variants' },
        { id: 'sudoku', name: 'Sudoku', icon: '🔢', description: 'Number puzzle with different difficulty levels' },
        { id: 'memory', name: 'Memory Game', icon: '🧠', description: 'Test your memory with various challenges' },
        { id: 'ladder-snake', name: 'Snakes & Ladders', icon: '🐍', description: 'Classic board game with educational concepts' },
        { id: 'logic', name: 'Logic Challenge', icon: '🧩', description: 'Sequences, patterns, riddles, and deduction puzzles' },
      ]
    },
    {
      title: "Puzzles & Creative",
      games: [
        { id: 'jigsaw', name: 'Jigsaw Puzzle', icon: '🧩', description: 'Interactive puzzles with custom images' },
        { id: 'word', name: 'Word Games', icon: '📝', description: 'Vocabulary and spelling challenges' },
        { id: 'waffle', name: 'Waffle Game', icon: '🧇', description: 'Swap letters to form words in a waffle grid' },
        { id: 'object-builder', name: 'Object Builder', icon: '🎨', description: 'Create objects using shapes and colors' },
      ]
    },
    {
      title: "Educational",
      games: [
        { id: 'math', name: 'Math Games', icon: '➕', description: 'Mathematical challenges for all levels' },
        { id: 'geometry', name: 'Geometry', icon: '📐', description: 'Shape and spatial reasoning games' },
        { id: 'science', name: 'Science Challenge', icon: '🔬', description: 'Physics, chemistry, biology, and more' },
        { id: 'geography', name: 'Geography Quest', icon: '🌍', description: 'Explore countries, capitals, and landmarks' },
        { id: 'history', name: 'History Challenge', icon: '🏛️', description: 'Test your knowledge of historical events' },
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
      case 'science':
        return <ScienceGame onBack={() => setCurrentGame('hub')} />;
      case 'geography':
        return <GeographyGame onBack={() => setCurrentGame('hub')} />;
      case 'object-builder':
        return <ObjectBuilder onBack={() => setCurrentGame('hub')} />;
      case 'ladder-snake':
        return <LadderSnake onBack={() => setCurrentGame('hub')} />;
      case 'waffle':
        return <WaffleGame onBack={() => setCurrentGame('hub')} />;
      case 'history':
        return <HistoryGame onBack={() => setCurrentGame('hub')} />;
      case 'logic':
        return <LogicGame onBack={() => setCurrentGame('hub')} />;
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

      {recentGames.length > 0 && (
        <div className="mb-10 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Recently Played
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {recentGames.map(gameType => {
              const gameInfo = gameCategories.flatMap(cat => cat.games).find(g => g.id === gameType);
              if (!gameInfo) return null;
              
              return (
                <Button 
                  key={gameType} 
                  className="bg-white/90 hover:bg-white text-purple-800 p-4 flex items-center gap-2 hover:scale-105 transition-all"
                  onClick={() => setCurrentGame(gameType as GameType)}
                >
                  <span className="text-2xl">{gameInfo.icon}</span>
                  <span>{gameInfo.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {gameCategories.map((category, categoryIndex) => (
          <div key={category.title} className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.games.map((game, gameIndex) => (
                <Card 
                  key={game.id} 
                  className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/90 hover:bg-white border-2 hover:border-purple-500 animate-scale-in"
                  style={{ animationDelay: `${(categoryIndex * 4 + gameIndex) * 0.1}s` }}
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
