import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brush, Eraser, Type, Shapes, Hand } from 'lucide-react';
import type { Tool } from '../DigitalArtist';

interface ToolManagerProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
  showShapeMenu: boolean;
  onShowShapeMenu: (show: boolean) => void;
  playSound: (type: 'click') => void;
}

export const ToolManager: React.FC<ToolManagerProps> = ({
  selectedTool,
  onToolSelect,
  showShapeMenu,
  onShowShapeMenu,
  playSound
}) => {
  const tools = [
    { id: 'brush', icon: Brush, name: 'Brush' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' },
    { id: 'spray', icon: '🎨', name: 'Spray' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'fill', icon: '🪣', name: 'Fill' },
    { id: 'eyedropper', icon: '💧', name: 'Eyedropper' },
    { id: 'blur', icon: '🌀', name: 'Blur' },
    { id: 'object', icon: Hand, name: 'Object' }
  ] as const;

  const handleToolClick = (toolId: string) => {
    if (toolId === 'shape') {
      onShowShapeMenu(!showShapeMenu);
    } else {
      onToolSelect(toolId as Tool);
    }
    playSound('click');
  };

  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">🛠️ Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {tools.map(tool => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolClick(tool.id)}
              className="p-2 text-xs"
              title={tool.name}
            >
              {typeof tool.icon === 'string' ? tool.icon : <tool.icon className="w-4 h-4" />}
            </Button>
          ))}
          
          {/* Shapes Menu Button */}
          <div className="relative">
            <Button
              variant={['rectangle', 'circle', 'triangle', 'line'].includes(selectedTool) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolClick('shape')}
              className="p-2 text-xs"
              title="Shapes"
            >
              <Shapes className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};