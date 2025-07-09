import React from 'react';
import { RecycleItem } from '../types';

interface ItemCardProps {
  item: RecycleItem;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, item: RecycleItem) => void;
  onDragEnd: () => void;
  onClick: (item: RecycleItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(item)}
      className={`p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-xl'
      } bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-primary/20`}
    >
      <div className="text-center">
        <div className="text-6xl mb-3 animate-bounce">{item.emoji}</div>
        <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${item.color}`}>
          {item.category}
        </div>
        <p className="text-gray-600 text-sm mt-2">Drag to the right bin!</p>
      </div>
    </div>
  );
};