
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { SearchFilter } from './SearchFilter';
import { GameGrid, GameInfo } from './GameGrid';
import { FeaturedSection } from './FeaturedSection';
import { GameRenderer } from './GameRenderer';
import { gamesData, getGameCategories } from './gamesConfig';

type GameType = string | null;

export const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Move all hooks before any conditional returns
  const categories = getGameCategories();

  // Filter and search logic
  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const featuredGames = useMemo(() => filteredGames.filter(game => game.isFeatured), [filteredGames]);
  
  const recentlyPlayed = useMemo(() => {
    return gameHistory
      .slice(0, 4) // Only show 4 recent games
      .map(id => gamesData.find(game => game.id === id))
      .filter((game): game is GameInfo => !!game);
  }, [gameHistory]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  // Now handle the conditional render after all hooks
  if (selectedGame) {
    return (
      <GameRenderer 
        gameId={selectedGame}
        onBack={() => {
          // Add to history only if not already the most recent
          if (gameHistory[0] !== selectedGame) {
            setGameHistory(prev => [selectedGame, ...prev.filter(g => g !== selectedGame).slice(0, 3)]);
          }
          setSelectedGame(null);
        }}
      />
    );
  }

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
      {!hasActiveFilters && (
        <FeaturedSection games={featuredGames} onGameSelect={setSelectedGame} />
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
            <GameGrid games={filteredGames} onGameSelect={setSelectedGame} />
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
            <GameGrid 
              games={gamesData.filter(game => game.category === category)}
              onGameSelect={setSelectedGame}
              animationDelay={categoryIndex * 4}
            />
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
