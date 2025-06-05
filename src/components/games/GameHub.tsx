
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
import { VisualPerception } from './VisualPerception/VisualPerception';
import { WorkingMemory } from './WorkingMemory/WorkingMemory';
import { AttentionTraining } from './AttentionTraining/AttentionTraining';
import { FractionGame } from './FractionGame/FractionGame';
import { AlgebraGame } from './AlgebraGame/AlgebraGame';
import { CodingGame } from './CodingGame/CodingGame';
import { CriticalThinking } from './CriticalThinking/CriticalThinking';

type GameType = 
  | 'memory' | 'math' | 'word' | 'logic' | 'geometry' | 'science' | 'geography' | 'history'
  | 'tictactoe' | 'sudoku' | 'jigsaw' | 'waffle' | 'laddersnake' | 'aiming' | 'builder'
  | 'pattern' | 'concentration' | 'speedreading' | 'typing' | 'drawing' 
  | 'visualperception' | 'workingmemory' | 'attention' | 'fractions' | 'algebra' | 'coding' | 'criticalthinking' | null;

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
      case 'visualperception': return <VisualPerception {...gameProps} />;
      case 'workingmemory': return <WorkingMemory {...gameProps} />;
      case 'attention': return <AttentionTraining {...gameProps} />;
      case 'fractions': return <FractionGame {...gameProps} />;
      case 'algebra': return <AlgebraGame {...gameProps} />;
      case 'coding': return <CodingGame {...gameProps} />;
      case 'criticalthinking': return <CriticalThinking {...gameProps} />;
      default: return null;
    }
  }

  const games = [
    // Core Cognitive Skills
    { id: 'memory', title: 'Memory Training', emoji: '🧠', description: 'Enhance memory capacity and recall', category: 'Cognitive Skills' },
    { id: 'workingmemory', title: 'Working Memory', emoji: '🔄', description: 'Strengthen working memory abilities', category: 'Cognitive Skills' },
    { id: 'attention', title: 'Attention Training', emoji: '🎯', description: 'Improve focus and concentration', category: 'Cognitive Skills' },
    { id: 'visualperception', title: 'Visual Perception', emoji: '👁️', description: 'Enhance visual processing skills', category: 'Cognitive Skills' },
    { id: 'pattern', title: 'Pattern Recognition', emoji: '🔍', description: 'Identify and predict patterns', category: 'Cognitive Skills' },
    { id: 'concentration', title: 'Concentration Test', emoji: '🎨', description: 'Stroop test & focus training', category: 'Cognitive Skills' },
    { id: 'logic', title: 'Logic Puzzles', emoji: '🧩', description: 'Develop logical reasoning', category: 'Cognitive Skills' },
    { id: 'criticalthinking', title: 'Critical Thinking', emoji: '🤔', description: 'Analyze and evaluate information', category: 'Cognitive Skills' },
    
    // Mathematics & Numbers
    { id: 'math', title: 'Math Challenge', emoji: '🔢', description: 'Comprehensive math training', category: 'Mathematics' },
    { id: 'fractions', title: 'Fraction Master', emoji: '½', description: 'Learn fractions visually', category: 'Mathematics' },
    { id: 'algebra', title: 'Algebra Quest', emoji: '📊', description: 'Solve algebraic equations', category: 'Mathematics' },
    { id: 'geometry', title: 'Geometry Studio', emoji: '📐', description: 'Explore shapes and angles', category: 'Mathematics' },
    
    // Language & Communication
    { id: 'word', title: 'Word Games', emoji: '📝', description: 'Vocabulary and spelling', category: 'Language' },
    { id: 'speedreading', title: 'Speed Reading', emoji: '📖', description: 'Improve reading speed', category: 'Language' },
    { id: 'typing', title: 'Typing Master', emoji: '⌨️', description: 'Professional typing skills', category: 'Language' },
    
    // STEM & Technology
    { id: 'science', title: 'Science Explorer', emoji: '🔬', description: 'Interactive science learning', category: 'STEM' },
    { id: 'coding', title: 'Coding Adventure', emoji: '💻', description: 'Learn programming basics', category: 'STEM' },
    
    // World Knowledge
    { id: 'geography', title: 'Geography Quest', emoji: '🌍', description: 'Explore world geography', category: 'World Knowledge' },
    { id: 'history', title: 'History Journey', emoji: '🏛️', description: 'Travel through time', category: 'World Knowledge' },
    
    // Creative & Arts
    { id: 'drawing', title: 'Art Studio Pro', emoji: '🎨', description: 'Professional digital art', category: 'Creative' },
    { id: 'builder', title: 'Object Builder', emoji: '🏗️', description: 'Create 3D objects', category: 'Creative' },
    
    // Puzzle Games
    { id: 'sudoku', title: 'Sudoku Master', emoji: '🔢', description: 'Number placement puzzles', category: 'Puzzles' },
    { id: 'jigsaw', title: 'Jigsaw Puzzles', emoji: '🧩', description: 'Picture piece puzzles', category: 'Puzzles' },
    { id: 'waffle', title: 'Waffle Game', emoji: '🧇', description: 'Word puzzle challenge', category: 'Puzzles' },
    
    // Action & Sports
    { id: 'aiming', title: 'Archery Challenge', emoji: '🏹', description: 'Precision archery training', category: 'Action' },
    
    // Classic Games
    { id: 'tictactoe', title: 'Tic Tac Toe Pro', emoji: '⭕', description: 'Advanced strategy game', category: 'Classic' },
    { id: 'laddersnake', title: 'Snakes & Ladders', emoji: '🐍', description: 'Classic board game', category: 'Classic' }
  ];

  const categories = [...new Set(games.map(game => game.category))];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          🎮 Ultimate Learning Hub
        </h1>
        <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Comprehensive brain training and educational games
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
        <h3 className="text-2xl font-bold text-white mb-4">🧠 Comprehensive Brain Training</h3>
        <div className="grid md:grid-cols-4 gap-6 text-white/90">
          <div>
            <div className="text-4xl mb-2">🎯</div>
            <h4 className="font-bold mb-2">Cognitive Skills</h4>
            <p className="text-sm">Memory, attention, and processing speed</p>
          </div>
          <div>
            <div className="text-4xl mb-2">📚</div>
            <h4 className="font-bold mb-2">Academic Skills</h4>
            <p className="text-sm">Math, language, science, and more</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🧩</div>
            <h4 className="font-bold mb-2">Problem Solving</h4>
            <p className="text-sm">Logic, critical thinking, and creativity</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🏆</div>
            <h4 className="font-bold mb-2">Achievement</h4>
            <p className="text-sm">Track progress and celebrate success</p>
          </div>
        </div>
      </div>
    </div>
  );
};
