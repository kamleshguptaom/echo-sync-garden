import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume2, VolumeX, Beaker, Thermometer, Zap, Microscope } from 'lucide-react';

interface VirtualLabProps {
  onBack: () => void;
}

type ExperimentType = 'chemistry' | 'physics' | 'biology' | 'earth';

interface Substance {
  id: string;
  name: string;
  color: string;
  state: 'solid' | 'liquid' | 'gas';
  temperature: number;
  ph?: number;
  properties: string[];
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
}

const VirtualLab: React.FC<VirtualLabProps> = ({ onBack }) => {
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null);
  const [selectedSubstances, setSelectedSubstances] = useState<Substance[]>([]);
  const [mixedSubstance, setMixedSubstance] = useState<Substance | null>(null);
  const [temperature, setTemperature] = useState(20);
  const [isHeating, setIsHeating] = useState(false);
  const [isCooling, setIsCooling] = useState(false);
  const [experimentStep, setExperimentStep] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [observations, setObservations] = useState<string[]>([]);

  const experiments: Experiment[] = [
    {
      id: 'acid-base',
      type: 'chemistry',
      title: 'Acid-Base Reactions',
      description: 'Mix acids and bases to see neutralization reactions',
      objective: 'Create a neutral solution with pH 7',
      icon: '🧪',
      substances: [
        { id: 'hcl', name: 'Hydrochloric Acid', color: '#ffcccc', state: 'liquid', temperature: 20, ph: 1, properties: ['corrosive', 'acidic'] },
        { id: 'naoh', name: 'Sodium Hydroxide', color: '#ccccff', state: 'liquid', temperature: 20, ph: 14, properties: ['caustic', 'basic'] },
        { id: 'water', name: 'Water', color: '#cceeff', state: 'liquid', temperature: 20, ph: 7, properties: ['neutral', 'polar'] }
      ],
      equipment: ['beaker', 'thermometer', 'ph-meter'],
      steps: [
        'Add equal amounts of acid and base',
        'Observe color change with pH indicator',
        'Measure final pH',
        'Record observations'
      ],
      expectedResult: 'Neutral solution with pH close to 7'
    },
    {
      id: 'states-matter',
      type: 'physics',
      title: 'States of Matter',
      description: 'Heat and cool water to observe phase transitions',
      objective: 'Observe all three states of water',
      icon: '❄️',
      substances: [
        { id: 'ice', name: 'Ice', color: '#e6f3ff', state: 'solid', temperature: 0, properties: ['crystalline', 'less dense'] },
        { id: 'water', name: 'Water', color: '#cceeff', state: 'liquid', temperature: 20, properties: ['fluid', 'transparent'] },
        { id: 'steam', name: 'Steam', color: '#f0f0f0', state: 'gas', temperature: 100, properties: ['invisible', 'high energy'] }
      ],
      equipment: ['beaker', 'thermometer', 'heat-source', 'cooling-system'],
      steps: [
        'Start with ice at 0°C',
        'Apply heat and observe melting',
        'Continue heating to boiling point',
        'Cool back down to observe condensation'
      ],
      expectedResult: 'Observation of melting, boiling, and condensation'
    },
    {
      id: 'plant-cells',
      type: 'biology',
      title: 'Plant Cell Observation',
      description: 'Use a microscope to study plant cell structures',
      objective: 'Identify cell wall, nucleus, and chloroplasts',
      icon: '🔬',
      substances: [
        { id: 'onion-skin', name: 'Onion Skin', color: '#fff8dc', state: 'solid', temperature: 20, properties: ['transparent', 'thin'] },
        { id: 'iodine', name: 'Iodine Stain', color: '#8b4513', state: 'liquid', temperature: 20, properties: ['staining', 'brown'] },
        { id: 'water-mount', name: 'Water', color: '#cceeff', state: 'liquid', temperature: 20, properties: ['mounting medium'] }
      ],
      equipment: ['microscope', 'slide', 'cover-slip', 'dropper'],
      steps: [
        'Prepare onion skin sample',
        'Add water to slide',
        'Place cover slip carefully',
        'Observe under microscope at different magnifications'
      ],
      expectedResult: 'Clear view of cell walls and nuclei'
    },
    {
      id: 'volcano',
      type: 'earth',
      title: 'Volcano Eruption',
      description: 'Create a chemical volcano eruption',
      objective: 'Simulate volcanic activity using safe chemicals',
      icon: '🌋',
      substances: [
        { id: 'baking-soda', name: 'Baking Soda', color: '#ffffff', state: 'solid', temperature: 20, properties: ['basic', 'reactive'] },
        { id: 'vinegar', name: 'Vinegar', color: '#fff8dc', state: 'liquid', temperature: 20, ph: 2.4, properties: ['acidic', 'organic'] },
        { id: 'food-coloring', name: 'Red Food Coloring', color: '#ff0000', state: 'liquid', temperature: 20, properties: ['dye', 'safe'] }
      ],
      equipment: ['volcano-model', 'measuring-cup', 'funnel'],
      steps: [
        'Add baking soda to volcano',
        'Mix vinegar with food coloring',
        'Pour mixture into volcano',
        'Observe the eruption!'
      ],
      expectedResult: 'Foaming eruption with red "lava"'
    }
  ];

  const playSound = useCallback((type: 'bubble' | 'success' | 'reaction' | 'heat') => {
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
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  }, [soundEnabled]);

  // Temperature control effects
  useEffect(() => {
    if (isHeating || isCooling) {
      const interval = setInterval(() => {
        setTemperature(prev => {
          const change = isHeating ? 2 : -2;
          const newTemp = prev + change;
          return Math.max(-10, Math.min(150, newTemp));
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isHeating, isCooling]);

  const addSubstance = (substance: Substance) => {
    if (selectedSubstances.length < 3) {
      setSelectedSubstances(prev => [...prev, substance]);
      playSound('bubble');
    }
  };

  const mixSubstances = () => {
    if (selectedSubstances.length === 0) return;
    
    playSound('reaction');
    
    // Simulate chemical reactions
    let result: Substance = {
      id: 'mixture',
      name: 'Mixture',
      color: blendColors(selectedSubstances.map(s => s.color)),
      state: 'liquid',
      temperature: temperature,
      properties: []
    };

    // Special reactions
    if (currentExperiment?.id === 'acid-base') {
      const hasAcid = selectedSubstances.some(s => s.ph && s.ph < 7);
      const hasBase = selectedSubstances.some(s => s.ph && s.ph > 7);
      
      if (hasAcid && hasBase) {
        result.ph = 7;
        result.name = 'Neutral Solution';
        result.color = '#e6ffe6';
        addObservation('Color changed to light green - neutralization occurred!');
        setScore(prev => prev + 50);
        playSound('success');
      }
    } else if (currentExperiment?.id === 'volcano') {
      const hasBakingSoda = selectedSubstances.some(s => s.id === 'baking-soda');
      const hasVinegar = selectedSubstances.some(s => s.id === 'vinegar');
      
      if (hasBakingSoda && hasVinegar) {
        result.name = 'Volcanic Eruption';
        result.color = '#ff4444';
        result.properties = ['foaming', 'bubbling', 'expanding'];
        addObservation('Vigorous bubbling and foaming - CO2 gas produced!');
        setScore(prev => prev + 75);
        playSound('success');
      }
    }

    setMixedSubstance(result);
    setSelectedSubstances([]);
  };

  const blendColors = (colors: string[]): string => {
    if (colors.length === 0) return '#ffffff';
    if (colors.length === 1) return colors[0];
    
    // Simple color blending
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
    setObservations(prev => [...prev, observation]);
  };

  const clearBeaker = () => {
    setMixedSubstance(null);
    setSelectedSubstances([]);
    setObservations([]);
  };

  const getSubstanceState = (substance: Substance) => {
    if (substance.name === 'Water' || substance.name === 'Ice' || substance.name === 'Steam') {
      if (temperature <= 0) return 'solid';
      if (temperature >= 100) return 'gas';
      return 'liquid';
    }
    return substance.state;
  };

  const renderExperimentMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {experiments.map((experiment) => (
        <Card 
          key={experiment.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setCurrentExperiment(experiment)}
        >
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">{experiment.icon}</div>
            <CardTitle className="text-lg">{experiment.title}</CardTitle>
            <Badge variant="outline">{experiment.type}</Badge>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lab Equipment */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Beaker className="mr-2" size={20} />
            Available Substances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentExperiment?.substances.map((substance) => (
              <Button
                key={substance.id}
                onClick={() => addSubstance(substance)}
                className="w-full justify-start text-left h-auto p-3"
                variant="outline"
                disabled={selectedSubstances.length >= 3}
              >
                <div className="flex items-center w-full">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 border"
                    style={{ backgroundColor: substance.color }}
                  />
                  <div>
                    <div className="font-medium">{substance.name}</div>
                    <div className="text-xs text-gray-500">
                      {getSubstanceState(substance)} • {substance.temperature}°C
                      {substance.ph && ` • pH ${substance.ph}`}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lab Workspace */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="mr-2" size={20} />
            Lab Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Beaker */}
          <div className="text-center">
            <div className="relative mx-auto w-32 h-40 bg-gradient-to-b from-transparent to-gray-200 border-4 border-gray-400 rounded-b-3xl">
              {/* Mixed substance */}
              {mixedSubstance && (
                <div 
                  className="absolute bottom-0 left-0 right-0 rounded-b-3xl transition-all duration-1000"
                  style={{ 
                    backgroundColor: mixedSubstance.color,
                    height: '60%',
                    animation: mixedSubstance.properties.includes('bubbling') ? 'bubble 0.5s infinite' : undefined
                  }}
                />
              )}
              
              {/* Selected substances preview */}
              {selectedSubstances.map((substance, index) => (
                <div
                  key={index}
                  className="absolute bottom-0 left-0 right-0 rounded-b-3xl opacity-50"
                  style={{
                    backgroundColor: substance.color,
                    height: `${20 + index * 10}%`
                  }}
                />
              ))}
              
              {/* Temperature indicator */}
              <div className="absolute -right-8 top-4 bg-white rounded px-2 py-1 text-xs font-mono border">
                {temperature}°C
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex gap-2 justify-center">
                <Button
                  onMouseDown={() => setIsHeating(true)}
                  onMouseUp={() => setIsHeating(false)}
                  onMouseLeave={() => setIsHeating(false)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                >
                  🔥 Heat
                </Button>
                <Button
                  onMouseDown={() => setIsCooling(true)}
                  onMouseUp={() => setIsCooling(false)}
                  onMouseLeave={() => setIsCooling(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  ❄️ Cool
                </Button>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button onClick={mixSubstances} disabled={selectedSubstances.length === 0}>
                  Mix
                </Button>
                <Button onClick={clearBeaker} variant="outline">
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Current substances */}
          {selectedSubstances.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">In Beaker:</h4>
              <div className="space-y-1">
                {selectedSubstances.map((substance, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: substance.color }}
                    />
                    {substance.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observations */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Microscope className="mr-2" size={20} />
            Lab Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Experiment steps */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Procedure:</h4>
            <div className="space-y-1">
              {currentExperiment?.steps.map((step, index) => (
                <div 
                  key={index}
                  className={`text-xs p-2 rounded ${
                    index <= experimentStep ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}. {step}
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Observations:</h4>
            <div className="bg-gray-50 rounded p-3 min-h-[100px] text-xs">
              {observations.length === 0 ? (
                <p className="text-gray-500">No observations yet...</p>
              ) : (
                observations.map((obs, index) => (
                  <p key={index} className="mb-1">• {obs}</p>
                ))
              )}
            </div>
          </div>

          {/* Results */}
          {mixedSubstance && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Results:</h4>
              <div className="bg-blue-50 rounded p-3 text-xs">
                <p><strong>Product:</strong> {mixedSubstance.name}</p>
                <p><strong>State:</strong> {mixedSubstance.state}</p>
                <p><strong>Temperature:</strong> {mixedSubstance.temperature}°C</p>
                {mixedSubstance.ph && <p><strong>pH:</strong> {mixedSubstance.ph}</p>}
                {mixedSubstance.properties.length > 0 && (
                  <p><strong>Properties:</strong> {mixedSubstance.properties.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => {
              if (currentExperiment) {
                setCurrentExperiment(null);
                clearBeaker();
              } else {
                onBack();
              }
            }}
            variant="outline" 
            className="bg-white/20 text-white border-white/30"
          >
            ← {currentExperiment ? 'Back to Experiments' : 'Back'}
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🔬 Virtual Lab</h1>
            <p className="text-white/90">Conduct safe science experiments</p>
            {currentExperiment && (
              <Badge className="mt-2 bg-white/20 text-white">
                {currentExperiment.title}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-white font-bold">Score: {score}</div>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              className="bg-white/20 text-white border-white/30"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {!currentExperiment ? renderExperimentMenu() : renderLab()}
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes bubble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default VirtualLab;