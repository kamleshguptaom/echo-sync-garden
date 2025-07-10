import React from 'react';
import { TransportCategory, Vehicle } from '../types';

interface TransportZoneProps {
  category: TransportCategory;
  isActive: boolean;
  onDrop: (category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  vehicleCount: number;
  vehiclesInZone?: Vehicle[];
}

export const TransportZone: React.FC<TransportZoneProps> = ({
  category,
  isActive,
  onDrop,
  onDragOver,
  onDragLeave,
  vehicleCount,
  vehiclesInZone = []
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
      className={`relative w-full max-w-[280px] h-48 sm:h-56 rounded-2xl border-4 border-dashed transition-all duration-300 ${
        isActive 
          ? 'border-green-500 bg-green-100 scale-105 shadow-xl' 
          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      {/* Background Scene */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center ${category.color} shadow-lg`}>
          <span className="text-4xl sm:text-6xl">{category.emoji}</span>
        </div>
      </div>
      
      {/* Category Info */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 text-center">
        <h3 className="font-bold text-sm sm:text-lg text-gray-800">{category.name} Transport</h3>
        <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{category.description}</p>
      </div>
      
      {/* Vehicles in Zone */}
      {vehiclesInZone.length > 0 && (
        <div className="absolute top-8 sm:top-12 left-2 right-2 flex flex-wrap justify-center gap-1">
          {vehiclesInZone.map((vehicle, index) => (
            <div 
              key={`${vehicle.id}-${index}`} 
              className="text-lg sm:text-xl animate-bounce bg-white/80 rounded-full p-1" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {vehicle.emoji}
            </div>
          ))}
        </div>
      )}
      
      {/* Vehicle Count */}
      {vehicleCount > 0 && (
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
          <div className="bg-green-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
            {vehicleCount}
          </div>
        </div>
      )}
      
      {/* Examples */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-8 sm:right-12 text-center">
        <p className="text-xs text-gray-500 hidden sm:block">
          {category.examples.slice(0, 2).join(', ')}...
        </p>
      </div>
      
      {/* Drop Animation */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-6xl animate-ping">✨</div>
        </div>
      )}
    </div>
  );
};