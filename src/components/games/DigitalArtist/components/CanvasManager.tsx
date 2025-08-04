import React from 'react';
import { Card } from '@/components/ui/card';

interface CanvasManagerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gridEnabled: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const CanvasManager: React.FC<CanvasManagerProps> = ({
  canvasRef,
  gridEnabled,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  return (
    <Card className="bg-background/95 backdrop-blur p-4">
      <div className="relative overflow-hidden rounded-lg">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={`border border-border cursor-crosshair max-w-full h-auto ${
            gridEnabled ? 'bg-grid' : 'bg-background'
          }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{
            backgroundImage: gridEnabled 
              ? `radial-gradient(circle, hsl(var(--muted)) 1px, transparent 1px)`
              : 'none',
            backgroundSize: gridEnabled ? '20px 20px' : 'auto'
          }}
        />
      </div>
    </Card>
  );
};