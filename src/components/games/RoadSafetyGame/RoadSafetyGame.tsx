
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface RoadSafetyGameProps {
  onBack: () => void;
}

export const RoadSafetyGame: React.FC<RoadSafetyGameProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConcept, setShowConcept] = useState(false);

  const questions = [
    {
      question: "What does a red traffic light mean?",
      options: ["Go", "Stop", "Slow down", "Turn left"],
      correct: 1,
      explanation: "Red means stop completely and wait for green."
    },
    {
      question: "When should you wear a seatbelt?",
      options: ["Only on highways", "Always in a car", "Only at night", "Only when driving"],
      correct: 1,
      explanation: "Seatbelts should always be worn for safety."
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">← Back to Hub</Button>
            <Button onClick={() => window.history.back()} variant="outline">← Previous</Button>
          </div>
          <h1 className="text-3xl font-bold text-white">🚦 Road Safety</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white">🧠 Concept</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Road Safety Education</DialogTitle>
                <DialogDescription>Learn important traffic rules and safety</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Road Safety Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-lg mb-4">Score: {score}</p>
              <p>Learn about traffic safety, road signs, and pedestrian rules!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
