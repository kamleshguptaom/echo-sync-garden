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
      className={`relative h-64 border-4 border-dashed rounded-2xl transition-all duration-300 ${
        isDragOver 
          ? 'border-green-500 bg-green-100 scale-105 shadow-xl' 
          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      {/* Bin Header */}
      <div className="absolute top-4 left-4 right-4">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold ${bin.color}`}>
          <span className="text-2xl">{bin.emoji}</span>
          <span>{bin.name}</span>
        </div>
      </div>

      {/* Bin Container */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-2xl ${bin.color} flex items-center justify-center transition-transform ${
        isDragOver ? 'scale-110' : ''
      }`}>
        <span className="text-6xl">{bin.emoji}</span>
      </div>

      {/* Items in Bin */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <div className="flex flex-wrap gap-1 justify-center">
          {bin.items.slice(0, 4).map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="text-lg animate-pulse"
            >
              {item.emoji}
            </div>
          ))}
          {bin.items.length > 4 && (
            <div className="text-sm font-bold text-gray-700">
              +{bin.items.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Drop Animation */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-ping">✨</div>
        </div>
      )}
    </div>
  );
};