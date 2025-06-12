
import React, { useRef, useEffect } from 'react';
import { Target, Shot, WeaponType } from './types';

interface GameCanvasProps {
  targets: Target[];
  shots: Shot[];
  weapon: WeaponType;
  background: string;
  aimPosition: { x: number; y: number };
  isAiming: boolean;
  isPowerBuilding: boolean;
  power: number;
  windEffect: { direction: number; strength: number };
  combo: number;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onStartAiming: () => void;
  onStartPowerBuilding: () => void;
  onShoot: () => void;
}

const backgrounds = {
  forest: {
    gradient: 'from-green-400 via-green-500 to-green-600',
    elements: ['🌲', '🌳', '🌿', '☀️', '☁️', '🦋']
  },
  mountain: {
    gradient: 'from-blue-400 via-gray-500 to-gray-600',
    elements: ['🏔️', '⛰️', '🗻', '❄️', '☁️', '🦅']
  },
  desert: {
    gradient: 'from-yellow-400 via-orange-500 to-orange-600',
    elements: ['🌵', '🐪', '🦂', '☀️', '🏜️', '💨']
  },
  ocean: {
    gradient: 'from-blue-300 via-blue-500 to-blue-600',
    elements: ['🌊', '🐟', '🦈', '⛵', '☀️', '🏝️']
  },
  sunset: {
    gradient: 'from-orange-400 via-pink-500 to-pink-600',
    elements: ['🌅', '🌸', '🦆', '💫', '☁️', '🌙']
  }
};

const weaponEmojis = {
  bow: '🏹',
  gun: '🔫',
  dart: '🎯'
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  targets,
  shots,
  weapon,
  background,
  aimPosition,
  isAiming,
  isPowerBuilding,
  power,
  windEffect,
  combo,
  onMouseMove,
  onStartAiming,
  onStartPowerBuilding,
  onShoot
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const currentBg = backgrounds[background as keyof typeof backgrounds] || backgrounds.forest;

  const getWindIndicator = () => {
    const windIcons = ['➡️', '↗️', '⬆️', '↖️', '⬅️', '↙️', '⬇️', '↘️'];
    const directionIndex = Math.floor(windEffect.direction / 45) % 8;
    return windIcons[directionIndex];
  };

  return (
    <div className="relative">
      <div 
        ref={canvasRef}
        className={`relative w-full h-96 rounded-xl border-4 border-teal-300 overflow-hidden cursor-crosshair bg-gradient-to-b ${currentBg.gradient}`}
        onMouseMove={onMouseMove}
        onClick={onStartAiming}
        onMouseDown={onStartPowerBuilding}
        onMouseUp={onShoot}
        style={{ cursor: isAiming ? 'none' : 'crosshair' }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {currentBg.elements.map((element, index) => (
            <div
              key={index}
              className="absolute text-2xl opacity-70"
              style={{
                left: `${(index * 15 + 10) % 90}%`,
                top: `${(index * 20 + 5) % 80}%`,
                transform: `rotate(${index * 30}deg)`
              }}
            >
              {element}
            </div>
          ))}
        </div>

        {/* Weapon Display */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg">
          <div className="text-3xl">{weaponEmojis[weapon]}</div>
          <div className="text-xs text-center font-bold">{weapon.toUpperCase()}</div>
        </div>

        {/* Wind Indicator */}
        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg text-center">
          <div className="text-xl">{getWindIndicator()}</div>
          <div className="text-xs">Wind: {Math.round(windEffect.strength * 100)}%</div>
        </div>

        {/* Combo Display */}
        {combo > 0 && (
          <div className="absolute top-4 left-4 bg-yellow-400/90 p-2 rounded-lg font-bold animate-pulse">
            🔥 Combo x{combo}
          </div>
        )}
        
        {/* Targets */}
        {targets.map((target) => (
          <div
            key={target.id}
            className="absolute transition-all duration-100 hover:scale-110"
            style={{
              left: target.x,
              top: target.y,
              width: target.size,
              height: target.size,
              fontSize: target.size * 0.8,
              filter: target.hit ? 'grayscale(100%)' : 'none',
              opacity: target.hit ? 0.5 : 1
            }}
          >
            {target.emoji}
            {target.hit && (
              <div className="absolute inset-0 flex items-center justify-center text-green-500 font-bold">
                +{target.points}
              </div>
            )}
          </div>
        ))}
        
        {/* Shot marks */}
        {shots.map((shot, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 border-2 border-white rounded-full animate-pulse"
            style={{ 
              left: shot.x - 4, 
              top: shot.y - 4,
              backgroundColor: shot.points > 0 ? '#10b981' : '#ef4444',
              boxShadow: '0 0 10px rgba(255,255,255,0.8)'
            }}
          />
        ))}
        
        {/* Crosshair */}
        {isAiming && (
          <div className="absolute pointer-events-none">
            <div 
              className="absolute w-8 h-8 border-2 border-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: aimPosition.x, top: aimPosition.y }}
            >
              <div className="absolute w-full h-0.5 bg-red-500 top-1/2 transform -translate-y-1/2"></div>
              <div className="absolute h-full w-0.5 bg-red-500 left-1/2 transform -translate-x-1/2"></div>
            </div>
            {/* Trajectory line */}
            <div 
              className="absolute w-1 bg-red-300 opacity-50 transform origin-bottom"
              style={{ 
                left: aimPosition.x, 
                top: aimPosition.y,
                height: `${power}px`,
                transform: `rotate(${-windEffect.direction}deg)`
              }}
            />
          </div>
        )}
        
        {/* Power meter */}
        {isPowerBuilding && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-black/30 rounded-full overflow-hidden border-2 border-white">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-100"
              style={{ width: `${power}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              Power: {Math.round(power)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
