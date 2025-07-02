
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
        bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200
        flex flex-col items-center justify-center
        w-20 h-20 m-2
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${item.isHealthy ? 'border-green-400' : 'border-red-400'}
        hover:shadow-xl
      `}
      style={{
        transform: `translate(${item.position.x}px, ${item.position.y}px)`
      }}
    >
      <div className="text-2xl mb-1">{item.emoji}</div>
      <div className="text-xs font-semibold text-center text-gray-700">
        {item.name}
      </div>
    </div>
  );
};
