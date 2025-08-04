import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColorPaletteProps {
  colors: string[];
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  currentColor,
  onColorChange
}) => {
  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">🎨 Colors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {colors.map(color => (
            <div
              key={color}
              className={`w-8 h-8 rounded cursor-pointer border-2 transition-transform hover:scale-110 ${
                currentColor === color ? 'border-foreground scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-8 rounded border cursor-pointer"
          title="Custom color picker"
        />
      </CardContent>
    </Card>
  );
};