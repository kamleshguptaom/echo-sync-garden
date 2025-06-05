
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NumberSequenceProps {
  onBack: () => void;
}

export const NumberSequence: React.FC<NumberSequenceProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">← Back to Hub</Button>
            <Button onClick={() => window.history.back()} variant="outline">← Previous</Button>
          </div>
          <h1 className="text-3xl font-bold text-white">🔢 Number Patterns</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find the Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p>Identify numerical sequences and patterns!</p>
              <p className="mt-4">Score: {score}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
