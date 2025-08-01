import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Palette, Download, RotateCcw, Layers, Play, Pause, SkipBack, SkipForward, Plus, Trash2, Copy, Move, RotateCw } from 'lucide-react';

interface CreativeStudioProps {
  onBack: () => void;
}

type Tool = 'brush' | 'eraser' | 'fill' | 'line' | 'circle' | 'rectangle' | 'text' | 'select' | 'spray' | 'blur';
type Mode = 'drawing' | 'animation';

interface DrawingState {
  tool: Tool;
  color: string;
  size: number;
  opacity: number;
  isDrawing: boolean;
}

interface AnimationFrame {
  id: number;
  canvas: string; // base64 data URL
  duration: number;
  name: string;
}

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: string;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onBack }) => {
  const [mode, setMode] = useState<Mode>('drawing');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  
  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'brush',
    color: '#ff6b6b',
    size: 5,
    opacity: 1,
    isDrawing: false
  });

  // Layer system
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: 'Background', visible: true, opacity: 1, canvas: '' }
  ]);
  const [activeLayer, setActiveLayer] = useState(0);

  // Animation state
  const [frames, setFrames] = useState<AnimationFrame[]>([
    { id: 1, canvas: '', duration: 500, name: 'Frame 1' }
  ]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [onionSkinning, setOnionSkinning] = useState(true);
  const [loopAnimation, setLoopAnimation] = useState(true);

  // Advanced tools
  const [symmetryMode, setSymmetryMode] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#000000', '#ffffff', '#95a5a6',
    '#e17055', '#74b9ff', '#0984e3', '#6c5ce7', '#a29bfe'
  ];

  const tools: { id: Tool; name: string; icon: string; description: string }[] = [
    { id: 'brush', name: 'Brush', icon: '🖌️', description: 'Smooth painting brush' },
    { id: 'spray', name: 'Spray', icon: '🎨', description: 'Airbrush effect' },
    { id: 'eraser', name: 'Eraser', icon: '🧹', description: 'Remove paint' },
    { id: 'fill', name: 'Fill', icon: '🪣', description: 'Fill areas with color' },
    { id: 'line', name: 'Line', icon: '📏', description: 'Draw straight lines' },
    { id: 'circle', name: 'Circle', icon: '⭕', description: 'Draw circles' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', description: 'Draw rectangles' },
    { id: 'text', name: 'Text', icon: '📝', description: 'Add text labels' },
    { id: 'select', name: 'Select', icon: '⚪', description: 'Select and move areas' },
    { id: 'blur', name: 'Blur', icon: '💫', description: 'Blur effect brush' }
  ];

  const playSound = useCallback((type: 'draw' | 'success' | 'click') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'draw':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [soundEnabled]);

  // Advanced drawing functions
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Snap to grid if enabled
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e);
    setIsDrawing(true);
    setLastPos(pos);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = drawingState.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = drawingState.opacity;
    ctx.globalCompositeOperation = drawingState.tool === 'eraser' ? 'destination-out' : 'source-over';
    
    if (drawingState.tool === 'brush' || drawingState.tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      
      // Symmetry mode
      if (symmetryMode) {
        ctx.moveTo(canvas.width - pos.x, pos.y);
      }
    } else if (drawingState.tool === 'spray') {
      sprayPaint(ctx, pos.x, pos.y);
    }
    
    playSound('draw');
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = drawingState.color;
    
    if (drawingState.tool === 'brush' || drawingState.tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      
      // Symmetry mode
      if (symmetryMode) {
        ctx.lineTo(canvas.width - pos.x, pos.y);
        ctx.stroke();
      }
    } else if (drawingState.tool === 'spray') {
      sprayPaint(ctx, pos.x, pos.y);
      if (symmetryMode) {
        sprayPaint(ctx, canvas.width - pos.x, pos.y);
      }
    } else if (drawingState.tool === 'blur') {
      blurArea(ctx, pos.x, pos.y);
    }
    
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveCurrentFrame();
  };

  const sprayPaint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const radius = drawingState.size;
    const density = 20;
    
    ctx.fillStyle = drawingState.color;
    
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 2;
      const offsetY = (Math.random() - 0.5) * radius * 2;
      
      if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
      }
    }
  };

  const blurArea = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const radius = drawingState.size;
    const imageData = ctx.getImageData(x - radius, y - radius, radius * 2, radius * 2);
    
    // Simple box blur
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    for (let i = 0; i < data.length; i += 4) {
      const avgR = (data[i] + data[i + 4] + data[i + 8]) / 3;
      const avgG = (data[i + 1] + data[i + 5] + data[i + 9]) / 3;
      const avgB = (data[i + 2] + data[i + 6] + data[i + 10]) / 3;
      
      data[i] = avgR;
      data[i + 1] = avgG;
      data[i + 2] = avgB;
    }
    
    ctx.putImageData(imageData, x - radius, y - radius);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCurrentFrame();
    playSound('success');
  };

  const saveCurrentFrame = () => {
    if (mode !== 'animation') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setFrames(prev => 
      prev.map((frame, index) => 
        index === currentFrame 
          ? { ...frame, canvas: dataURL }
          : frame
      )
    );
  };

  const addFrame = () => {
    const newFrame: AnimationFrame = {
      id: frames.length + 1,
      canvas: '',
      duration: 500,
      name: `Frame ${frames.length + 1}`
    };
    setFrames(prev => [...prev, newFrame]);
    setCurrentFrame(frames.length);
    playSound('success');
  };

  const duplicateFrame = () => {
    const currentFrameData = frames[currentFrame];
    const newFrame: AnimationFrame = {
      id: frames.length + 1,
      canvas: currentFrameData.canvas,
      duration: currentFrameData.duration,
      name: `${currentFrameData.name} Copy`
    };
    setFrames(prev => [...prev, newFrame]);
    setCurrentFrame(frames.length);
    playSound('success');
  };

  const deleteFrame = (index: number) => {
    if (frames.length <= 1) return;
    
    setFrames(prev => prev.filter((_, i) => i !== index));
    setCurrentFrame(Math.max(0, currentFrame - 1));
    playSound('click');
  };

  const playAnimation = () => {
    if (frames.length <= 1) return;
    
    setIsPlaying(true);
    let frameIndex = 0;
    
    const animateFrame = () => {
      const frame = frames[frameIndex];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (canvas && ctx && frame.canvas) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = frame.canvas;
      }
      
      frameIndex = (frameIndex + 1) % frames.length;
      
      setTimeout(() => {
        if (isPlaying && (loopAnimation || frameIndex !== 0)) {
          animateFrame();
        } else if (!loopAnimation && frameIndex === 0) {
          setIsPlaying(false);
        }
      }, frame.duration / playbackSpeed);
    };
    
    animateFrame();
  };

  const stopAnimation = () => {
    setIsPlaying(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `creative-studio-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    playSound('success');
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: layers.length + 1,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 1,
      canvas: ''
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayer(layers.length);
  };

  const toggleLayer = (index: number) => {
    setLayers(prev => 
      prev.map((layer, i) => 
        i === index ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const renderDrawingMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Tools Panel */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Palette className="mr-2" size={20} />
            Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {tools.map(tool => (
              <Button
                key={tool.id}
                onClick={() => {
                  setDrawingState(prev => ({ ...prev, tool: tool.id }));
                  playSound('click');
                }}
                variant={drawingState.tool === tool.id ? 'default' : 'outline'}
                className="h-12 text-xs flex flex-col items-center justify-center"
                title={tool.description}
              >
                <div>{tool.icon}</div>
                <div className="text-[10px]">{tool.name}</div>
              </Button>
            ))}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Size: {drawingState.size}px</label>
              <Slider
                value={[drawingState.size]}
                onValueChange={([value]) => setDrawingState(prev => ({ ...prev, size: value }))}
                min={1}
                max={100}
                step={1}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Opacity: {Math.round(drawingState.opacity * 100)}%</label>
              <Slider
                value={[drawingState.opacity]}
                onValueChange={([value]) => setDrawingState(prev => ({ ...prev, opacity: value }))}
                min={0.1}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Colors</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setDrawingState(prev => ({ ...prev, color }));
                    playSound('click');
                  }}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    drawingState.color === color ? 'border-black scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={drawingState.color}
              onChange={(e) => setDrawingState(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Advanced</label>
            <div className="space-y-1">
              <Button
                onClick={() => setSymmetryMode(!symmetryMode)}
                variant={symmetryMode ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                Symmetry {symmetryMode ? 'ON' : 'OFF'}
              </Button>
              <Button
                onClick={() => setSnapToGrid(!snapToGrid)}
                variant={snapToGrid ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                Grid Snap {snapToGrid ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Area */}
      <div className="lg:col-span-3">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Drawing Canvas</span>
              <div className="flex gap-2">
                <Button onClick={clearCanvas} variant="outline" size="sm">
                  <RotateCcw size={16} className="mr-1" />
                  Clear
                </Button>
                <Button onClick={downloadCanvas} variant="outline" size="sm">
                  <Download size={16} className="mr-1" />
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {snapToGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #ccc 1px, transparent 1px),
                      linear-gradient(to bottom, #ccc 1px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                  }}
                />
              )}
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-300 rounded cursor-crosshair w-full max-w-full h-auto bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layers Panel */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layers className="mr-2" size={20} />
            Layers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addLayer} size="sm" className="w-full">
            <Plus size={16} className="mr-1" />
            Add Layer
          </Button>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className={`p-2 rounded border cursor-pointer ${
                  index === activeLayer ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveLayer(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{layer.name}</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayer(index);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    {layer.visible ? '👁️' : '🙈'}
                  </Button>
                </div>
                <Slider
                  value={[layer.opacity]}
                  onValueChange={([value]) => {
                    setLayers(prev => 
                      prev.map((l, i) => 
                        i === index ? { ...l, opacity: value } : l
                      )
                    );
                  }}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnimationMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Animation Controls */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Play className="mr-2" size={20} />
            Animation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={isPlaying ? stopAnimation : playAnimation} 
              size="sm"
              className="flex-1"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Stop' : 'Play'}
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Speed: {playbackSpeed}x</label>
            <Slider
              value={[playbackSpeed]}
              onValueChange={([value]) => setPlaybackSpeed(value)}
              min={0.25}
              max={4}
              step={0.25}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={addFrame} variant="outline" size="sm" className="flex-1">
              <Plus size={16} className="mr-1" />
              Add
            </Button>
            <Button onClick={duplicateFrame} variant="outline" size="sm" className="flex-1">
              <Copy size={16} className="mr-1" />
              Copy
            </Button>
          </div>
          
          <div className="space-y-1">
            <Button
              onClick={() => setOnionSkinning(!onionSkinning)}
              variant={onionSkinning ? 'default' : 'outline'}
              size="sm"
              className="w-full"
            >
              Onion Skin {onionSkinning ? 'ON' : 'OFF'}
            </Button>
            <Button
              onClick={() => setLoopAnimation(!loopAnimation)}
              variant={loopAnimation ? 'default' : 'outline'}
              size="sm"
              className="w-full"
            >
              Loop {loopAnimation ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drawing Tools */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg">Drawing Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {tools.slice(0, 6).map(tool => (
              <Button
                key={tool.id}
                onClick={() => {
                  setDrawingState(prev => ({ ...prev, tool: tool.id }));
                  playSound('click');
                }}
                variant={drawingState.tool === tool.id ? 'default' : 'outline'}
                className="h-12 text-xs flex flex-col items-center justify-center"
              >
                <div>{tool.icon}</div>
                <div className="text-[10px]">{tool.name}</div>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-5 gap-1">
            {colors.slice(0, 15).map(color => (
              <button
                key={color}
                onClick={() => {
                  setDrawingState(prev => ({ ...prev, color }));
                  playSound('click');
                }}
                className={`w-6 h-6 rounded border ${
                  drawingState.color === color ? 'border-black border-2' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full">
            Clear Frame
          </Button>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div className="lg:col-span-1">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>Frame {currentFrame + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {onionSkinning && currentFrame > 0 && frames[currentFrame - 1].canvas && (
                <canvas
                  width={400}
                  height={300}
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      const img = new Image();
                      img.onload = () => {
                        ctx?.clearRect(0, 0, canvas.width, canvas.height);
                        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                      };
                      img.src = frames[currentFrame - 1].canvas;
                    }
                  }}
                />
              )}
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border border-gray-300 rounded cursor-crosshair w-full bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-white/95 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {frames.map((frame, index) => (
              <div
                key={frame.id}
                className={`flex-shrink-0 w-24 h-20 border-2 rounded cursor-pointer relative ${
                  index === currentFrame ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setCurrentFrame(index)}
              >
                {frame.canvas && (
                  <img
                    src={frame.canvas}
                    alt={frame.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b">
                  {index + 1}
                </div>
                {frames.length > 1 && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFrame(index);
                    }}
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-5 w-5 p-0 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🎨 Creative Studio
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mode Selection */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setMode('drawing')}
                variant={mode === 'drawing' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Palette size={20} />
                Drawing Studio
              </Button>
              <Button
                onClick={() => setMode('animation')}
                variant={mode === 'animation' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Play size={20} />
                Animation Studio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {mode === 'drawing' ? renderDrawingMode() : renderAnimationMode()}
      </div>
    </div>
  );
};

export default CreativeStudio;