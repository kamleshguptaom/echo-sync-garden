import React from 'react';
import { Vehicle } from '../types';

interface VehicleGarageProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

export const VehicleGarage: React.FC<VehicleGarageProps> = ({ 
  vehicles, 
  onVehicleSelect, 
  selectedVehicle 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {vehicles.map((vehicle, index) => (
        <div
          key={index}
          onClick={() => onVehicleSelect(vehicle)}
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            selectedVehicle?.name === vehicle.name 
              ? 'bg-yellow-200 border-4 border-yellow-500 scale-105' 
              : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">{vehicle.emoji}</div>
            <h3 className="font-bold text-lg">{vehicle.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{vehicle.category}</p>
            <div className="mt-2 p-2 bg-blue-100 rounded">
              <p className="text-xs font-medium text-blue-800">{vehicle.sound}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};