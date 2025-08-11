import React, { useRef } from 'react';
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
  const shapeBtnRef = useRef<HTMLDivElement>(null);

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
      onShowShapeMenu(false);
    }
    playSound('click');
  };

  const shapes = [
    { id: 'rectangle', label: '▭' },
    { id: 'circle', label: '●' },
    { id: 'triangle', label: '▲' },
    { id: 'line', label: '─' },
    { id: 'star', label: '⭐' },
    { id: 'heart', label: '♥' },
    { id: 'diamond', label: '♦' },
    { id: 'arrow', label: '➤' },
  ];

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
          <div className="relative" ref={shapeBtnRef}>
            <Button
              variant={[
                'rectangle','circle','triangle','line','star','heart','diamond','arrow'
              ].includes(selectedTool) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolClick('shape')}
              className="p-2 text-xs"
              title="Shapes"
            >
              <Shapes className="w-4 h-4" />
            </Button>
            {showShapeMenu && (
              <div className="absolute left-0 mt-2 z-50 animate-scale-in">
                <Card className="bg-background/95 backdrop-blur border shadow-xl">
                  <CardContent className="p-2 grid grid-cols-4 gap-2">
                    {shapes.map(s => (
                      <Button
                        key={s.id}
                        variant={selectedTool === (s.id as Tool) ? 'default' : 'outline'}
                        size="sm"
                        className="p-2 text-lg"
                        onClick={() => onToolSelect(s.id as Tool)}
                      >
                        {s.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};