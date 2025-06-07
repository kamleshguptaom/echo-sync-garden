
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchFilter } from './SearchFilter';

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
import { MathRacing } from './MathRacing/MathRacing';
import { VisualPerception } from './VisualPerception/VisualPerception';
import { AttentionTraining } from './AttentionTraining/AttentionTraining';
import { FractionGame } from './FractionGame/FractionGame';
import { AlgebraGame } from './AlgebraGame/AlgebraGame';
import { CodingGame } from './CodingGame/CodingGame';
import { CriticalThinking } from './CriticalThinking/CriticalThinking';
import { GrammarGame } from './GrammarGame/GrammarGame';
import { BloodRelations } from './BloodRelations/BloodRelations';

type GameType = 
  | 'memory' | 'math' | 'word' | 'logic' | 'geometry' | 'science' | 'geography' | 'history'
  | 'tictactoe' | 'sudoku' | 'jigsaw' | 'waffle' | 'laddersnake' | 'aiming' | 'builder'
  | 'pattern' | 'concentration' | 'speedreading' | 'typing' | 'drawing' 
  | 'visualperception' | 'attention' | 'fractions' | 'algebra' | 'coding' 
  | 'criticalthinking' | 'golf' | 'carrom' | 'roadsafety' | 'numbersequence' 
  | 'mathracing' | 'grammar' | 'bloodrelations' | null;

interface GameInfo {
  id: GameType;
  title: string;
  emoji: string;
  description: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  isNew?: boolean;
  isFeatured?: boolean;
}

export const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameHistory, setGameHistory] = useState<GameType[]>([]);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  if (selectedGame) {
    const gameProps = { 
      onBack: () => {
        // Add to history only if not already the most recent
        if (gameHistory[0] !== selectedGame) {
          setGameHistory(prev => [selectedGame, ...prev.filter(g => g !== selectedGame).slice(0, 3)]);
        }
        setSelectedGame(null);
      }
    };
    
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
      case 'attention': return <AttentionTraining {...gameProps} />;
      case 'fractions': return <FractionGame {...gameProps} />;
      case 'algebra': return <AlgebraGame {...gameProps} />;
      case 'coding': return <CodingGame {...gameProps} />;
      case 'criticalthinking': return <CriticalThinking {...gameProps} />;
      case 'golf': return <GolfGame {...gameProps} />;
      case 'carrom': return <CarromGame {...gameProps} />;
      case 'roadsafety': return <RoadSafetyGame {...gameProps} />;
      case 'numbersequence': return <NumberSequence {...gameProps} />;
      case 'mathracing': return <MathRacing {...gameProps} />;
      case 'grammar': return <GrammarGame {...gameProps} />;
      case 'bloodrelations': return <BloodRelations {...gameProps} />;
      default: return null;
    }
  }

  const games: GameInfo[] = [
    // Core Cognitive Skills
    { id: 'memory', title: 'Memory Training', emoji: '🧠', description: 'Enhance memory capacity and recall', category: 'Cognitive Skills', difficulty: 'medium' },
    { id: 'attention', title: 'Attention Training', emoji: '🎯', description: 'Improve focus and concentration', category: 'Cognitive Skills', difficulty: 'medium' },
    { id: 'visualperception', title: 'Visual Perception', emoji: '👁️', description: 'Enhance visual processing skills', category: 'Cognitive Skills', difficulty: 'medium' },
    { id: 'pattern', title: 'Pattern Recognition', emoji: '🔍', description: 'Identify and predict patterns', category: 'Cognitive Skills', difficulty: 'hard' },
    { id: 'concentration', title: 'Concentration Test', emoji: '🎨', description: 'Stroop test & focus training', category: 'Cognitive Skills', difficulty: 'medium' },
    { id: 'logic', title: 'Logic Puzzles', emoji: '🧩', description: 'Develop logical reasoning', category: 'Cognitive Skills', difficulty: 'hard' },
    { id: 'criticalthinking', title: 'Critical Thinking', emoji: '🤔', description: 'Analyze and evaluate information', category: 'Cognitive Skills', difficulty: 'expert' },
    { id: 'bloodrelations', title: 'Blood Relations', emoji: '👪', description: 'Master family relationship puzzles', category: 'Cognitive Skills', difficulty: 'hard', isNew: true },
    { id: 'numbersequence', title: 'Number Patterns', emoji: '🔢', description: 'Identify numerical sequences', category: 'Cognitive Skills', difficulty: 'medium' },
    
    // Mathematics & Numbers
    { id: 'math', title: 'Math Challenge', emoji: '🧮', description: 'Comprehensive math training', category: 'Mathematics', difficulty: 'medium' },
    { id: 'mathracing', title: 'Math Racing', emoji: '🏎️', description: 'Speed math challenges', category: 'Mathematics', difficulty: 'hard' },
    { id: 'fractions', title: 'Fraction Master', emoji: '½', description: 'Learn fractions visually', category: 'Mathematics', difficulty: 'easy' },
    { id: 'algebra', title: 'Algebra Quest', emoji: '📊', description: 'Solve algebraic equations', category: 'Mathematics', difficulty: 'hard' },
    { id: 'geometry', title: 'Geometry Studio', emoji: '📐', description: 'Explore shapes and angles', category: 'Mathematics', difficulty: 'medium' },
    
    // Language & Communication
    { id: 'word', title: 'Word Games', emoji: '📝', description: 'Vocabulary and spelling', category: 'Language', difficulty: 'easy' },
    { id: 'grammar', title: 'Grammar Master', emoji: '📚', description: 'Master language structure', category: 'Language', difficulty: 'medium', isNew: true, isFeatured: true },
    { id: 'speedreading', title: 'Speed Reading', emoji: '📖', description: 'Improve reading speed', category: 'Language', difficulty: 'medium' },
    { id: 'typing', title: 'Typing Master', emoji: '⌨️', description: 'Professional typing skills', category: 'Language', difficulty: 'easy' },
    
    // STEM & Technology
    { id: 'science', title: 'Science Explorer', emoji: '🔬', description: 'Interactive science learning', category: 'STEM', difficulty: 'medium' },
    { id: 'coding', title: 'Coding Adventure', emoji: '💻', description: 'Learn programming basics', category: 'STEM', difficulty: 'hard' },
    { id: 'roadsafety', title: 'Road Safety', emoji: '🚦', description: 'Learn traffic rules and safety', category: 'STEM', difficulty: 'easy' },
    
    // World Knowledge
    { id: 'geography', title: 'Geography Quest', emoji: '🌍', description: 'Explore world geography', category: 'World Knowledge', difficulty: 'medium' },
    { id: 'history', title: 'History Journey', emoji: '🏛️', description: 'Travel through time', category: 'World Knowledge', difficulty: 'medium' },
    
    // Creative & Arts
    { id: 'drawing', title: 'Art Studio Pro', emoji: '🎨', description: 'Professional digital art', category: 'Creative', difficulty: 'easy', isFeatured: true },
    { id: 'builder', title: 'Object Builder', emoji: '🏗️', description: 'Create 3D objects', category: 'Creative', difficulty: 'medium' },
    
    // Puzzle Games
    { id: 'sudoku', title: 'Sudoku Master', emoji: '🔢', description: 'Number placement puzzles', category: 'Puzzles', difficulty: 'hard' },
    { id: 'jigsaw', title: 'Jigsaw Puzzles', emoji: '🧩', description: 'Picture piece puzzles', category: 'Puzzles', difficulty: 'easy' },
    { id: 'waffle', title: 'Waffle Game', emoji: '🧇', description: 'Word puzzle challenge', category: 'Puzzles', difficulty: 'medium' },
    
    // Sports & Action
    { id: 'aiming', title: 'Archery Challenge', emoji: '🏹', description: 'Advanced shooting range', category: 'Sports', difficulty: 'medium', isFeatured: true },
    { id: 'golf', title: 'Mini Golf', emoji: '⛳', description: 'Physics-based golf game', category: 'Sports', difficulty: 'easy' },
    { id: 'carrom', title: 'Carrom Board', emoji: '🎯', description: 'Strike and pocket coins', category: 'Sports', difficulty: 'medium' },
    
    // Classic Games
    { id: 'tictactoe', title: 'Tic Tac Toe Pro', emoji: '⭕', description: 'Advanced strategy game', category: 'Classic', difficulty: 'easy', isFeatured: true },
    { id: 'laddersnake', title: 'Snakes & Ladders', emoji: '🐍', description: 'Classic board game', category: 'Classic', difficulty: 'easy' }
  ];

  const categories = [...new Set(games.map(game => game.category))];

  // Filter and search logic
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [games, searchTerm, selectedCategory, selectedDifficulty]);

  const featuredGames = filteredGames.filter(game => game.isFeatured);
  const recentlyPlayed = gameHistory
    .slice(0, 4) // Only show 4 recent games
    .map(id => games.find(game => game.id === id))
    .filter((game): game is GameInfo => !!game);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

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

      {/* Search and Filter Component */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        categories={categories}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="mb-6">
          <p className="text-white/90 text-lg">
            Found {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>
      )}

      {/* Featured Games */}
      {featuredGames.length > 0 && !hasActiveFilters && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
            🌟 Featured Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredGames.map((game, index) => (
              <Card 
                key={`featured-${game.id}`}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedGame(game.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-5xl mb-3 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                    {game.emoji}
                  </div>
                  <CardTitle className="text-lg font-bold text-white">
                    {game.title}
                    {game.isNew && (
                      <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-sm text-white/90 mb-2 leading-relaxed">{game.description}</p>
                  {game.difficulty && (
                    <div className="mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        game.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                        game.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        game.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                      </span>
                    </div>
                  )}
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGame(game.id);
                    }}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && !hasActiveFilters && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
            🕹️ Recently Played
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyPlayed.map((game, index) => (
              <Button
                key={`recent-${game.id}-${index}`}
                className="h-auto flex flex-col items-center p-4 bg-white/20 hover:bg-white/30 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="text-2xl mb-1">{game.emoji}</div>
                <div className="text-sm font-medium text-white">{game.title}</div>
                {game.difficulty && (
                  <div className="text-xs text-white/70 mt-1">
                    {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* All Categories or Filtered Results */}
      {hasActiveFilters ? (
        // Show filtered results
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Search Results</h2>
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGames.map((game, index) => (
                <Card 
                  key={game.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/95 animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedGame(game.id as GameType)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-4xl mb-2">
                      {game.emoji}
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold">
                      {game.title}
                      {game.isNew && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">{game.description}</p>
                    <div className="mb-3 flex justify-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {game.category}
                      </span>
                      {game.difficulty && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          game.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                        </span>
                      )}
                    </div>
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
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
              <p className="text-white/70 mb-4">Try adjusting your search or filters</p>
              <Button onClick={clearFilters} className="bg-white/20 hover:bg-white/30 text-white">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Show categories as before
        categories.map((category, categoryIndex) => (
          <div key={category} className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {games
                .filter(game => game.category === category)
                .map((game, index) => (
                  <Card 
                    key={game.id}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/95 animate-scale-in"
                    style={{ animationDelay: `${(categoryIndex * 4 + index) * 0.05}s` }}
                    onClick={() => setSelectedGame(game.id as GameType)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="text-4xl mb-2">
                        {game.emoji}
                      </div>
                      <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold">
                        {game.title}
                        {game.isNew && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{game.description}</p>
                      {game.difficulty && (
                        <div className="mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            game.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                          </span>
                        </div>
                      )}
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
        ))
      )}

      {/* Bottom Info Section */}
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
