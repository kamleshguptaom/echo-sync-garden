import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Tool } from '../DigitalArtist';

interface ShapeMenuProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
  onClose: () => void;
  playSound: (type: 'click') => void;
}

export const ShapeMenu: React.FC<ShapeMenuProps> = ({
  selectedTool,
  onToolSelect,
  onClose,
  playSound
}) => {
  const shapes = [
    { id: 'rectangle', icon: '▭', name: 'Rectangle' },
    { id: 'circle', icon: '●', name: 'Circle' },
    { id: 'triangle', icon: '▲', name: 'Triangle' },
    { id: 'line', icon: '─', name: 'Line' },
    { id: 'star', icon: '⭐', name: 'Star' },
    { id: 'heart', icon: '♥', name: 'Heart' },
    { id: 'diamond', icon: '♦', name: 'Diamond' },
    { id: 'arrow', icon: '➤', name: 'Arrow' }
  ];

  const handleShapeSelect = (shapeId: string) => {
    onToolSelect(shapeId as Tool);
    onClose();
    playSound('click');
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="bg-background/95 backdrop-blur border shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Select Shape</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {shapes.map(shape => (
              <Button
                key={shape.id}
                variant={selectedTool === shape.id ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleShapeSelect(shape.id)}
                className="p-4 text-2xl aspect-square"
                title={shape.name}
              >
                {shape.icon}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};