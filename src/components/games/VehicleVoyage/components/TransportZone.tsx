import React from 'react';
import { TransportCategory } from '../types';

interface TransportZoneProps {
  category: TransportCategory;
  isActive: boolean;
  onDrop: (category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  vehicleCount: number;
}

export const TransportZone: React.FC<TransportZoneProps> = ({
  category,
  isActive,
  onDrop,
  onDragOver,
  onDragLeave,
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
      onDragLeave={onDragLeave}
      className={`relative h-48 rounded-2xl border-4 border-dashed transition-all duration-300 ${
        isActive 
          ? 'border-green-500 bg-green-100 scale-105 shadow-xl' 
          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      {/* Background Scene */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${category.color} shadow-lg`}>
          <span className="text-6xl">{category.emoji}</span>
        </div>
      </div>
      
      {/* Category Info */}
      <div className="absolute top-4 left-4 right-4 text-center">
        <h3 className="font-bold text-lg text-gray-800">{category.name} Transport</h3>
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>
      
      {/* Vehicle Count */}
      {vehicleCount > 0 && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
            {vehicleCount}
          </div>
        </div>
      )}
      
      {/* Examples */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-xs text-gray-500">
          {category.examples.slice(0, 2).join(', ')}...
        </p>
      </div>
      
      {/* Drop Animation */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-ping">✨</div>
        </div>
      )}
    </div>
  );
};