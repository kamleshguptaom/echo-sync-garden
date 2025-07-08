import React from 'react';
import { RecycleItem } from '../types';

interface DraggableItemProps {
  item: RecycleItem;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, item: RecycleItem) => void;
  onDragEnd: () => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  isDragging,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      className={`${item.color} rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-lg'
      }`}
    >
      <div className="text-center">
        <div className="text-5xl mb-2 animate-bounce">{item.emoji}</div>
        <h3 className="font-bold text-white text-lg">{item.name}</h3>
        <p className="text-white/90 text-sm">Drag me to the right bin!</p>
      </div>
    </div>
  );
};