
import React from 'react';
import { Button } from '@/components/ui/button';

interface VictoryCelebrationProps {
  winner: 'X' | 'O' | 'tie';
  onNewRound: () => void;
  onClose: () => void;
}

export const VictoryCelebration: React.FC<VictoryCelebrationProps> = ({ 
  winner, 
  onNewRound, 
  onClose 
}) => {
  const getWinnerConfig = () => {
    switch (winner) {
      case 'X':
        return {
          title: '🎉 Player X Wins! 🎉',
          subtitle: 'Excellent strategy!',
          colors: 'from-blue-400 via-purple-500 to-pink-500',
          textColor: 'text-blue-100',
          emoji: '🥇'
        };
      case 'O':
        return {
          title: '🎊 Player O Wins! 🎊',
          subtitle: 'Outstanding moves!',
          colors: 'from-red-400 via-orange-500 to-yellow-500',
          textColor: 'text-red-100',
          emoji: '🏆'
        };
      case 'tie':
        return {
          title: '🤝 It\'s a Tie! 🤝',
          subtitle: 'Both played brilliantly!',
          colors: 'from-green-400 via-teal-500 to-blue-500',
          textColor: 'text-green-100',
          emoji: '⚖️'
        };
      default:
        return {
          title: 'Game Over',
          subtitle: 'Thanks for playing!',
          colors: 'from-gray-400 to-gray-600',
          textColor: 'text-gray-100',
          emoji: '🎮'
        };
    }
  };

  const config = getWinnerConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative bg-gradient-to-br ${config.colors} p-8 rounded-3xl shadow-2xl border-4 border-white/30 max-w-md w-full mx-4 animate-scale-in`}>
        {/* Celebration particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        
        {/* Content */}
        <div className="relative text-center space-y-6">
          <div className="text-6xl animate-bounce">{config.emoji}</div>
          
          <div className="space-y-2">
            <h2 className={`text-3xl font-bold ${config.textColor} animate-fade-in`}>
              {config.title}
            </h2>
            <p className={`text-lg ${config.textColor} opacity-90 animate-fade-in`} style={{ animationDelay: '0.2s' }}>
              {config.subtitle}
            </p>
          </div>

          {/* Animated celebration text */}
          {winner !== 'tie' && (
            <div className="flex justify-center space-x-2 text-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>V</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>I</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>C</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>T</span>
              <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>O</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>R</span>
              <span className="animate-bounce" style={{ animationDelay: '0.7s' }}>Y</span>
              <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🎉</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={onNewRound}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              🎮 New Round
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              📊 View Scores
            </Button>
          </div>
        </div>

        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-20 animate-pulse" />
      </div>
    </div>
  );
};
