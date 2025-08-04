import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Volume2, VolumeX, Shapes, Download, Plus, Trash2, Eye, Grid } from 'lucide-react';
import { ToolManager } from './components/ToolManager';
import { LayerManager } from './components/LayerManager';
import { ColorPalette } from './components/ColorPalette';
import { CanvasManager } from './components/CanvasManager';
import { ShapeMenu } from './components/ShapeMenu';

interface DigitalArtistProps {
  onBack: () => void;
}

export type Tool = 'brush' | 'eraser' | 'spray' | 'text' | 'rectangle' | 'circle' | 'triangle' | 'line' | 'fill' | 'eyedropper' | 'blur' | 'shape' | 'object';

export interface Layer {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  visible: boolean;
  opacity: number;
}

export const DigitalArtist: React.FC<DigitalArtistProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [symmetryEnabled, setSymmetryEnabled] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<{x: number, y: number} | null>(null);

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#90EE90', '#FFB6C1', '#DDA0DD'
  ];

  const playSound = useCallback((type: 'draw' | 'erase' | 'click') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'draw':
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        break;
      case 'erase':
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [soundEnabled]);

  useEffect(() => {
    if (layers.length === 0) {
      addLayer();
    }
  }, []);

  const addLayer = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      canvas,
      visible: true,
      opacity: 100
    };
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayer(layers.length);
  };

  const getCanvasPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (gridEnabled) {
      const gridSize = 20;
      return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize
      };
    }
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const pos = getCanvasPos(e);
    
    if (selectedTool === 'text') {
      setTextPosition(pos);
      return;
    }
    
    draw(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current || layers.length === 0) return;
    
    const canvas = layers[activeLayer]?.canvas || canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getCanvasPos(e);
    
    ctx.globalAlpha = brushOpacity / 100;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    
    switch (selectedTool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        playSound('draw');
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        playSound('erase');
        break;
        
      case 'spray':
        sprayPaint(ctx, pos.x, pos.y, brushSize, currentColor);
        playSound('draw');
        break;
        
      case 'blur':
        blurArea(ctx, pos.x, pos.y, brushSize);
        break;
        
      case 'fill':
        fillShape(ctx, pos.x, pos.y, currentColor);
        break;
    }
    
    if (symmetryEnabled) {
      const centerX = canvas.width / 2;
      const mirrorX = centerX * 2 - pos.x;
      
      ctx.strokeStyle = currentColor;
      ctx.lineTo(mirrorX, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mirrorX, pos.y);
    }
    
    redrawCanvas();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = layers[activeLayer]?.canvas;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const sprayPaint = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.fillStyle = color;
    for (let i = 0; i < 20; i++) {
      const offsetX = (Math.random() - 0.5) * size;
      const offsetY = (Math.random() - 0.5) * size;
      ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
    }
  };

  const blurArea = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const imageData = ctx.getImageData(x - size/2, y - size/2, size, size);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avgR = (data[i] + data[i + 4] + data[i + 8]) / 3;
      const avgG = (data[i + 1] + data[i + 5] + data[i + 9]) / 3;
      const avgB = (data[i + 2] + data[i + 6] + data[i + 10]) / 3;
      
      data[i] = avgR;
      data[i + 1] = avgG;
      data[i + 2] = avgB;
    }
    
    ctx.putImageData(imageData, x - size/2, y - size/2);
  };

  const fillShape = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const targetPixel = getPixel(data, x, y, ctx.canvas.width);
    
    if (colorMatch(targetPixel, hexToRgb(color))) return;
    
    floodFill(data, x, y, targetPixel, hexToRgb(color), ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(imageData, 0, 0);
  };

  const getPixel = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const colorMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
    ] : [0, 0, 0, 255];
  };

  const floodFill = (data: Uint8ClampedArray, x: number, y: number, targetColor: number[], replacementColor: number[], width: number, height: number) => {
    const stack = [[x, y]];
    
    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop()!;
      
      if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) continue;
      
      const currentPixel = getPixel(data, currentX, currentY, width);
      
      if (!colorMatch(currentPixel, targetColor)) continue;
      
      const index = (currentY * width + currentX) * 4;
      data[index] = replacementColor[0];
      data[index + 1] = replacementColor[1];
      data[index + 2] = replacementColor[2];
      data[index + 3] = replacementColor[3];
      
      stack.push([currentX + 1, currentY]);
      stack.push([currentX - 1, currentY]);
      stack.push([currentX, currentY + 1]);
      stack.push([currentX, currentY - 1]);
    }
  };

  const addText = () => {
    if (!textPosition || !textInput || layers.length === 0) return;
    
    const canvas = layers[activeLayer].canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = `${brushSize * 2}px Arial`;
    ctx.fillStyle = currentColor;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    setTextInput('');
    setTextPosition(null);
    redrawCanvas();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gridEnabled) {
      drawGrid(ctx);
    }
    
    layers.forEach(layer => {
      if (layer.visible) {
        ctx.globalAlpha = layer.opacity / 100;
        ctx.drawImage(layer.canvas, 0, 0);
      }
    });
    
    ctx.globalAlpha = 1;
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    if (layers.length === 0) return;
    
    const canvas = layers[activeLayer].canvas;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawCanvas();
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'digital-art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleLayerVisibility = (index: number) => {
    setLayers(prev => prev.map((layer, i) => 
      i === index ? { ...layer, visible: !layer.visible } : layer
    ));
    redrawCanvas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-background/20 hover:bg-background/30">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-center flex items-center gap-2">
            🎨 Digital Artist Studio
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-background/20 hover:bg-background/30"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="space-y-4">
            <ToolManager 
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
              showShapeMenu={showShapeMenu}
              onShowShapeMenu={setShowShapeMenu}
              playSound={playSound}
            />

            <ColorPalette 
              colors={colors}
              currentColor={currentColor}
              onColorChange={setCurrentColor}
            />

            {/* Brush Settings */}
            <Card className="bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">🖌️ Brush Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Size: {brushSize}px</label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opacity: {brushOpacity}%</label>
                  <Slider
                    value={[brushOpacity]}
                    onValueChange={(value) => setBrushOpacity(value[0])}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Canvas Options */}
            <Card className="bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">⚙️ Canvas Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Grid Snap</label>
                  <Switch
                    checked={gridEnabled}
                    onCheckedChange={setGridEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Symmetry</label>
                  <Switch
                    checked={symmetryEnabled}
                    onCheckedChange={setSymmetryEnabled}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={clearCanvas} variant="outline" size="sm" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                  <Button onClick={downloadCanvas} variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <CanvasManager
              canvasRef={canvasRef}
              gridEnabled={gridEnabled}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />

            {/* Text Input */}
            {textPosition && (
              <Card className="mt-4 bg-background/95 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text..."
                      className="flex-1 px-3 py-2 border rounded"
                      autoFocus
                    />
                    <Button onClick={addText} disabled={!textInput.trim()}>
                      Add Text
                    </Button>
                    <Button variant="outline" onClick={() => setTextPosition(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Layers Panel */}
          <LayerManager
            layers={layers}
            activeLayer={activeLayer}
            onLayerSelect={setActiveLayer}
            onAddLayer={addLayer}
            onToggleVisibility={toggleLayerVisibility}
            onDeleteLayer={(index) => {
              if (layers.length > 1) {
                setLayers(prev => prev.filter((_, i) => i !== index));
                setActiveLayer(Math.max(0, activeLayer - 1));
              }
            }}
          />
        </div>

        {/* Shape Menu */}
        {showShapeMenu && (
          <ShapeMenu
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            onClose={() => setShowShapeMenu(false)}
            playSound={playSound}
          />
        )}
      </div>
    </div>
  );
};