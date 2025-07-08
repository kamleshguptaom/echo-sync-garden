import React from 'react';
import { MagnetItem } from '../types';

interface MagnetLabProps {
  item: MagnetItem;
  magnetPosition: { x: number; y: number };
  isAttracting: boolean;
  onMagnetMove: (x: number, y: number) => void;
  showMagneticField: boolean;
}

export const MagnetLab: React.FC<MagnetLabProps> = ({
  item,
  magnetPosition,
  isAttracting,
  onMagnetMove,
  showMagneticField
}) => {
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onMagnetMove(x, y);
  };

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-80 overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="border-b border-gray-300" style={{ height: '10%' }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="absolute border-r border-gray-300 h-full" 
            style={{ left: `${i * 10}%`, width: '1px' }} 
          />
        ))}
      </div>

      {/* Magnetic Field Lines */}
      {showMagneticField && isAttracting && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-blue-400 rounded-full opacity-30 animate-pulse"
              style={{
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                left: `${magnetPosition.x}%`,
                top: `${magnetPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Magnet */}
      <div 
        className="absolute w-20 h-12 transition-all duration-300"
        style={{
          left: `${magnetPosition.x}%`,
          top: `${magnetPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
          <span className="text-2xl">🧲</span>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-white px-1 rounded">
          N ← → S
        </div>
      </div>
      
      {/* Test Item */}
      <div 
        className={`absolute w-24 h-24 flex items-center justify-center text-6xl transition-all duration-500 ${
          isAttracting ? 'transform scale-110' : ''
        }`}
        style={{
          right: `${isAttracting ? '70%' : '20%'}`,
          top: '40%',
          transform: `translate(50%, -50%) ${isAttracting ? 'scale(1.1) rotate(5deg)' : 'scale(1)'}`
        }}
      >
        <div className={`w-full h-full rounded-lg flex items-center justify-center ${
          item.isMagnetic 
            ? 'bg-gradient-to-r from-gray-300 to-gray-500' 
            : 'bg-gradient-to-r from-yellow-200 to-yellow-400'
        } shadow-lg`}>
          {item.emoji}
        </div>
      </div>
      
      {/* Attraction Particles */}
      {isAttracting && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-sm">
        <p className="font-medium">Move your mouse to control the magnet!</p>
      </div>
    </div>
  );
};