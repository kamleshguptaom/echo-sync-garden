
import React from 'react';
import { GameCategoryGrid } from '@/components/games/GameCategoryGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🎮 Educational Game Center</h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Choose your learning adventure! Explore categories designed to make education fun and engaging.
          </p>
        </div>
        <GameCategoryGrid />
      </div>
    </div>
  );
};

export default Index;
