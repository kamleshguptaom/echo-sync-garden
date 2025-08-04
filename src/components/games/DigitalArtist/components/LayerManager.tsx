import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Layer } from '../DigitalArtist';

interface LayerManagerProps {
  layers: Layer[];
  activeLayer: number;
  onLayerSelect: (index: number) => void;
  onAddLayer: () => void;
  onToggleVisibility: (index: number) => void;
  onDeleteLayer: (index: number) => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  activeLayer,
  onLayerSelect,
  onAddLayer,
  onToggleVisibility,
  onDeleteLayer
}) => {
  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          📑 Layers
          <Button onClick={onAddLayer} size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`p-2 border rounded cursor-pointer transition-colors ${
              activeLayer === index 
                ? 'bg-primary/20 border-primary' 
                : 'bg-background/50 border-border hover:bg-muted/50'
            }`}
            onClick={() => onLayerSelect(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{layer.name}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(index);
                  }}
                  className="p-1 h-6 w-6"
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                {layers.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(index);
                    }}
                    className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs opacity-70">Opacity: {layer.opacity}%</label>
              <Slider
                value={[layer.opacity]}
                onValueChange={(value) => {
                  // Update layer opacity logic would go here
                }}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};