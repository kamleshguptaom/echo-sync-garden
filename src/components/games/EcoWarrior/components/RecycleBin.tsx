import React from 'react';
import { Bin, RecycleItem } from '../types';

interface RecycleBinProps {
  bin: Bin;
  onDrop: (itemId: string, binCategory: string) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}

export const RecycleBin: React.FC<RecycleBinProps> = ({
  bin,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    onDrop(draggedItemId, bin.category);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative w-full max-w-[180px] sm:max-w-[200px] h-48 sm:h-56 border-4 border-dashed rounded-2xl transition-all duration-300 ${
        isDragOver 
          ? 'border-green-500 bg-green-100 scale-105 shadow-xl' 
          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      {/* Bin Header */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
        <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-white font-bold ${bin.color}`}>
          <span className="text-sm sm:text-2xl">{bin.emoji}</span>
          <span className="text-xs sm:text-base">{bin.name}</span>
        </div>
      </div>

      {/* Bin Container */}
      <div className={`absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ${bin.color} flex items-center justify-center transition-transform ${
        isDragOver ? 'scale-110' : ''
      }`}>
        <span className="text-3xl sm:text-5xl">{bin.emoji}</span>
      </div>

      {/* Items in Bin */}
      <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 p-1 sm:p-2">
        <div className="flex flex-wrap gap-1 justify-center max-h-8 sm:max-h-12 overflow-hidden">
          {bin.items.slice(0, 6).map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="text-sm sm:text-lg animate-bounce bg-white/80 rounded-full p-0.5 sm:p-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.emoji}
            </div>
          ))}
          {bin.items.length > 6 && (
            <div className="text-xs sm:text-sm font-bold text-gray-700 bg-white/80 rounded-full px-1 sm:px-2">
              +{bin.items.length - 6}
            </div>
          )}
        </div>
      </div>

      {/* Drop Animation */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-6xl animate-ping">✨</div>
        </div>
      )}
    </div>
  );
};