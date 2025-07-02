
import React from 'react';

interface DropZoneProps {
  id: string;
  title: string;
  emoji: string;
  color: string;
  onDrop: (zoneId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  items: any[];
  isCorrectZone: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  id,
  title,
  emoji,
  color,
  onDrop,
  onDragOver,
  items,
  isCorrectZone
}) => {
  return (
    <div
      onDrop={() => onDrop(id)}
      onDragOver={onDragOver}
      className={`
        w-64 h-40 border-4 border-dashed rounded-xl
        flex flex-col items-center justify-center
        transition-all duration-300
        ${color} ${isCorrectZone ? 'border-green-500 bg-green-100' : 'border-gray-400 bg-gray-50'}
        hover:scale-105 hover:shadow-xl
        ${id === 'healthy' ? 'hover:border-green-600' : 'hover:border-red-600'}
      `}
    >
      <div className="text-5xl mb-3">{emoji}</div>
      <div className="font-bold text-lg text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mt-2 bg-white/50 px-3 py-1 rounded-full">
        Items: {items.length}
      </div>
    </div>
  );
};
