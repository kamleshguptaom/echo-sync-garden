import React from 'react';
import { RecycleItem, Bin } from '../types';

interface DragDropZoneProps {
  item: RecycleItem;
  bin: Bin;
  onDrop: (itemId: string, binId: string) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  item,
  bin,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    onDrop(draggedItemId, bin.category);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`w-full h-32 border-4 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 ${
        isDragOver 
          ? 'border-green-500 bg-green-100 scale-105' 
          : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className={`${bin.color} rounded-full w-20 h-20 flex items-center justify-center transition-transform ${
        isDragOver ? 'scale-110' : ''
      }`}>
        <span className="text-3xl">{bin.emoji}</span>
      </div>
    </div>
  );
};