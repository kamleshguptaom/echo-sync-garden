import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  emoji: string;
  points: number;
}

export const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'NaCl', 'O2'],
      correctAnswer: 0,
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.',
      category: 'chemistry',
      difficulty: 'easy',
      emoji: '💧',
      points: 10
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: '',
    difficulty: 'easy',
    emoji: '',
    points: 10
  });

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options?.every(opt => opt.trim())) {
      const question: Question = {
        id: Date.now().toString(),
        question: newQuestion.question,
        options: newQuestion.options as string[],
        correctAnswer: newQuestion.correctAnswer || 0,
        explanation: newQuestion.explanation || '',
        category: newQuestion.category || 'general',
        difficulty: newQuestion.difficulty || 'easy',
        emoji: newQuestion.emoji || '❓',
        points: newQuestion.points || 10
      };
      
      setQuestions([...questions, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        category: '',
        difficulty: 'easy',
        emoji: '',
        points: 10
      });
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  return (
    <div className="space-y-6">
      {/* Add New Question Form */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">➕ Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Question</Label>
              <Textarea
                placeholder="Enter your question..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Explanation</Label>
              <Textarea
                placeholder="Explain the answer..."
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {newQuestion.options?.map((option, index) => (
              <div key={index}>
                <Label className="text-white">Option {index + 1} {index === newQuestion.correctAnswer && '✓ (Correct)'}</Label>
                <Input
                  placeholder={`Option ${index + 1}...`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label className="text-white">Correct Answer</Label>
              <Select value={newQuestion.correctAnswer?.toString()} onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(value) })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Option 1</SelectItem>
                  <SelectItem value="1">Option 2</SelectItem>
                  <SelectItem value="2">Option 3</SelectItem>
                  <SelectItem value="3">Option 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Category</Label>
              <Input
                placeholder="Category..."
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Difficulty</Label>
              <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as 'easy' | 'medium' | 'hard' })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Emoji</Label>
              <Input
                placeholder="🔬"
                value={newQuestion.emoji}
                onChange={(e) => setNewQuestion({ ...newQuestion, emoji: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Points</Label>
              <Input
                type="number"
                placeholder="10"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 10 })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <Button onClick={addQuestion} className="bg-green-500 hover:bg-green-600 text-white">
            ➕ Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Existing Questions */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex justify-between">
            📚 Existing Questions ({questions.length})
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {questions.map((question) => (
            <div key={question.id} className="bg-white/20 p-4 rounded-lg border border-white/30">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{question.emoji}</span>
                  <Badge className={`${
                    question.difficulty === 'easy' ? 'bg-green-500' :
                    question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                    {question.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {question.category}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {question.points} pts
                  </Badge>
                </div>
                <Button
                  onClick={() => deleteQuestion(question.id)}
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                >
                  🗑️ Delete
                </Button>
              </div>
              <h3 className="text-white font-semibold mb-2">{question.question}</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {question.options.map((option, index) => (
                  <div key={index} className={`p-2 rounded ${index === question.correctAnswer ? 'bg-green-500/50' : 'bg-white/10'}`}>
                    <span className="text-white text-sm">
                      {index === question.correctAnswer && '✓ '}{option}
                    </span>
                  </div>
                ))}
              </div>
              {question.explanation && (
                <p className="text-white/80 text-sm italic">{question.explanation}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
