import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface ControlPanelProps {
  currentExperiment: string;
  gravity: number;
  setGravity: (value: number) => void;
  restitution: number;
  setRestitution: (value: number) => void;
  friction: number;
  setFriction: (value: number) => void;
  waveAmplitude: number;
  setWaveAmplitude: (value: number) => void;
  waveFrequency: number;
  setWaveFrequency: (value: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentExperiment,
  gravity,
  setGravity,
  restitution,
  setRestitution,
  friction,
  setFriction,
  waveAmplitude,
  setWaveAmplitude,
  waveFrequency,
  setWaveFrequency
}) => {
  const showGravityControls = ['gravity', 'pendulum', 'collision', 'projectile'].includes(currentExperiment);
  const showWaveControls = currentExperiment === 'waves';
  const showCollisionControls = ['gravity', 'collision', 'projectile'].includes(currentExperiment);

  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">⚙️ Physics Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showGravityControls && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Gravity</label>
              <Badge variant="outline">{gravity.toFixed(1)} m/s²</Badge>
            </div>
            <Slider
              value={[gravity]}
              onValueChange={(value) => setGravity(value[0])}
              max={20}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Moon (1.6)</span>
              <span>Earth (9.8)</span>
              <span>Jupiter (24.8)</span>
            </div>
          </div>
        )}

        {showCollisionControls && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Bounce (Restitution)</label>
                <Badge variant="outline">{(restitution * 100).toFixed(0)}%</Badge>
              </div>
              <Slider
                value={[restitution]}
                onValueChange={(value) => setRestitution(value[0])}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>No bounce</span>
                <span>Perfect bounce</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Air Resistance</label>
                <Badge variant="outline">{(friction * 100).toFixed(1)}%</Badge>
              </div>
              <Slider
                value={[friction]}
                onValueChange={(value) => setFriction(value[0])}
                max={0.1}
                min={0}
                step={0.001}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Vacuum</span>
                <span>High resistance</span>
              </div>
            </div>
          </>
        )}

        {showWaveControls && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Wave Amplitude</label>
                <Badge variant="outline">{waveAmplitude}px</Badge>
              </div>
              <Slider
                value={[waveAmplitude]}
                onValueChange={(value) => setWaveAmplitude(value[0])}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Wave Frequency</label>
                <Badge variant="outline">{waveFrequency.toFixed(1)} Hz</Badge>
              </div>
              <Slider
                value={[waveFrequency]}
                onValueChange={(value) => setWaveFrequency(value[0])}
                max={5}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Experiment-specific tips */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
            💡 Quick Tips
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {currentExperiment === 'gravity' && (
              <>
                <p>• Try different gravity values to simulate other planets</p>
                <p>• Adjust bounce to see energy conservation effects</p>
              </>
            )}
            {currentExperiment === 'pendulum' && (
              <>
                <p>• Lower gravity makes pendulums swing slower</p>
                <p>• Period depends on length and gravity, not mass</p>
              </>
            )}
            {currentExperiment === 'collision' && (
              <>
                <p>• Perfect bounce (100%) conserves kinetic energy</p>
                <p>• Watch momentum conservation in collisions</p>
              </>
            )}
            {currentExperiment === 'waves' && (
              <>
                <p>• Higher frequency = shorter wavelength</p>
                <p>• Observe wave interference patterns</p>
              </>
            )}
            {currentExperiment === 'projectile' && (
              <>
                <p>• 45° launch angle gives maximum range</p>
                <p>• Air resistance affects trajectory</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};