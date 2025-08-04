import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Volume2, VolumeX, BookOpen, Plus, Minus } from 'lucide-react';
import { ExperimentCanvas } from './components/ExperimentCanvas';
import { ConceptDialog } from './components/ConceptDialog';
import { ControlPanel } from './components/ControlPanel';

interface PhysicsFunProps {
  onBack: () => void;
}

type ExperimentType = 'gravity' | 'pendulum' | 'collision' | 'waves' | 'circuit' | 'magnetism' | 'projectile' | 'springs' | 'optics';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  id: string;
}

interface Pendulum {
  angle: number;
  angularVelocity: number;
  length: number;
  mass: number;
}

export const PhysicsFun: React.FC<PhysicsFunProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentType>('gravity');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConcepts, setShowConcepts] = useState(false);
  
  // Physics parameters
  const [gravity, setGravity] = useState(9.8);
  const [restitution, setRestitution] = useState(0.8);
  const [friction, setFriction] = useState(0.02);
  
  // Experiment states
  const [balls, setBalls] = useState<Ball[]>([]);
  const [pendulums, setPendulums] = useState<Pendulum[]>([]);
  const [waveAmplitude, setWaveAmplitude] = useState(50);
  const [waveFrequency, setWaveFrequency] = useState(1);
  const [wavePhase, setWavePhase] = useState(0);

  const experiments = [
    { 
      id: 'gravity', 
      name: 'Gravity & Motion', 
      icon: '🪨', 
      description: 'Explore gravity and projectile motion',
      concepts: ['Newton\'s Laws', 'Free Fall', 'Air Resistance', 'Terminal Velocity']
    },
    { 
      id: 'pendulum', 
      name: 'Pendulum', 
      icon: '⚖️', 
      description: 'Study pendulum motion and energy',
      concepts: ['Simple Harmonic Motion', 'Conservation of Energy', 'Period and Frequency']
    },
    { 
      id: 'collision', 
      name: 'Collisions', 
      icon: '💥', 
      description: 'Analyze elastic and inelastic collisions',
      concepts: ['Conservation of Momentum', 'Kinetic Energy', 'Impulse']
    },
    { 
      id: 'waves', 
      name: 'Wave Motion', 
      icon: '🌊', 
      description: 'Visualize wave properties and interference',
      concepts: ['Wave Properties', 'Interference', 'Standing Waves', 'Frequency and Wavelength']
    },
    { 
      id: 'circuit', 
      name: 'Electric Circuit', 
      icon: '⚡', 
      description: 'Build and test electrical circuits',
      concepts: ['Ohm\'s Law', 'Current Flow', 'Resistance', 'Voltage']
    },
    { 
      id: 'magnetism', 
      name: 'Magnetism', 
      icon: '🧲', 
      description: 'Explore magnetic fields and forces',
      concepts: ['Magnetic Fields', 'Electromagnetic Induction', 'Magnetic Force']
    },
    { 
      id: 'projectile', 
      name: 'Projectile Motion', 
      icon: '🎯', 
      description: 'Study projectile trajectories',
      concepts: ['Parabolic Motion', 'Range and Height', 'Launch Angle']
    },
    { 
      id: 'springs', 
      name: 'Springs & Oscillation', 
      icon: '🌀', 
      description: 'Analyze spring dynamics',
      concepts: ['Hooke\'s Law', 'Elastic Potential Energy', 'Oscillation']
    },
    { 
      id: 'optics', 
      name: 'Light & Optics', 
      icon: '🔆', 
      description: 'Explore light behavior',
      concepts: ['Reflection', 'Refraction', 'Wavelength', 'Interference']
    }
  ];

  const playSound = useCallback((frequency: number, duration: number = 0.1) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }, [soundEnabled]);

  const initializeExperiment = useCallback(() => {
    switch (currentExperiment) {
      case 'gravity':
        setBalls([
          {
            id: '1',
            x: 100,
            y: 50,
            vx: 5,
            vy: 0,
            radius: 10,
            mass: 1,
            color: '#ff6b6b'
          },
          {
            id: '2',
            x: 200,
            y: 80,
            vx: 3,
            vy: 2,
            radius: 15,
            mass: 2,
            color: '#4ecdc4'
          }
        ]);
        break;
        
      case 'pendulum':
        setPendulums([
          { angle: Math.PI / 4, angularVelocity: 0, length: 150, mass: 1 },
          { angle: -Math.PI / 6, angularVelocity: 0, length: 120, mass: 1.5 }
        ]);
        break;
        
      case 'collision':
        setBalls([
          {
            id: '1',
            x: 150,
            y: 200,
            vx: 8,
            vy: 0,
            radius: 20,
            mass: 2,
            color: '#ff6b6b'
          },
          {
            id: '2',
            x: 450,
            y: 200,
            vx: -5,
            vy: 0,
            radius: 15,
            mass: 1,
            color: '#4ecdc4'
          }
        ]);
        break;
        
      case 'projectile':
        setBalls([
          {
            id: '1',
            x: 50,
            y: 300,
            vx: 15,
            vy: -10,
            radius: 8,
            mass: 1,
            color: '#ff6b6b'
          }
        ]);
        break;
        
      case 'waves':
        setWavePhase(0);
        break;
        
      default:
        setBalls([]);
        setPendulums([]);
    }
  }, [currentExperiment]);

  useEffect(() => {
    initializeExperiment();
  }, [initializeExperiment]);

  const updatePhysics = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const deltaTime = 0.016; // 60 FPS
    
    switch (currentExperiment) {
      case 'gravity':
      case 'collision':
      case 'projectile':
        setBalls(prevBalls => {
          const newBalls = prevBalls.map(ball => {
            let newVx = ball.vx;
            let newVy = ball.vy + gravity * deltaTime * 10; // Apply gravity
            let newX = ball.x + newVx * deltaTime * 60;
            let newY = ball.y + newVy * deltaTime * 60;
            
            // Boundary collisions with improved physics
            if (newX - ball.radius <= 0) {
              newX = ball.radius;
              newVx = -newVx * restitution;
              playSound(400, 0.05);
            } else if (newX + ball.radius >= canvas.width) {
              newX = canvas.width - ball.radius;
              newVx = -newVx * restitution;
              playSound(400, 0.05);
            }
            
            if (newY - ball.radius <= 0) {
              newY = ball.radius;
              newVy = -newVy * restitution;
              playSound(300, 0.05);
            } else if (newY + ball.radius >= canvas.height) {
              newY = canvas.height - ball.radius;
              newVy = -newVy * restitution;
              playSound(300, 0.05);
            }
            
            // Apply friction
            newVx *= (1 - friction);
            newVy *= (1 - friction * 0.1); // Less friction on vertical motion
            
            return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
          });
          
          // Ball-to-ball collisions for collision experiment
          if (currentExperiment === 'collision') {
            for (let i = 0; i < newBalls.length; i++) {
              for (let j = i + 1; j < newBalls.length; j++) {
                const ball1 = newBalls[i];
                const ball2 = newBalls[j];
                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < ball1.radius + ball2.radius) {
                  // Collision detected - apply conservation of momentum
                  const angle = Math.atan2(dy, dx);
                  const sin = Math.sin(angle);
                  const cos = Math.cos(angle);
                  
                  // Rotate velocities
                  const vx1 = ball1.vx * cos + ball1.vy * sin;
                  const vy1 = ball1.vy * cos - ball1.vx * sin;
                  const vx2 = ball2.vx * cos + ball2.vy * sin;
                  const vy2 = ball2.vy * cos - ball2.vx * sin;
                  
                  // Apply conservation of momentum
                  const finalVx1 = ((ball1.mass - ball2.mass) * vx1 + 2 * ball2.mass * vx2) / (ball1.mass + ball2.mass);
                  const finalVx2 = ((ball2.mass - ball1.mass) * vx2 + 2 * ball1.mass * vx1) / (ball1.mass + ball2.mass);
                  
                  // Rotate back
                  newBalls[i].vx = finalVx1 * cos - vy1 * sin;
                  newBalls[i].vy = vy1 * cos + finalVx1 * sin;
                  newBalls[j].vx = finalVx2 * cos - vy2 * sin;
                  newBalls[j].vy = vy2 * cos + finalVx2 * sin;
                  
                  // Separate balls
                  const overlap = ball1.radius + ball2.radius - distance;
                  const separationX = (dx / distance) * overlap * 0.5;
                  const separationY = (dy / distance) * overlap * 0.5;
                  
                  newBalls[i].x -= separationX;
                  newBalls[i].y -= separationY;
                  newBalls[j].x += separationX;
                  newBalls[j].y += separationY;
                  
                  playSound(600, 0.1);
                }
              }
            }
          }
          
          return newBalls;
        });
        break;
        
      case 'pendulum':
        setPendulums(prevPendulums => prevPendulums.map(pendulum => {
          const angularAcceleration = -(gravity / pendulum.length) * Math.sin(pendulum.angle);
          const newAngularVelocity = pendulum.angularVelocity + angularAcceleration * deltaTime;
          const newAngle = pendulum.angle + newAngularVelocity * deltaTime;
          
          return {
            ...pendulum,
            angle: newAngle,
            angularVelocity: newAngularVelocity * 0.999 // Damping
          };
        }));
        break;
        
      case 'waves':
        setWavePhase(prev => prev + waveFrequency * deltaTime * 10);
        break;
    }
  }, [currentExperiment, gravity, restitution, friction, playSound, waveFrequency]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        updatePhysics();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updatePhysics]);

  const resetExperiment = () => {
    setIsPlaying(false);
    initializeExperiment();
  };

  const addBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newBall: Ball = {
      id: Date.now().toString(),
      x: Math.random() * (canvas.width - 40) + 20,
      y: Math.random() * 100 + 20,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5,
      radius: Math.random() * 10 + 5,
      mass: Math.random() * 2 + 0.5,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };
    
    setBalls(prev => [...prev, newBall]);
  };

  const removeBall = () => {
    setBalls(prev => prev.slice(0, -1));
  };

  const getCurrentExperiment = () => {
    return experiments.find(exp => exp.id === currentExperiment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-center">⚛️ Physics Fun Lab</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Experiment Selection */}
          <Card className="bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">🔬 Experiments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {experiments.map(experiment => (
                <Button
                  key={experiment.id}
                  variant={currentExperiment === experiment.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCurrentExperiment(experiment.id as ExperimentType);
                    setIsPlaying(false);
                  }}
                  className="w-full justify-start text-xs"
                >
                  <span className="mr-2">{experiment.icon}</span>
                  {experiment.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{getCurrentExperiment()?.icon} {getCurrentExperiment()?.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConcepts(true)}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Concepts
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExperimentCanvas
                  ref={canvasRef}
                  experiment={currentExperiment}
                  balls={balls}
                  pendulums={pendulums}
                  waveAmplitude={waveAmplitude}
                  waveFrequency={waveFrequency}
                  wavePhase={wavePhase}
                  gravity={gravity}
                />
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant={isPlaying ? 'destructive' : 'default'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={resetExperiment} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  {['gravity', 'collision', 'projectile'].includes(currentExperiment) && (
                    <>
                      <Button onClick={addBall} variant="outline" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button onClick={removeBall} variant="outline" size="sm" disabled={balls.length <= 1}>
                        <Minus className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <ControlPanel
            currentExperiment={currentExperiment}
            gravity={gravity}
            setGravity={setGravity}
            restitution={restitution}
            setRestitution={setRestitution}
            friction={friction}
            setFriction={setFriction}
            waveAmplitude={waveAmplitude}
            setWaveAmplitude={setWaveAmplitude}
            waveFrequency={waveFrequency}
            setWaveFrequency={setWaveFrequency}
          />
        </div>

        {/* Concept Dialog */}
        <ConceptDialog
          experiment={getCurrentExperiment()}
          isOpen={showConcepts}
          onClose={() => setShowConcepts(false)}
        />
      </div>
    </div>
  );
};