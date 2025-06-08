
import React, { useEffect } from 'react';

interface VictoryCelebrationProps {
  winner: 'X' | 'O' | 'tie';
  onClose: () => void;
}

export const VictoryCelebration: React.FC<VictoryCelebrationProps> = ({ 
  winner, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getWinnerConfig = () => {
    switch (winner) {
      case 'X':
        return {
          title: '🎉 Player X Wins!',
          colors: 'from-cyan-400 via-blue-500 to-purple-600',
          textColor: 'text-white',
          emoji: '🥇'
        };
      case 'O':
        return {
          title: '🎊 Player O Wins!',
          colors: 'from-pink-400 via-red-500 to-orange-500',
          textColor: 'text-white',
          emoji: '🏆'
        };
      case 'tie':
        return {
          title: '🤝 It\'s a Tie!',
          colors: 'from-emerald-400 via-teal-500 to-cyan-500',
          textColor: 'text-white',
          emoji: '⚖️'
        };
      default:
        return {
          title: 'Game Over',
          colors: 'from-gray-400 to-gray-600',
          textColor: 'text-white',
          emoji: '🎮'
        };
    }
  };

  const config = getWinnerConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className={`relative bg-gradient-to-br ${config.colors} p-6 rounded-2xl shadow-2xl border-2 border-white/40 max-w-xs w-full mx-4 animate-scale-in`}>
        <style>{`
          @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
          }
          @keyframes slideUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .sparkle-animation { animation: sparkle 0.8s ease-in-out infinite; }
          .slide-up { animation: slideUp 0.5s ease-out; }
        `}</style>
        
        {/* Animated sparkles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute sparkle-animation"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse" />
        
        {/* Content */}
        <div className="relative text-center space-y-3">
          <div className="text-4xl animate-bounce">{config.emoji}</div>
          
          <h2 className={`text-xl font-bold ${config.textColor} slide-up`}>
            {config.title}
          </h2>

          {/* Animated celebration letters */}
          <div className="flex justify-center space-x-1 text-lg slide-up" style={{ animationDelay: '0.2s' }}>
            {winner !== 'tie' ? (
              ['🎉', 'W', 'I', 'N', '!', '🎉'].map((char, index) => (
                <span 
                  key={index}
                  className={`${config.textColor} font-bold animate-bounce`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {char}
                </span>
              ))
            ) : (
              ['🤝', 'T', 'I', 'E', '!', '🤝'].map((char, index) => (
                <span 
                  key={index}
                  className={`${config.textColor} font-bold animate-bounce`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {char}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 animate-pulse" />
      </div>
    </div>
  );
};
