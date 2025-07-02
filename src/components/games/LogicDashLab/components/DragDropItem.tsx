
import React from 'react';
import { GameItem } from '../types';

interface DragDropItemProps {
  item: GameItem;
  onDragStart: (item: GameItem) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export const DragDropItem: React.FC<DragDropItemProps> = ({
  item,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(item)}
      onDragEnd={onDragEnd}
      className={`
        cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:scale-110
        bg-white rounded-xl shadow-lg p-4 border-2
        flex flex-col items-center justify-center
        aspect-square
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${item.isHealthy ? 'border-green-400 hover:border-green-500' : 'border-red-400 hover:border-red-500'}
        hover:shadow-xl transform hover:-translate-y-1
      `}
    >
      <div className="text-3xl mb-2">{item.emoji}</div>
      <div className="text-xs font-semibold text-center text-gray-700">
        {item.name}
      </div>
    </div>
  );
};
