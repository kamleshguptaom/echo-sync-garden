
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MathRacingProps {
  onBack: () => void;
}

export const MathRacing: React.FC<MathRacingProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">← Back to Hub</Button>
            <Button onClick={() => window.history.back()} variant="outline">← Previous</Button>
          </div>
          <h1 className="text-3xl font-bold text-white">🏎️ Math Racing</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Speed Math Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p>Solve math problems as fast as you can!</p>
              <p className="mt-4">Score: {score}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
