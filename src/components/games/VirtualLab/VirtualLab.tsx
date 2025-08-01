import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Beaker, Thermometer, Zap, Microscope, FlaskConical, TestTube, Eye, Atom } from 'lucide-react';

interface VirtualLabProps {
  onBack: () => void;
}

type ExperimentType = 'chemistry' | 'physics' | 'biology' | 'earth' | 'anatomy' | 'astronomy';

interface Substance {
  id: string;
  name: string;
  color: string;
  state: 'solid' | 'liquid' | 'gas' | 'plasma';
  temperature: number;
  ph?: number;
  properties: string[];
  molecularFormula?: string;
  density?: number;
  boilingPoint?: number;
  meltingPoint?: number;
}

interface Experiment {
  id: string;
  type: ExperimentType;
  title: string;
  description: string;
  objective: string;
  substances: Substance[];
  equipment: string[];
  steps: string[];
  expectedResult: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: number;
  safetyLevel: 'low' | 'medium' | 'high';
}

interface LabEquipment {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

const VirtualLab: React.FC<VirtualLabProps> = ({ onBack }) => {
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null);
  const [selectedSubstances, setSelectedSubstances] = useState<Substance[]>([]);
  const [mixedSubstance, setMixedSubstance] = useState<Substance | null>(null);
  const [temperature, setTemperature] = useState(20);
  const [pressure, setPressure] = useState(1); // atm
  const [ph, setPh] = useState(7);
  const [isHeating, setIsHeating] = useState(false);
  const [isCooling, setIsCooling] = useState(false);
  const [isStirring, setIsStirring] = useState(false);
  const [experimentStep, setExperimentStep] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [observations, setObservations] = useState<string[]>([]);
  const [microscopyMagnification, setMicroscopyMagnification] = useState(100);
  const [reactionAnimation, setReactionAnimation] = useState<string | null>(null);
  const [gasProduction, setGasProduction] = useState(0);
  const [crystalFormation, setCrystalFormation] = useState(false);

  const experiments: Experiment[] = [
    {
      id: 'acid-base-advanced',
      type: 'chemistry',
      title: 'Advanced Acid-Base Titration',
      description: 'Perform precise pH measurements and titration curves',
      objective: 'Determine unknown concentration using titration',
      icon: '🧪',
      difficulty: 'hard',
      timeEstimate: 15,
      safetyLevel: 'medium',
      substances: [
        { 
          id: 'hcl', 
          name: 'Hydrochloric Acid', 
          color: '#ffcccc', 
          state: 'liquid', 
          temperature: 20, 
          ph: 1, 
          properties: ['corrosive', 'acidic'], 
          molecularFormula: 'HCl',
          density: 1.18,
          boilingPoint: 108
        },
        { 
          id: 'naoh', 
          name: 'Sodium Hydroxide', 
          color: '#ccccff', 
          state: 'liquid', 
          temperature: 20, 
          ph: 14, 
          properties: ['caustic', 'basic'], 
          molecularFormula: 'NaOH',
          density: 2.13,
          meltingPoint: 318
        },
        { 
          id: 'indicator', 
          name: 'Universal Indicator', 
          color: '#ff9999', 
          state: 'liquid', 
          temperature: 20, 
          properties: ['pH-sensitive', 'colorimetric'] 
        }
      ],
      equipment: ['burette', 'conical-flask', 'ph-meter', 'magnetic-stirrer'],
      steps: [
        'Set up titration apparatus',
        'Add indicator to solution',
        'Record initial pH and color',
        'Add titrant dropwise while stirring',
        'Observe color changes and pH readings',
        'Identify equivalence point',
        'Calculate concentration'
      ],
      expectedResult: 'Sharp pH change at equivalence point with color transition'
    },
    {
      id: 'crystallization',
      type: 'chemistry',
      title: 'Crystal Growth Lab',
      description: 'Grow different types of crystals and study their structures',
      objective: 'Understand crystallization processes and crystal systems',
      icon: '💎',
      difficulty: 'medium',
      timeEstimate: 20,
      safetyLevel: 'low',
      substances: [
        { 
          id: 'salt', 
          name: 'Table Salt', 
          color: '#ffffff', 
          state: 'solid', 
          temperature: 20, 
          properties: ['ionic', 'cubic crystal system'], 
          molecularFormula: 'NaCl'
        },
        { 
          id: 'copper-sulfate', 
          name: 'Copper Sulfate', 
          color: '#0066cc', 
          state: 'solid', 
          temperature: 20, 
          properties: ['hydrated', 'triclinic crystal system'], 
          molecularFormula: 'CuSO4·5H2O'
        },
        { 
          id: 'alum', 
          name: 'Potassium Alum', 
          color: '#f0f0f0', 
          state: 'solid', 
          temperature: 20, 
          properties: ['octahedral', 'cubic crystal system'], 
          molecularFormula: 'KAl(SO4)2·12H2O'
        }
      ],
      equipment: ['beaker', 'heating-plate', 'stirring-rod', 'filter-paper', 'magnifying-glass'],
      steps: [
        'Prepare saturated solution',
        'Heat to dissolve completely',
        'Cool slowly for crystal formation',
        'Observe crystal shapes under magnification',
        'Filter and examine crystals',
        'Compare different crystal systems'
      ],
      expectedResult: 'Formation of well-defined crystals with distinct geometric shapes'
    },
    {
      id: 'enzyme-kinetics',
      type: 'biology',
      title: 'Enzyme Activity Study',
      description: 'Investigate how temperature and pH affect enzyme function',
      objective: 'Understand enzyme kinetics and factors affecting enzyme activity',
      icon: '🧬',
      difficulty: 'hard',
      timeEstimate: 25,
      safetyLevel: 'low',
      substances: [
        { 
          id: 'catalase', 
          name: 'Catalase Enzyme', 
          color: '#ffeb3b', 
          state: 'liquid', 
          temperature: 20, 
          properties: ['enzyme', 'protein', 'temperature-sensitive']
        },
        { 
          id: 'hydrogen-peroxide', 
          name: 'Hydrogen Peroxide', 
          color: '#e3f2fd', 
          state: 'liquid', 
          temperature: 20, 
          properties: ['oxidizer', 'substrate'], 
          molecularFormula: 'H2O2'
        },
        { 
          id: 'buffer-7', 
          name: 'pH 7 Buffer', 
          color: '#e8f5e8', 
          state: 'liquid', 
          temperature: 20, 
          ph: 7, 
          properties: ['buffer', 'maintains pH']
        }
      ],
      equipment: ['test-tubes', 'water-bath', 'ph-meter', 'timer', 'measuring-cylinder'],
      steps: [
        'Prepare enzyme solutions at different concentrations',
        'Set up water baths at various temperatures',
        'Add substrate to enzyme solutions',
        'Measure reaction rate by oxygen production',
        'Test at different pH values',
        'Record and analyze results'
      ],
      expectedResult: 'Optimal enzyme activity at specific temperature and pH ranges'
    },
    {
      id: 'pendulum-physics',
      type: 'physics',
      title: 'Pendulum Motion Analysis',
      description: 'Study simple harmonic motion and gravitational effects',
      objective: 'Determine local gravitational acceleration using pendulum',
      icon: '⚖️',
      difficulty: 'medium',
      timeEstimate: 18,
      safetyLevel: 'low',
      substances: [
        { 
          id: 'metal-bob', 
          name: 'Metal Pendulum Bob', 
          color: '#757575', 
          state: 'solid', 
          temperature: 20, 
          properties: ['dense', 'spherical'],
          density: 7.8
        }
      ],
      equipment: ['pendulum-stand', 'stopwatch', 'ruler', 'protractor', 'computer-interface'],
      steps: [
        'Set up pendulum with known length',
        'Release from small angle displacement',
        'Measure period for multiple oscillations',
        'Vary pendulum length and repeat',
        'Plot period² vs length graph',
        'Calculate gravitational acceleration from slope'
      ],
      expectedResult: 'Linear relationship between period² and length, g ≈ 9.8 m/s²'
    },
    {
      id: 'cell-division',
      type: 'biology',
      title: 'Mitosis Observation',
      description: 'Observe stages of cell division under microscope',
      objective: 'Identify and understand phases of mitosis',
      icon: '🔬',
      difficulty: 'medium',
      timeEstimate: 20,
      safetyLevel: 'low',
      substances: [
        { 
          id: 'onion-root', 
          name: 'Onion Root Tip', 
          color: '#fff8dc', 
          state: 'solid', 
          temperature: 20, 
          properties: ['actively dividing cells', 'plant tissue']
        },
        { 
          id: 'methylene-blue', 
          name: 'Methylene Blue Stain', 
          color: '#0066cc', 
          state: 'liquid', 
          temperature: 20, 
          properties: ['nuclear stain', 'vital dye']
        }
      ],
      equipment: ['compound-microscope', 'slides', 'cover-slips', 'dropper', 'scalpel'],
      steps: [
        'Prepare thin section of root tip',
        'Apply stain to highlight nuclei',
        'Mount on slide with cover slip',
        'Observe under 40x magnification',
        'Identify different mitotic phases',
        'Increase to 100x for detail',
        'Count cells in each phase'
      ],
      expectedResult: 'Clear visualization of prophase, metaphase, anaphase, and telophase'
    },
    {
      id: 'solar-system',
      type: 'astronomy',
      title: 'Planet Motion Simulation',
      description: 'Model planetary orbits and Kepler\'s laws',
      objective: 'Understand orbital mechanics and gravitational forces',
      icon: '🪐',
      difficulty: 'hard',
      timeEstimate: 30,
      safetyLevel: 'low',
      substances: [],
      equipment: ['computer-simulation', 'orbital-calculator', 'telescope-interface'],
      steps: [
        'Set up solar system simulation',
        'Observe planet orbital periods',
        'Measure orbital radii and periods',
        'Test Kepler\'s third law (T² ∝ r³)',
        'Simulate different mass ratios',
        'Observe gravitational effects',
        'Calculate orbital velocities'
      ],
      expectedResult: 'Verification of Kepler\'s laws and gravitational principles'
    }
  ];

  const labEquipment: LabEquipment[] = [
    { id: 'beaker', name: 'Beaker', icon: '🥃', description: 'For mixing and heating solutions', available: true },
    { id: 'test-tube', name: 'Test Tube', icon: '🧪', description: 'For small-scale reactions', available: true },
    { id: 'microscope', name: 'Microscope', icon: '🔬', description: 'For magnifying specimens', available: true },
    { id: 'bunsen-burner', name: 'Bunsen Burner', icon: '🔥', description: 'For heating substances', available: true },
    { id: 'ph-meter', name: 'pH Meter', icon: '📊', description: 'For measuring acidity', available: true },
    { id: 'balance', name: 'Analytical Balance', icon: '⚖️', description: 'For precise measurements', available: true },
    { id: 'centrifuge', name: 'Centrifuge', icon: '🌀', description: 'For separating mixtures', available: true },
    { id: 'spectrometer', name: 'Spectrometer', icon: '🌈', description: 'For analyzing light spectra', available: true }
  ];

  const playSound = useCallback((type: 'bubble' | 'success' | 'reaction' | 'heat' | 'stir' | 'gas' | 'crystallize') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'bubble':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
        break;
      case 'reaction':
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 1);
        break;
      case 'heat':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.5);
        break;
      case 'stir':
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        break;
      case 'gas':
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 2);
        break;
      case 'crystallize':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 1);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  }, [soundEnabled]);

  // Advanced temperature and pressure effects
  useEffect(() => {
    if (isHeating || isCooling) {
      const interval = setInterval(() => {
        setTemperature(prev => {
          const change = isHeating ? 3 : -3;
          const newTemp = prev + change;
          const clampedTemp = Math.max(-50, Math.min(300, newTemp));
          
          // Temperature-dependent effects
          if (clampedTemp > 100 && selectedSubstances.some(s => s.name.includes('Water'))) {
            setGasProduction(prev => Math.min(prev + 5, 100));
            playSound('gas');
          }
          
          if (clampedTemp < 0 && selectedSubstances.length > 0) {
            setCrystalFormation(true);
            playSound('crystallize');
          }
          
          return clampedTemp;
        });
        
        if (isHeating) playSound('heat');
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [isHeating, isCooling, selectedSubstances, playSound]);

  // Stirring effects
  useEffect(() => {
    if (isStirring) {
      const interval = setInterval(() => {
        playSound('stir');
        // Enhance mixing reactions
        if (selectedSubstances.length > 1) {
          setReactionAnimation('mixing');
          setTimeout(() => setReactionAnimation(null), 1000);
        }
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isStirring, selectedSubstances.length, playSound]);

  const addSubstance = (substance: Substance) => {
    if (selectedSubstances.length < 5) {
      setSelectedSubstances(prev => [...prev, substance]);
      playSound('bubble');
      addObservation(`Added ${substance.name} to reaction vessel`);
    }
  };

  const mixSubstances = () => {
    if (selectedSubstances.length === 0) return;
    
    playSound('reaction');
    setReactionAnimation('reaction');
    
    // Advanced chemical reaction simulation
    let result: Substance = {
      id: 'mixture',
      name: 'Mixture',
      color: blendColors(selectedSubstances.map(s => s.color)),
      state: determineState(selectedSubstances, temperature, pressure),
      temperature: temperature,
      properties: [],
      density: calculateDensity(selectedSubstances)
    };

    // Complex reaction logic
    if (currentExperiment?.id === 'acid-base-advanced') {
      const acid = selectedSubstances.find(s => s.ph && s.ph < 7);
      const base = selectedSubstances.find(s => s.ph && s.ph > 7);
      
      if (acid && base) {
        const neutralizationPH = calculateNeutralizationPH(acid, base);
        result.ph = neutralizationPH;
        result.name = 'Neutralization Product';
        result.color = getIndicatorColor(neutralizationPH);
        result.properties = ['ionic', 'salt formation', 'heat release'];
        
        addObservation(`Neutralization reaction: pH changed to ${neutralizationPH.toFixed(2)}`);
        addObservation(`Color changed to ${getColorName(result.color)} due to indicator`);
        setScore(prev => prev + 75);
        playSound('success');
      }
    } else if (currentExperiment?.id === 'crystallization') {
      if (temperature < 10 && selectedSubstances.some(s => s.id === 'salt' || s.id === 'copper-sulfate')) {
        result.name = 'Crystal Formation';
        result.properties = ['crystalline', 'ordered structure', 'geometric patterns'];
        setCrystalFormation(true);
        addObservation('Beautiful crystals forming as solution cools!');
        setScore(prev => prev + 50);
        playSound('crystallize');
      }
    } else if (currentExperiment?.id === 'enzyme-kinetics') {
      const enzyme = selectedSubstances.find(s => s.id === 'catalase');
      const substrate = selectedSubstances.find(s => s.id === 'hydrogen-peroxide');
      
      if (enzyme && substrate) {
        const activity = calculateEnzymeActivity(temperature, ph);
        result.name = 'Enzyme Reaction';
        result.properties = ['oxygen production', 'catalytic', `activity: ${activity}%`];
        setGasProduction(activity);
        addObservation(`Enzyme activity: ${activity}% - Oxygen bubbles forming!`);
        setScore(prev => prev + Math.round(activity));
        playSound('gas');
      }
    }

    setMixedSubstance(result);
    setSelectedSubstances([]);
    
    setTimeout(() => setReactionAnimation(null), 2000);
  };

  const calculateNeutralizationPH = (acid: Substance, base: Substance): number => {
    if (!acid.ph || !base.ph) return 7;
    const concentration = 0.1; // Assume 0.1M solutions
    return 7 + Math.log10(concentration) * (base.ph - acid.ph) / 14;
  };

  const getIndicatorColor = (ph: number): string => {
    if (ph < 4) return '#ff0000'; // Red
    if (ph < 6) return '#ff8800'; // Orange  
    if (ph < 8) return '#00ff00'; // Green
    if (ph < 10) return '#0088ff'; // Blue
    return '#8800ff'; // Purple
  };

  const getColorName = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      '#ff0000': 'red', '#ff8800': 'orange', '#00ff00': 'green',
      '#0088ff': 'blue', '#8800ff': 'purple'
    };
    return colorMap[color] || 'unknown';
  };

  const calculateEnzymeActivity = (temp: number, ph: number): number => {
    const optimalTemp = 37; // Body temperature
    const optimalPH = 7.4;
    
    const tempFactor = Math.max(0, 100 - Math.abs(temp - optimalTemp) * 3);
    const phFactor = Math.max(0, 100 - Math.abs(ph - optimalPH) * 20);
    
    return Math.round(Math.min(tempFactor, phFactor));
  };

  const determineState = (substances: Substance[], temp: number, pressure: number): 'solid' | 'liquid' | 'gas' | 'plasma' => {
    if (temp > 1000) return 'plasma';
    if (temp > 100) return 'gas';
    if (temp > 0) return 'liquid';
    return 'solid';
  };

  const calculateDensity = (substances: Substance[]): number => {
    if (substances.length === 0) return 1;
    const densities = substances.map(s => s.density || 1);
    return densities.reduce((a, b) => a + b, 0) / densities.length;
  };

  const blendColors = (colors: string[]): string => {
    if (colors.length === 0) return '#ffffff';
    if (colors.length === 1) return colors[0];
    
    const avgColor = colors.reduce((acc, color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      acc.r += r / colors.length;
      acc.g += g / colors.length;
      acc.b += b / colors.length;
      
      return acc;
    }, { r: 0, g: 0, b: 0 });
    
    const r = Math.round(avgColor.r).toString(16).padStart(2, '0');
    const g = Math.round(avgColor.g).toString(16).padStart(2, '0');
    const b = Math.round(avgColor.b).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  };

  const addObservation = (observation: string) => {
    setObservations(prev => [...prev, `${new Date().toLocaleTimeString()}: ${observation}`]);
  };

  const clearBeaker = () => {
    setMixedSubstance(null);
    setSelectedSubstances([]);
    setObservations([]);
    setGasProduction(0);
    setCrystalFormation(false);
    setReactionAnimation(null);
    playSound('success');
  };

  const adjustPH = (delta: number) => {
    setPh(prev => Math.max(0, Math.min(14, prev + delta)));
    addObservation(`pH adjusted to ${(ph + delta).toFixed(1)}`);
  };

  const renderExperimentMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiments.map((experiment) => (
        <Card 
          key={experiment.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          onClick={() => setCurrentExperiment(experiment)}
        >
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">{experiment.icon}</div>
            <CardTitle className="text-lg">{experiment.title}</CardTitle>
            <div className="flex justify-center gap-2 mb-2">
              <Badge variant={experiment.difficulty === 'easy' ? 'default' : experiment.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                {experiment.difficulty}
              </Badge>
              <Badge variant="outline">{experiment.type}</Badge>
            </div>
            <div className="text-sm text-gray-600">
              ⏱️ {experiment.timeEstimate} min | 🛡️ {experiment.safetyLevel} risk
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{experiment.description}</p>
            <p className="text-sm font-semibold text-blue-600">{experiment.objective}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Substances & Equipment */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FlaskConical className="mr-2" size={20} />
            Lab Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Available Substances</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentExperiment?.substances.map((substance) => (
                <Button
                  key={substance.id}
                  onClick={() => addSubstance(substance)}
                  className="w-full justify-start text-left h-auto p-3"
                  variant="outline"
                  disabled={selectedSubstances.length >= 5}
                >
                  <div className="flex items-center w-full">
                    <div 
                      className="w-4 h-4 rounded-full mr-3 border"
                      style={{ backgroundColor: substance.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-xs">{substance.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {substance.state} • {substance.temperature}°C
                        {substance.molecularFormula && ` • ${substance.molecularFormula}`}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">Equipment</h4>
            <div className="grid grid-cols-2 gap-2">
              {labEquipment.slice(0, 6).map((equipment) => (
                <Button
                  key={equipment.id}
                  variant={equipment.available ? 'outline' : 'ghost'}
                  size="sm"
                  className="h-auto p-2 flex flex-col items-center"
                  disabled={!equipment.available}
                  title={equipment.description}
                >
                  <span className="text-lg">{equipment.icon}</span>
                  <span className="text-[10px] text-center">{equipment.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reaction Vessel */}
      <Card className="bg-white/95 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Beaker className="mr-2" size={20} />
              Reaction Vessel
            </span>
            <div className="flex gap-2 text-sm">
              <Badge variant="outline">{temperature}°C</Badge>
              <Badge variant="outline">{pressure} atm</Badge>
              <Badge variant="outline">pH {ph.toFixed(1)}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visual Reaction Vessel */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative mx-auto w-48 h-64 bg-gradient-to-b from-transparent to-gray-200 border-4 border-gray-400 rounded-b-3xl overflow-hidden">
                {/* Mixed substance with animations */}
                {mixedSubstance && (
                  <div 
                    className={`absolute bottom-0 left-0 right-0 rounded-b-3xl transition-all duration-1000 ${
                      reactionAnimation === 'reaction' ? 'animate-pulse' : ''
                    } ${
                      reactionAnimation === 'mixing' ? 'animate-bounce' : ''
                    }`}
                    style={{ 
                      backgroundColor: mixedSubstance.color,
                      height: '70%',
                      animation: mixedSubstance.properties.includes('bubbling') ? 'bubble 0.5s infinite' : undefined
                    }}
                  >
                    {/* Gas bubbles animation */}
                    {gasProduction > 0 && (
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(Math.floor(gasProduction / 20))].map((_, i) => (
                          <div
                            key={i}
                            className="absolute bg-white/60 rounded-full animate-ping"
                            style={{
                              left: `${Math.random() * 80 + 10}%`,
                              bottom: `${Math.random() * 50}%`,
                              width: `${Math.random() * 8 + 4}px`,
                              height: `${Math.random() * 8 + 4}px`,
                              animationDelay: `${Math.random() * 2}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Crystal formation animation */}
                    {crystalFormation && (
                      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent">
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="text-xs text-white font-bold animate-pulse">💎 Crystals forming!</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Selected substances preview layers */}
                {selectedSubstances.map((substance, index) => (
                  <div
                    key={index}
                    className="absolute bottom-0 left-0 right-0 rounded-b-3xl opacity-40 transition-all duration-500"
                    style={{
                      backgroundColor: substance.color,
                      height: `${20 + index * 8}%`,
                      zIndex: selectedSubstances.length - index
                    }}
                  />
                ))}
                
                {/* Temperature indicator */}
                <div className="absolute -right-12 top-4 bg-white rounded px-2 py-1 text-xs font-mono border shadow">
                  🌡️ {temperature}°C
                </div>
                
                {/* Pressure gauge */}
                <div className="absolute -left-12 top-4 bg-white rounded px-2 py-1 text-xs font-mono border shadow">
                  📊 {pressure} atm
                </div>
                
                {/* Stirring indicator */}
                {isStirring && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin text-2xl">🌀</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Control Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium">Temperature</label>
              <div className="flex gap-1">
                <Button
                  onMouseDown={() => setIsHeating(true)}
                  onMouseUp={() => setIsHeating(false)}
                  onMouseLeave={() => setIsHeating(false)}
                  className="bg-red-500 hover:bg-red-600 text-white flex-1"
                  size="sm"
                >
                  🔥
                </Button>
                <Button
                  onMouseDown={() => setIsCooling(true)}
                  onMouseUp={() => setIsCooling(false)}
                  onMouseLeave={() => setIsCooling(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                  size="sm"
                >
                  ❄️
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Pressure</label>
              <div className="flex gap-1">
                <Button onClick={() => setPressure(p => Math.max(0.1, p - 0.1))} size="sm" variant="outline" className="flex-1">-</Button>
                <Button onClick={() => setPressure(p => Math.min(5, p + 0.1))} size="sm" variant="outline" className="flex-1">+</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">pH Control</label>
              <div className="flex gap-1">
                <Button onClick={() => adjustPH(-0.5)} size="sm" variant="outline" className="flex-1">Acid</Button>
                <Button onClick={() => adjustPH(0.5)} size="sm" variant="outline" className="flex-1">Base</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Actions</label>
              <Button 
                onClick={() => setIsStirring(!isStirring)}
                variant={isStirring ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                {isStirring ? 'Stop' : 'Stir'} 🥄
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={mixSubstances} disabled={selectedSubstances.length === 0} className="flex-1">
              React & Analyze
            </Button>
            <Button onClick={clearBeaker} variant="outline">
              Clear Vessel
            </Button>
          </div>

          {/* Current substances */}
          {selectedSubstances.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <h4 className="font-semibold text-sm mb-2">In Reaction Vessel:</h4>
              <div className="grid grid-cols-2 gap-1">
                {selectedSubstances.map((substance, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 border"
                      style={{ backgroundColor: substance.color }}
                    />
                    <span className="truncate">{substance.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis & Observations */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Eye className="mr-2" size={20} />
            Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Microscopy */}
          {currentExperiment?.type === 'biology' && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Microscopy</h4>
              <div className="space-y-2">
                <label className="text-xs">Magnification: {microscopyMagnification}x</label>
                <Slider
                  value={[microscopyMagnification]}
                  onValueChange={([value]) => setMicroscopyMagnification(value)}
                  min={40}
                  max={1000}
                  step={10}
                />
                <div className="bg-black rounded-full w-24 h-24 mx-auto border-4 border-gray-400 flex items-center justify-center text-white text-xs">
                  {microscopyMagnification > 400 ? '🧬 DNA' : microscopyMagnification > 100 ? '🔬 Cells' : '👁️ Tissue'}
                </div>
              </div>
            </div>
          )}
          
          {/* Procedure Steps */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Procedure ({experimentStep + 1}/{currentExperiment?.steps.length || 0})</h4>
            <div className="space-y-1">
              {currentExperiment?.steps.map((step, index) => (
                <div 
                  key={index}
                  className={`text-xs p-2 rounded transition-all ${
                    index === experimentStep ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    index < experimentStep ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">
                      {index < experimentStep ? '✅' : index === experimentStep ? '🔄' : '⏳'}
                    </span>
                    {step}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                onClick={() => setExperimentStep(Math.max(0, experimentStep - 1))}
                disabled={experimentStep === 0}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setExperimentStep(Math.min((currentExperiment?.steps.length || 1) - 1, experimentStep + 1))}
                disabled={experimentStep >= (currentExperiment?.steps.length || 1) - 1}
                size="sm"
                className="flex-1"
              >
                Next Step
              </Button>
            </div>
          </div>

          {/* Live Observations */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Lab Notes</h4>
            <div className="bg-yellow-50 rounded p-3 max-h-32 overflow-y-auto">
              {observations.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No observations recorded yet...</p>
              ) : (
                <div className="space-y-1">
                  {observations.slice(-5).map((obs, index) => (
                    <div key={index} className="text-xs text-gray-700">
                      {obs}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Analysis */}
          {mixedSubstance && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Analysis Results</h4>
              <div className="bg-green-50 rounded p-3 space-y-2">
                <div className="text-xs">
                  <strong>Product:</strong> {mixedSubstance.name}
                </div>
                <div className="text-xs">
                  <strong>State:</strong> {mixedSubstance.state}
                </div>
                {mixedSubstance.ph && (
                  <div className="text-xs">
                    <strong>pH:</strong> {mixedSubstance.ph.toFixed(2)}
                  </div>
                )}
                <div className="text-xs">
                  <strong>Properties:</strong> {mixedSubstance.properties.join(', ')}
                </div>
                <div className="text-xs">
                  <strong>Score:</strong> {score} points
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-500 to-green-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🔬 Virtual Laboratory
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

        {/* Score and Progress */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Atom className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-lg">Score: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-lg">Experiments: {experiments.length}</span>
                </div>
                {currentExperiment && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Current: {currentExperiment.title}</span>
                    <Progress 
                      value={(experimentStep + 1) / currentExperiment.steps.length * 100} 
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {currentExperiment ? (
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{currentExperiment.icon}</span>
                      {currentExperiment.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{currentExperiment.objective}</p>
                  </div>
                  <Button onClick={() => setCurrentExperiment(null)} variant="outline">
                    Change Experiment
                  </Button>
                </div>
              </CardHeader>
            </Card>
            {renderLab()}
          </div>
        ) : (
          <div>
            <Card className="mb-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-3xl">Choose Your Experiment</CardTitle>
                <p className="text-center text-gray-600 text-lg">
                  Explore the fascinating world of science through interactive experiments
                </p>
              </CardHeader>
            </Card>
            {renderExperimentMenu()}
          </div>
        )}
      </div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes bubble {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VirtualLab;