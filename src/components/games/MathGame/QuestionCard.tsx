
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  question: {
    num1: number;
    num2: number;
    operation: string;
    topic: string;
    concept: {
      emoji: string;
    };
  };
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  feedback: { type: 'correct' | 'incorrect' | null; message: string };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  onSubmit,
  feedback
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <Card className={`bg-white/80 backdrop-blur-md border-2 border-white/50 max-w-md mx-auto shadow-xl ${
      feedback.type === 'correct' ? 'animate-bounce' : 
      feedback.type === 'incorrect' ? 'animate-pulse' : ''
    }`}>
      <CardContent className="p-8 text-center">
        <div className="space-y-6">
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 text-sm">
            📚 {question.topic}
          </Badge>
          
          <div className="text-5xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span>{question.concept.emoji}</span>
            <span>{question.num1} {question.operation} {question.num2} = ?</span>
          </div>
          
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your answer..."
            className="text-center text-2xl font-bold bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500"
            autoFocus
          />
          
          <Button 
            onClick={onSubmit} 
            disabled={userAnswer === ''}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 text-lg shadow-lg"
          >
            Submit Answer ✨
          </Button>
          
          {feedback.message && (
            <div className={`p-3 rounded-lg font-bold ${
              feedback.type === 'correct' 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
