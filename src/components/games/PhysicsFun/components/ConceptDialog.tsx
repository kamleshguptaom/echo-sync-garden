import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConceptDialogProps {
  experiment: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptDialog: React.FC<ConceptDialogProps> = ({
  experiment,
  isOpen,
  onClose
}) => {
  if (!experiment) return null;

  const getConceptDetails = (concept: string) => {
    const details: Record<string, { description: string; formula?: string; examples: string[] }> = {
      "Newton's Laws": {
        description: "The fundamental laws of motion that describe the relationship between forces and motion.",
        formula: "F = ma (Second Law)",
        examples: [
          "🚀 A rocket accelerates by expelling mass",
          "🚗 A car needs more force to accelerate when carrying more passengers",
          "⚽ A soccer ball changes direction when kicked"
        ]
      },
      "Free Fall": {
        description: "Motion under the influence of gravity alone, ignoring air resistance.",
        formula: "h = ½gt², v = gt",
        examples: [
          "🍎 An apple falling from a tree",
          "🪨 A stone dropped from a cliff",
          "🏀 A basketball in the air"
        ]
      },
      "Conservation of Energy": {
        description: "Energy cannot be created or destroyed, only converted from one form to another.",
        formula: "PE + KE = constant",
        examples: [
          "🎢 Roller coaster at the top vs bottom of a hill",
          "⚖️ Pendulum swinging back and forth",
          "🏹 Archer's bow storing and releasing energy"
        ]
      },
      "Simple Harmonic Motion": {
        description: "Repetitive motion where the restoring force is proportional to displacement.",
        formula: "T = 2π√(L/g) for pendulum",
        examples: [
          "⚖️ Pendulum clock",
          "🌀 Mass on a spring",
          "🎵 Vibrating guitar string"
        ]
      },
      "Wave Properties": {
        description: "Characteristics of waves including amplitude, frequency, wavelength, and speed.",
        formula: "v = fλ (wave equation)",
        examples: [
          "🌊 Ocean waves on a beach",
          "🔊 Sound waves from speakers",
          "📡 Radio waves for communication"
        ]
      },
      "Interference": {
        description: "When two or more waves overlap, they combine to form a new wave pattern.",
        examples: [
          "🎵 Noise-canceling headphones",
          "🌊 Wave patterns in water",
          "🔬 Light interference in thin films"
        ]
      },
      "Conservation of Momentum": {
        description: "In a closed system, the total momentum before and after a collision remains constant.",
        formula: "m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'",
        examples: [
          "🎱 Billiard balls colliding",
          "🚗 Car crashes and safety",
          "🚀 Rocket propulsion"
        ]
      },
      "Ohm's Law": {
        description: "The relationship between voltage, current, and resistance in electrical circuits.",
        formula: "V = IR",
        examples: [
          "💡 Light bulb brightness control",
          "🔋 Battery powering devices",
          "⚡ Electrical safety and fuses"
        ]
      },
      "Magnetic Fields": {
        description: "Invisible force fields around magnets that affect magnetic materials and moving charges.",
        examples: [
          "🧭 Compass needle pointing north",
          "🧲 Refrigerator magnets",
          "🌍 Earth's protective magnetic field"
        ]
      },
      "Hooke's Law": {
        description: "The force needed to extend or compress a spring is proportional to the displacement.",
        formula: "F = -kx",
        examples: [
          "🌀 Car suspension systems",
          "⌚ Mechanical watch springs",
          "🏹 Bow and arrow tension"
        ]
      },
      "Reflection": {
        description: "When light bounces off a surface, following the law of reflection.",
        formula: "θᵢ = θᵣ (angle of incidence = angle of reflection)",
        examples: [
          "🪞 Mirrors in your home",
          "🌙 Moonlight is reflected sunlight",
          "💎 Sparkling diamonds and gems"
        ]
      },
      "Refraction": {
        description: "The bending of light when it passes from one medium to another.",
        formula: "n₁sin θ₁ = n₂sin θ₂ (Snell's Law)",
        examples: [
          "👓 Eyeglasses correcting vision",
          "🌈 Prisms creating rainbows",
          "🏊 Objects appearing bent in water"
        ]
      }
    };

    return details[concept] || { 
      description: "Learn about this fundamental physics concept!", 
      examples: ["🔬 Explore through experimentation"] 
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {experiment.icon} {experiment.name} - Physics Concepts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-lg">{experiment.description}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {experiment.concepts.map((concept: string, index: number) => {
              const details = getConceptDetails(concept);
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-sm">
                        Concept {index + 1}
                      </Badge>
                      <h3 className="text-xl font-semibold">{concept}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {details.description}
                    </p>
                    
                    {details.formula && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <span className="font-mono text-lg">{details.formula}</span>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-2">Real-World Examples:</h4>
                      <div className="space-y-1">
                        {details.examples.map((example, exIndex) => (
                          <div key={exIndex} className="flex items-start gap-2">
                            <span className="text-sm opacity-75">•</span>
                            <span className="text-sm">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                💡 Interactive Learning Tips
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Adjust the physics parameters to see how they affect the experiment</li>
                <li>• Try pausing the animation to observe specific moments</li>
                <li>• Add or remove objects to test different scenarios</li>
                <li>• Compare your observations with the theoretical predictions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};