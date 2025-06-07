
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LogicSolutionProps {
  solution: string;
  steps: string[];
  isVisible: boolean;
}

export const LogicSolution: React.FC<LogicSolutionProps> = ({ solution, steps, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-green-700 mb-4 animate-scale-in">
          🎯 Solution & Explanation
        </h3>
        
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-lg font-semibold text-blue-600 mb-2">Answer:</div>
          <div className="text-2xl font-bold text-green-600">{solution}</div>
        </div>
        
        <div className="space-y-3">
          <div className="text-lg font-semibold text-gray-700">Step-by-step explanation:</div>
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm animate-slide-in-right"
              style={{ animationDelay: `${0.4 + (index * 0.2)}s` }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="text-gray-700">{step}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-sm text-yellow-700">
            💡 <strong>Tip:</strong> Look for patterns, eliminate impossible options, and work backwards from the conclusion!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
