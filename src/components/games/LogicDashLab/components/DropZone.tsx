
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
        w-48 h-32 border-4 border-dashed rounded-lg
        flex flex-col items-center justify-center
        transition-all duration-300
        ${color} ${isCorrectZone ? 'border-green-500 bg-green-100' : 'border-gray-400 bg-gray-50'}
        hover:scale-105 hover:shadow-lg
      `}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-bold text-gray-800">{title}</div>
      <div className="text-xs text-gray-600 mt-1">
        Items: {items.length}
      </div>
    </div>
  );
};
