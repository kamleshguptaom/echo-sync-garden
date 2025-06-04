
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Game imports
import { MemoryGame } from './MemoryGame/MemoryGame';
import { MathGame } from './MathGame/MathGame';
import { WordGame } from './WordGame/WordGame';
import { LogicGame } from './LogicGame/LogicGame';
import { GeometryGame } from './GeometryGame/GeometryGame';
import { ScienceGame } from './ScienceGame/ScienceGame';
import { GeographyGame } from './GeographyGame/GeographyGame';
import { HistoryGame } from './HistoryGame/HistoryGame';
import { TicTacToe } from './TicTacToe/TicTacToe';
import { Sudoku } from './Sudoku/Sudoku';
import { JigsawPuzzle } from './JigsawPuzzle/JigsawPuzzle';
import { WaffleGame } from './WaffleGame/WaffleGame';
import { LadderSnake } from './LadderSnake/LadderSnake';
import { AimingGame } from './AimingGame/AimingGame';
import { ObjectBuilder } from './ObjectBuilder/ObjectBuilder';
import { PatternGame } from './PatternGame/PatternGame';
import { ConcentrationGame } from './ConcentrationGame/ConcentrationGame';
import { SpeedReading } from './SpeedReading/SpeedReading';
import { TypingGame } from './TypingGame/TypingGame';
import { DrawingGame } from './DrawingGame/DrawingGame';
import { StoryBook } from './StoryBook/StoryBook';

type GameType = 
  | 'memory' | 'math' | 'word' | 'logic' | 'geometry' | 'science' | 'geography' | 'history'
  | 'tictactoe' | 'sudoku' | 'jigsaw' | 'waffle' | 'laddersnake' | 'aiming' | 'builder'
  | 'pattern' | 'concentration' | 'speedreading' | 'typing' | 'drawing' | 'storybook' | null;

export const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  if (selectedGame) {
    const gameProps = { onBack: () => setSelectedGame(null) };
    
    switch (selectedGame) {
      case 'memory': return <MemoryGame {...gameProps} />;
      case 'math': return <MathGame {...gameProps} />;
      case 'word': return <WordGame {...gameProps} />;
      case 'logic': return <LogicGame {...gameProps} />;
      case 'geometry': return <GeometryGame {...gameProps} />;
      case 'science': return <ScienceGame {...gameProps} />;
      case 'geography': return <GeographyGame {...gameProps} />;
      case 'history': return <HistoryGame {...gameProps} />;
      case 'tictactoe': return <TicTacToe {...gameProps} />;
      case 'sudoku': return <Sudoku {...gameProps} />;
      case 'jigsaw': return <JigsawPuzzle {...gameProps} />;
      case 'waffle': return <WaffleGame {...gameProps} />;
      case 'laddersnake': return <LadderSnake {...gameProps} />;
      case 'aiming': return <AimingGame {...gameProps} />;
      case 'builder': return <ObjectBuilder {...gameProps} />;
      case 'pattern': return <PatternGame {...gameProps} />;
      case 'concentration': return <ConcentrationGame {...gameProps} />;
      case 'speedreading': return <SpeedReading {...gameProps} />;
      case 'typing': return <TypingGame {...gameProps} />;
      case 'drawing': return <DrawingGame {...gameProps} />;
      case 'storybook': return <StoryBook {...gameProps} />;
      default: return null;
    }
  }

  const games = [
    // Mind & Logic Games
    { id: 'memory', title: 'Memory Game', emoji: '🧠', description: 'Test your memory skills', category: 'Mind Games' },
    { id: 'logic', title: 'Logic Challenge', emoji: '🧩', description: 'Solve logical puzzles', category: 'Mind Games' },
    { id: 'pattern', title: 'Pattern Recognition', emoji: '🎯', description: 'Identify visual patterns', category: 'Mind Games' },
    { id: 'concentration', title: 'Concentration', emoji: '🎨', description: 'Stroop test & focus training', category: 'Mind Games' },
    
    // Learning Games
    { id: 'math', title: 'Math Challenge', emoji: '🔢', description: 'Practice arithmetic and algebra', category: 'Learning' },
    { id: 'word', title: 'Word Games', emoji: '📝', description: 'Spelling and vocabulary', category: 'Learning' },
    { id: 'speedreading', title: 'Speed Reading', emoji: '📖', description: 'Improve reading speed & comprehension', category: 'Learning' },
    { id: 'typing', title: 'Typing Challenge', emoji: '⌨️', description: 'Improve typing speed & accuracy', category: 'Learning' },
    { id: 'science', title: 'Science Quest', emoji: '🔬', description: 'Explore scientific concepts', category: 'Learning' },
    { id: 'history', title: 'History Challenge', emoji: '🏛️', description: 'Learn world history', category: 'Learning' },
    { id: 'geography', title: 'Geography Quest', emoji: '🌍', description: 'Explore the world', category: 'Learning' },
    { id: 'geometry', title: 'Geometry Game', emoji: '📐', description: 'Learn shapes and angles', category: 'Learning' },
    
    // Creative & Expression
    { id: 'drawing', title: 'Creative Drawing', emoji: '🎨', description: 'Digital art and creativity', category: 'Creative' },
    { id: 'storybook', title: 'Story Book', emoji: '📚', description: 'Animated stories and poems', category: 'Creative' },
    { id: 'builder', title: 'Object Builder', emoji: '🏗️', description: 'Create and build objects', category: 'Creative' },
    
    // Puzzle Games
    { id: 'sudoku', title: 'Sudoku', emoji: '🔢', description: 'Number placement puzzle', category: 'Puzzles' },
    { id: 'jigsaw', title: 'Jigsaw Puzzle', emoji: '🧩', description: 'Piece together images', category: 'Puzzles' },
    { id: 'waffle', title: 'Waffle Game', emoji: '🧇', description: 'Word puzzle with a twist', category: 'Puzzles' },
    
    // Classic Games
    { id: 'tictactoe', title: 'Tic Tac Toe', emoji: '⭕', description: 'Classic strategy game', category: 'Classic' },
    { id: 'laddersnake', title: 'Ladder & Snake', emoji: '🐍', description: 'Board game adventure', category: 'Classic' },
    
    // Action & Skill
    { id: 'aiming', title: 'Aiming Game', emoji: '🎯', description: 'Test your precision', category: 'Action' }
  ];

  const categories = [...new Set(games.map(game => game.category))];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          🎮 Learning Game Hub
        </h1>
        <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Educational games to enhance your mind and skills
        </p>
      </div>

      {categories.map((category, categoryIndex) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 animate-fade-in"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games
              .filter(game => game.category === category)
              .map((game, index) => (
                <Card 
                  key={game.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/95 animate-scale-in"
                  style={{ animationDelay: `${(categoryIndex * 4 + index) * 0.1}s` }}
                  onClick={() => setSelectedGame(game.id as GameType)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {game.emoji}
                    </div>
                    <CardTitle className="text-lg font-bold">{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGame(game.id as GameType);
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

      <div className="text-center mt-12 p-6 bg-white/10 rounded-lg backdrop-blur animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-2">🧠 Benefits of Educational Gaming</h3>
        <p className="text-white/90">
          Enhance memory, improve problem-solving skills, boost concentration, and learn while having fun!
        </p>
      </div>
    </div>
  );
};
