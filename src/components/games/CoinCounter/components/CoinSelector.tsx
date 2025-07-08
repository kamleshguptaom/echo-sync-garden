import React from 'react';
import { Coin } from '../types';

interface CoinSelectorProps {
  coin: Coin;
  onCountChange: (change: number) => void;
  maxCoins: number;
}

export const CoinSelector: React.FC<CoinSelectorProps> = ({ 
  coin, 
  onCountChange, 
  maxCoins 
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{coin.emoji}</div>
        <h3 className="text-xl font-bold">{coin.name}</h3>
        <p className="text-lg text-gray-600">{coin.value}¢</p>
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => onCountChange(-1)}
          disabled={coin.count === 0}
          className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold flex items-center justify-center transition-colors"
        >
          -
        </button>
        <div className="w-16 text-center">
          <span className="text-3xl font-bold">{coin.count}</span>
        </div>
        <button
          onClick={() => onCountChange(1)}
          disabled={coin.count === maxCoins}
          className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-lg font-bold text-green-600">
          Total: {coin.value * coin.count}¢
        </div>
      </div>
      
      {/* Visual representation */}
      <div className="grid grid-cols-5 gap-1 min-h-[60px]">
        {[...Array(coin.count)].map((_, i) => (
          <div 
            key={i} 
            className="text-2xl animate-bounce" 
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {coin.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};