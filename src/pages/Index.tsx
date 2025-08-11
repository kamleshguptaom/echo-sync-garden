
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GameCategoryGrid } from '@/components/games/GameCategoryGrid';
import { GameRenderer } from '@/components/games/GameRenderer';
import { RecentlyPlayedSection } from '@/components/games/GameHub/RecentlyPlayedSection';
import { GameInfo } from '@/components/games/GameGrid';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recentlyPlayed, setRecentlyPlayed] = useState<GameInfo[]>([]);
  const gameId = searchParams.get('game');

  // Load recently played games from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentlyPlayed');
    if (stored) {
      setRecentlyPlayed(JSON.parse(stored));
    }
  }, []);

  // When a game is opened via URL (e.g., from category pages), record it
  useEffect(() => {
    if (!gameId) return;
    const id = gameId;
    const existing = recentlyPlayed.find(g => g.id === id);
    const gameInfo: GameInfo = existing || {
      id,
      title: getGameTitle(id),
      emoji: getGameEmoji(id),
      description: '',
      category: 'general',
      difficulty: 'medium'
    };
    const updated = [gameInfo, ...recentlyPlayed.filter(g => g.id !== id)].slice(0, 4);
    setRecentlyPlayed(updated);
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
  }, [gameId]);

  // Handle game selection
  const handleGameSelect = (selectedGameId: string) => {
    // Add to recently played
    const gameInfo: GameInfo = {
      id: selectedGameId,
      title: getGameTitle(selectedGameId),
      emoji: getGameEmoji(selectedGameId),
      description: '',
      category: 'general',
      difficulty: 'medium'
    };

    const updated = [gameInfo, ...recentlyPlayed.filter(g => g.id !== selectedGameId)].slice(0, 4);
    setRecentlyPlayed(updated);
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
    
    setSearchParams({ game: selectedGameId });
  };

  // Helper functions to get game info
  const getGameTitle = (id: string): string => {
    const titles: Record<string, string> = {
      'word-game': 'Word Master',
      'phonics': 'Phonics Fun',
      'word': 'Word Explorer',
      'grammar': 'Grammar Guide',
      'typing': 'Typing Master',
      'speed-reading': 'Speed Reading',
      'physics': 'Physics Fun',
      'drawing': 'Digital Artist',
      'mindmaze': 'Mind Maze',
      'concentration': 'Concentration',
      'memory': 'Memory Match',
      'attention': 'Attention Training'
    };
    return titles[id] || id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getGameEmoji = (id: string): string => {
    const emojis: Record<string, string> = {
      'word-game': '📚',
      'phonics': '🔤',
      'word': '📝',
      'grammar': '📖',
      'typing': '⌨️',
      'speed-reading': '⚡',
      'physics': '⚛️',
      'drawing': '🖌️',
      'mindmaze': '🧩',
      'concentration': '🧠',
      'memory': '🃏',
      'attention': '👁️'
    };
    return emojis[id] || '🎮';
  };

  // If a game is selected, render it
  if (gameId) {
    return <GameRenderer gameId={gameId} onBack={handleBackFromGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🎮 Educational Game Center</h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Choose your learning adventure! Explore categories designed to make education fun and engaging.
          </p>
        </div>
        
        <RecentlyPlayedSection 
          recentlyPlayed={recentlyPlayed}
          onGameSelect={handleGameSelect}
        />
        
        <GameCategoryGrid />
      </div>
    </div>
  );
};

export default Index;
