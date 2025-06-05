
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
import { GolfGame } from './GolfGame/GolfGame';
import { CarromGame } from './CarromGame/CarromGame';
import { RoadSafetyGame } from './RoadSafetyGame/RoadSafetyGame';
import { NumberSequence } from './NumberSequence/NumberSequence';
import { ColorMemory } from './ColorMemory/ColorMemory';
import { MathRacing } from './MathRacing/MathRacing';

type GameType = 
  | 'memory' | 'math' | 'word' | 'logic' | 'geometry' | 'science' | 'geography' | 'history'
  | 'tictactoe' | 'sudoku' | 'jigsaw' | 'waffle' | 'laddersnake' | 'aiming' | 'builder'
  | 'pattern' | 'concentration' | 'speedreading' | 'typing' | 'drawing' | 'golf' | 'carrom'
  | 'roadsafety' | 'numbersequence' | 'colormemory' | 'mathracing' | null;

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
      case 'golf': return <GolfGame {...gameProps} />;
      case 'carrom': return <CarromGame {...gameProps} />;
      case 'roadsafety': return <RoadSafetyGame {...gameProps} />;
      case 'numbersequence': return <NumberSequence {...gameProps} />;
      case 'colormemory': return <ColorMemory {...gameProps} />;
      case 'mathracing': return <MathRacing {...gameProps} />;
      default: return null;
    }
  }

  const games = [
    // Mind & Memory Games
    { id: 'memory', title: 'Memory Challenge', emoji: '🧠', description: 'Test and improve your memory skills', category: 'Mind Games' },
    { id: 'logic', title: 'Logic Puzzles', emoji: '🧩', description: 'Solve challenging logical problems', category: 'Mind Games' },
    { id: 'pattern', title: 'Pattern Recognition', emoji: '🎯', description: 'Identify and predict visual patterns', category: 'Mind Games' },
    { id: 'concentration', title: 'Concentration Test', emoji: '🎨', description: 'Stroop test & focus training exercises', category: 'Mind Games' },
    { id: 'colormemory', title: 'Color Memory', emoji: '🌈', description: 'Remember complex color sequences', category: 'Mind Games' },
    { id: 'numbersequence', title: 'Number Sequences', emoji: '🔢', description: 'Mathematical pattern recognition', category: 'Mind Games' },
    
    // Learning & Education Games
    { id: 'math', title: 'Math Academy', emoji: '🔢', description: 'Comprehensive mathematical training', category: 'Learning' },
    { id: 'mathracing', title: 'Math Racing', emoji: '🏎️', description: 'Speed mathematics with racing action', category: 'Learning' },
    { id: 'word', title: 'Word Master', emoji: '📝', description: 'Advanced spelling and vocabulary', category: 'Learning' },
    { id: 'speedreading', title: 'Speed Reading', emoji: '📖', description: 'Enhance reading speed & comprehension', category: 'Learning' },
    { id: 'typing', title: 'Typing Master', emoji: '⌨️', description: 'Professional typing skill development', category: 'Learning' },
    { id: 'science', title: 'Science Explorer', emoji: '🔬', description: 'Interactive scientific discovery', category: 'Learning' },
    { id: 'history', title: 'History Quest', emoji: '🏛️', description: 'Journey through world history', category: 'Learning' },
    { id: 'geography', title: 'Geography Adventure', emoji: '🌍', description: 'Explore our amazing planet', category: 'Learning' },
    { id: 'geometry', title: 'Geometry Studio', emoji: '📐', description: 'Interactive shapes and angles', category: 'Learning' },
    { id: 'roadsafety', title: 'Road Safety Training', emoji: '🚦', description: 'Learn traffic rules and safety', category: 'Learning' },
    
    // Creative & Art Games
    { id: 'drawing', title: 'Art Studio Pro', emoji: '🎨', description: 'Professional digital art creation', category: 'Creative' },
    { id: 'builder', title: 'Object Builder', emoji: '🏗️', description: 'Create and construct 3D objects', category: 'Creative' },
    
    // Puzzle & Strategy Games
    { id: 'sudoku', title: 'Sudoku Master', emoji: '🔢', description: 'Classic number placement puzzles', category: 'Puzzles' },
    { id: 'jigsaw', title: 'Jigsaw Puzzles', emoji: '🧩', description: 'Beautiful picture puzzles', category: 'Puzzles' },
    { id: 'waffle', title: 'Waffle Word Game', emoji: '🧇', description: 'Unique word puzzle challenge', category: 'Puzzles' },
    
    // Sports & Action Games
    { id: 'golf', title: 'Mini Golf Pro', emoji: '⛳', description: 'Physics-based golf challenges', category: 'Sports' },
    { id: 'carrom', title: 'Carrom Championship', emoji: '🎯', description: 'Traditional board game mastery', category: 'Sports' },
    { id: 'aiming', title: 'Archery & Shooting', emoji: '🏹', description: 'Professional marksmanship training', category: 'Sports' },
    
    // Classic Board Games
    { id: 'tictactoe', title: 'Tic Tac Toe Pro', emoji: '⭕', description: 'Advanced strategy with customization', category: 'Classic' },
    { id: 'laddersnake', title: 'Snakes & Ladders', emoji: '🐍', description: 'Classic board game adventure', category: 'Classic' }
  ];

  const categories = [...new Set(games.map(game => game.category))];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          🎮 Ultimate Learning Game Hub
        </h1>
        <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Professional educational games to enhance your mind and skills
        </p>
      </div>

      {categories.map((category, categoryIndex) => (
        <div key={category} className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 animate-fade-in"
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
                    <div className="text-5xl mb-3 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {game.emoji}
                    </div>
                    <CardTitle className="text-lg font-bold">{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{game.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2"
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

      <div className="text-center mt-12 p-8 bg-gradient-to-r from-white/10 to-white/20 rounded-xl backdrop-blur animate-fade-in">
        <h3 className="text-2xl font-bold text-white mb-4">🧠 Benefits of Educational Gaming</h3>
        <div className="grid md:grid-cols-3 gap-6 text-white/90">
          <div>
            <div className="text-4xl mb-2">🎯</div>
            <h4 className="font-bold mb-2">Enhanced Focus</h4>
            <p className="text-sm">Improve concentration and attention span through engaging gameplay</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🧩</div>
            <h4 className="font-bold mb-2">Problem Solving</h4>
            <p className="text-sm">Develop critical thinking and analytical reasoning skills</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🚀</div>
            <h4 className="font-bold mb-2">Skill Building</h4>
            <p className="text-sm">Build practical skills while having fun and staying motivated</p>
          </div>
        </div>
      </div>
    </div>
  );
};
