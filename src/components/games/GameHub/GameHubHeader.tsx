
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameHubHeaderProps {
  onShowAdmin: () => void;
}

export const GameHubHeader: React.FC<GameHubHeaderProps> = ({ onShowAdmin }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-start">
        <div></div>
        <div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            🎮 Ultimate Learning Hub
          </h1>
          <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Comprehensive brain training and educational games
          </p>
        </div>
        <Button 
          onClick={onShowAdmin}
          className="bg-orange-500 hover:bg-orange-600 text-white animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          🔧 Admin
        </Button>
      </div>
    </div>
  );
};
