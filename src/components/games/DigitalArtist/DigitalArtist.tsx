import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Volume2, VolumeX, Grid, Eye, Palette, Brush, Type, Shapes, Eraser, Hand, Download, Plus, Trash2, Copy } from 'lucide-react';

interface DigitalArtistProps {
  onBack: () => void;
}

type Tool = 'brush' | 'eraser' | 'spray' | 'text' | 'rectangle' | 'circle' | 'triangle' | 'line' | 'fill' | 'eyedropper' | 'blur';

interface DrawingState {
  tool: Tool;
  color: string;
  size: number;
  opacity: number;
  isDrawing: boolean;
}

interface Layer {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  visible: boolean;
  opacity: number;
}

export const DigitalArtist: React.FC<DigitalArtistProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
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

  const tools = [
    { id: 'brush', icon: Brush, name: 'Brush' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' },
    { id: 'spray', icon: '🎨', name: 'Spray' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'rectangle', icon: '▭', name: 'Rectangle' },
    { id: 'circle', icon: '●', name: 'Circle' },
    { id: 'triangle', icon: '▲', name: 'Triangle' },
    { id: 'line', icon: '─', name: 'Line' },
    { id: 'fill', icon: '🪣', name: 'Fill' },
    { id: 'eyedropper', icon: '💧', name: 'Eyedropper' },
    { id: 'blur', icon: '🌀', name: 'Blur' }
  ] as const;

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
    // Initialize first layer
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
    
    // Grid snapping
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
        floodFill(ctx, pos.x, pos.y, currentColor);
        break;
    }
    
    // Symmetry mode
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

  const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
    
    // Draw grid if enabled
    if (gridEnabled) {
      drawGrid(ctx);
    }
    
    // Draw all visible layers
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

  const ShapeMenu = () => {
    const shapes = [
      { id: 'rectangle', icon: '▭', name: 'Rectangle' },
      { id: 'circle', icon: '●', name: 'Circle' },
      { id: 'triangle', icon: '▲', name: 'Triangle' },
      { id: 'line', icon: '─', name: 'Line' }
    ];

    return (
      <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
        <div className="grid grid-cols-2 gap-2">
          {shapes.map(shape => (
            <Button
              key={shape.id}
              variant={selectedTool === shape.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedTool(shape.id as Tool);
                setShowShapeMenu(false);
                playSound('click');
              }}
              className="p-2 text-lg"
            >
              {shape.icon}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🎨 Digital Artist Studio
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">🛠️ Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tool Selection */}
              <div className="grid grid-cols-2 gap-2">
                {tools.slice(0, -4).map(tool => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedTool(tool.id as Tool);
                      playSound('click');
                    }}
                    className="p-2 text-xs"
                  >
                    {typeof tool.icon === 'string' ? tool.icon : <tool.icon className="w-4 h-4" />}
                  </Button>
                ))}
                
                {/* Shapes Menu */}
                <div className="relative">
                  <Button
                    variant={['rectangle', 'circle', 'triangle', 'line'].includes(selectedTool) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowShapeMenu(!showShapeMenu)}
                    className="p-2 text-xs"
                  >
                    <Shapes className="w-4 h-4" />
                  </Button>
                  {showShapeMenu && <ShapeMenu />}
                </div>

                {/* Remaining tools */}
                {tools.slice(-3).map(tool => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedTool(tool.id as Tool);
                      playSound('click');
                    }}
                    className="p-2 text-xs"
                  >
                    {typeof tool.icon === 'string' ? tool.icon : <tool.icon className="w-4 h-4" />}
                  </Button>
                ))}
              </div>

              {/* Color Palette */}
              <div>
                <label className="block text-sm font-medium mb-2">Colors</label>
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {colors.map(color => (
                    <div
                      key={color}
                      className={`w-8 h-8 rounded cursor-pointer border-2 ${
                        currentColor === color ? 'border-black' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>

              {/* Brush Settings */}
              <div className="space-y-3">
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
              </div>

              {/* Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Grid Snap</label>
                  <Switch checked={gridEnabled} onCheckedChange={setGridEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Symmetry</label>
                  <Switch checked={symmetryEnabled} onCheckedChange={setSymmetryEnabled} />
                </div>
              </div>

              {/* Text Input */}
              {selectedTool === 'text' && textPosition && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text..."
                    className="w-full p-2 border rounded"
                  />
                  <Button onClick={addText} size="sm" className="w-full">
                    Add Text
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur">
              <CardContent className="p-4">
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="block max-w-full h-auto cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={clearCanvas} variant="outline" size="sm">
                    Clear
                  </Button>
                  <Button onClick={downloadCanvas} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Layers Panel */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">📚 Layers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={addLayer} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Add Layer
              </Button>
              
              <div className="space-y-1">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`p-2 border rounded cursor-pointer ${
                      activeLayer === index ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                    }`}
                    onClick={() => setActiveLayer(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{layer.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(index);
                        }}
                      >
                        {layer.visible ? <Eye className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Slider
                      value={[layer.opacity]}
                      onValueChange={(value) => {
                        setLayers(prev => prev.map((l, i) => 
                          i === index ? { ...l, opacity: value[0] } : l
                        ));
                        redrawCanvas();
                      }}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full mt-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};