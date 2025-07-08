import React from 'react';
import { Planet } from '../types';

interface SolarSystemProps {
  planets: Planet[];
  onPlanetClick: (planet: Planet) => void;
  selectedPlanet: Planet | null;
  showOrbits?: boolean;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({
  planets,
  onPlanetClick,
  selectedPlanet,
  showOrbits = true
}) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-8 h-8 text-2xl';
      case 'medium': return 'w-12 h-12 text-3xl';
      case 'large': return 'w-16 h-16 text-4xl';
      default: return 'w-10 h-10 text-2xl';
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-indigo-900 via-purple-900 to-black rounded-lg overflow-hidden">
      {/* Sun */}
      <div className="absolute top-1/2 left-12 transform -translate-y-1/2">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">☀️</span>
        </div>
      </div>

      {/* Orbital Paths */}
      {showOrbits && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white/20 rounded-full"
              style={{
                width: `${100 + i * 30}px`,
                height: `${100 + i * 30}px`,
                top: '50%',
                left: '48px',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}

      {/* Planets */}
      {planets.map((planet, index) => {
        const angle = (index * 45) % 360;
        const radius = 50 + index * 20;
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;

        return (
          <div
            key={planet.name}
            onClick={() => onPlanetClick(planet)}
            className={`absolute cursor-pointer transition-all duration-300 hover:scale-125 ${
              selectedPlanet?.name === planet.name ? 'scale-125 z-10' : ''
            }`}
            style={{
              left: `${48 + x}px`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`${getSizeClass(planet.size)} rounded-full flex items-center justify-center bg-white/10 backdrop-blur hover:bg-white/20`}>
              <span>{planet.emoji}</span>
            </div>
            {selectedPlanet?.name === planet.name && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                {planet.name}
              </div>
            )}
          </div>
        );
      })}

      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};