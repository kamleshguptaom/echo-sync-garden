import React from 'react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: (vehicle: Vehicle) => void;
  onDragStart: (e: React.DragEvent, vehicle: Vehicle) => void;
  onDragEnd: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, vehicle)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(vehicle)}
      className={`p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-xl'
      } ${
        isSelected 
          ? 'ring-4 ring-blue-500 bg-blue-100 scale-105' 
          : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-primary/20'
      }`}
    >
      <div className="text-center">
        <div className="text-6xl mb-3 animate-bounce">{vehicle.emoji}</div>
        <h4 className="font-bold text-gray-800 text-lg mb-1">{vehicle.name}</h4>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-2 ${
          vehicle.category === 'land' ? 'bg-green-500' :
          vehicle.category === 'air' ? 'bg-blue-500' : 'bg-cyan-500'
        }`}>
          {vehicle.category}
        </div>
        <p className="text-gray-600 text-sm mb-1">{vehicle.speed}</p>
        <p className="text-gray-500 text-xs">{vehicle.environment}</p>
      </div>
    </div>
  );
};