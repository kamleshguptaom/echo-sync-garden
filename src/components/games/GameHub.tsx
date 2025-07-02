
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { SearchFilter } from './SearchFilter';
import { GameGrid, GameInfo } from './GameGrid';
import { FeaturedSection } from './FeaturedSection';
import { GameRenderer } from './GameRenderer';
import { AdminPanel } from '../admin/AdminPanel';
import { GameHubHeader } from './GameHub/GameHubHeader';
import { RecentlyPlayedSection } from './GameHub/RecentlyPlayedSection';
import { InfoSection } from './GameHub/InfoSection';
import { gamesData, getGameCategories } from './gamesConfig';

type GameType = string | null;

export const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

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
      .slice(0, 4)
      .map(id => gamesData.find(game => game.id === id))
      .filter((game): game is GameInfo => !!game);
  }, [gameHistory]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleBackFromGame = () => {
    if (selectedGame && gameHistory[0] !== selectedGame) {
      setGameHistory(prev => [selectedGame, ...prev.filter(g => g !== selectedGame).slice(0, 3)]);
    }
    setSelectedGame(null);
  };

  // Handle admin panel
  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  // Handle game rendering
  if (selectedGame) {
    return <GameRenderer gameId={selectedGame} onBack={handleBackFromGame} />;
  }

  return (
    <div className="container mx-auto p-6">
      <GameHubHeader onShowAdmin={() => setShowAdmin(true)} />

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

      {hasActiveFilters && (
        <div className="mb-6">
          <p className="text-white/90 text-lg">
            Found {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>
      )}

      {!hasActiveFilters && (
        <FeaturedSection games={featuredGames} onGameSelect={handleGameSelect} />
      )}

      <RecentlyPlayedSection 
        recentlyPlayed={recentlyPlayed} 
        onGameSelect={handleGameSelect} 
      />

      {hasActiveFilters ? (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Search Results</h2>
          {filteredGames.length > 0 ? (
            <GameGrid games={filteredGames} onGameSelect={handleGameSelect} />
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
        categories.map((category, categoryIndex) => (
          <div key={category} className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              {category}
            </h2>
            <GameGrid 
              games={gamesData.filter(game => game.category === category)}
              onGameSelect={handleGameSelect}
              animationDelay={categoryIndex * 4}
            />
          </div>
        ))
      )}

      <InfoSection />
    </div>
  );
};
