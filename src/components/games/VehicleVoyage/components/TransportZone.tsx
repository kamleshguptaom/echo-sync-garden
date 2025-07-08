import React from 'react';
import { TransportCategory } from '../types';

interface TransportZoneProps {
  category: TransportCategory;
  isActive: boolean;
  onDrop: (category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  vehicleCount: number;
}

export const TransportZone: React.FC<TransportZoneProps> = ({
  category,
  isActive,
  onDrop,
  onDragOver,
  vehicleCount
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(category.name.toLowerCase());
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={onDragOver}
      className={`relative h-40 rounded-xl border-4 border-dashed transition-all duration-300 ${
        isActive 
          ? 'border-green-500 bg-green-100 scale-105' 
          : 'border-gray-300 bg-gray-50'
      }`}
    >
      {/* Background Scene */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${category.color}`}>
          <span className="text-6xl">{category.emoji}</span>
        </div>
      </div>
      
      {/* Category Label */}
      <div className="absolute bottom-2 left-2 right-2 text-center">
        <h3 className="font-bold text-lg">{category.name} Transport</h3>
        <p className="text-sm text-gray-600">{category.description}</p>
        {vehicleCount > 0 && (
          <div className="mt-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mx-auto">
            {vehicleCount}
          </div>
        )}
      </div>
      
      {/* Drop Animation */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl animate-ping">✨</div>
        </div>
      )}
    </div>
  );
};