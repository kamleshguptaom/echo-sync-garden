
import React from 'react';
import { GameItem } from '../types';

interface DropZoneProps {
  id: string;
  title: string;
  emoji: string;
  color: string;
  onDrop: (zoneId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  items: GameItem[];
  isCorrectZone: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  id,
  title,
  emoji,
  color,
  onDrop,
  onDragOver,
  items,
  isCorrectZone
}) => {
  const getZoneStyle = () => {
    if (id === 'healthy' || id === 'school' || id === 'sports' || id === 'hygiene' || id === 'bedtime' || id === 'recyclable' || id === 'math') {
      return 'border-green-500 bg-green-50 hover:bg-green-100 hover:border-green-600';
    }
    return 'border-red-500 bg-red-50 hover:bg-red-100 hover:border-red-600';
  };

  return (
    <div
      onDrop={() => onDrop(id)}
      onDragOver={onDragOver}
      className={`
        w-64 h-48 border-4 border-dashed rounded-xl
        flex flex-col items-center justify-center
        transition-all duration-300 cursor-pointer
        ${getZoneStyle()}
        hover:scale-105 hover:shadow-xl
        ${items.length > 0 ? 'shadow-lg' : ''}
      `}
    >
      <div className="text-6xl mb-3 animate-bounce">{emoji}</div>
      <div className="font-bold text-lg text-gray-800 text-center px-2">{title}</div>
      <div className="text-sm text-gray-600 mt-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
        Items: {items.length}
      </div>
      
      {/* Show items in the zone */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 max-w-full">
          {items.slice(0, 6).map((item, index) => (
            <div key={index} className="text-lg">
              {item.emoji}
            </div>
          ))}
          {items.length > 6 && (
            <div className="text-xs text-gray-500">+{items.length - 6}</div>
          )}
        </div>
      )}
    </div>
  );
};
