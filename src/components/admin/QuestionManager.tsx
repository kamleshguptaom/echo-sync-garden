import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

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
  subject: string;
  topic: string;
  concept: string;
  visualAid: string;
  animation: string;
  timeLimit: number;
  tags: string[];
  learningObjective: string;
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
      points: 10,
      subject: 'Science',
      topic: 'Chemistry',
      concept: 'Chemical Formulas',
      visualAid: 'molecule-diagram',
      animation: 'bounce',
      timeLimit: 30,
      tags: ['chemistry', 'molecules', 'basic'],
      learningObjective: 'Understand basic chemical formulas and molecular composition'
    }
  ]);

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: '',
    difficulty: 'easy',
    emoji: '',
    points: 10,
    subject: '',
    topic: '',
    concept: '',
    visualAid: '',
    animation: 'none',
    timeLimit: 30,
    tags: [],
    learningObjective: ''
  });

  const [newTag, setNewTag] = useState('');

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const animations = ['none', 'bounce', 'pulse', 'shake', 'fadeIn', 'slideIn', 'rotate'];
  const visualAids = ['none', 'diagram', 'chart', 'animation', 'video', 'infographic', 'model'];

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
        points: newQuestion.points || 10,
        subject: newQuestion.subject || 'General',
        topic: newQuestion.topic || '',
        concept: newQuestion.concept || '',
        visualAid: newQuestion.visualAid || 'none',
        animation: newQuestion.animation || 'none',
        timeLimit: newQuestion.timeLimit || 30,
        tags: newQuestion.tags || [],
        learningObjective: newQuestion.learningObjective || ''
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
        points: 10,
        subject: '',
        topic: '',
        concept: '',
        visualAid: '',
        animation: 'none',
        timeLimit: 30,
        tags: [],
        learningObjective: ''
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

  const addTag = () => {
    if (newTag.trim() && !newQuestion.tags?.includes(newTag.trim())) {
      setNewQuestion({ 
        ...newQuestion, 
        tags: [...(newQuestion.tags || []), newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewQuestion({ 
      ...newQuestion, 
      tags: newQuestion.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Add New Question Form */}
      <Card className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md border-2 border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
            ➕ Create Educational Content
            <span className="text-lg">🎓</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold">Question</Label>
                <Textarea
                  placeholder="Enter your educational question..."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[100px]"
                />
              </div>
              <div>
                <Label className="text-white font-semibold">Learning Objective</Label>
                <Textarea
                  placeholder="What should students learn from this question?"
                  value={newQuestion.learningObjective}
                  onChange={(e) => setNewQuestion({ ...newQuestion, learningObjective: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold">Detailed Explanation</Label>
                <Textarea
                  placeholder="Provide a comprehensive explanation..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div>
            <Label className="text-white font-semibold mb-3 block">Answer Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newQuestion.options?.map((option, index) => (
                <div key={index} className="relative">
                  <Label className="text-white text-sm">
                    Option {index + 1} {index === newQuestion.correctAnswer && '✅ (Correct)'}
                  </Label>
                  <Input
                    placeholder={`Option ${index + 1}...`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className={`bg-white/20 border-white/30 text-white placeholder:text-white/60 ${
                      index === newQuestion.correctAnswer ? 'border-green-400 bg-green-400/20' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Subject and Topic Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-white font-semibold">Subject</Label>
              <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion({ ...newQuestion, subject: value })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white font-semibold">Topic</Label>
              <Input
                placeholder="e.g., Photosynthesis"
                value={newQuestion.topic}
                onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white font-semibold">Concept</Label>
              <Input
                placeholder="e.g., Light absorption"
                value={newQuestion.concept}
                onChange={(e) => setNewQuestion({ ...newQuestion, concept: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white font-semibold">Category</Label>
              <Input
                placeholder="e.g., plant-biology"
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-white font-semibold">Correct Answer</Label>
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
              <Label className="text-white font-semibold">Difficulty</Label>
              <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as 'easy' | 'medium' | 'hard' })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">🔴 Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white font-semibold">Emoji</Label>
              <Input
                placeholder="🔬"
                value={newQuestion.emoji}
                onChange={(e) => setNewQuestion({ ...newQuestion, emoji: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white font-semibold">Points</Label>
              <Input
                type="number"
                placeholder="10"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 10 })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white font-semibold">Time Limit (seconds): {newQuestion.timeLimit}</Label>
              <Slider
                value={[newQuestion.timeLimit || 30]}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, timeLimit: value[0] })}
                max={120}
                min={10}
                step={5}
                className="mt-2"
              />
            </div>
          </div>

          {/* Visual and Animation Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white font-semibold">Visual Aid</Label>
              <Select value={newQuestion.visualAid} onValueChange={(value) => setNewQuestion({ ...newQuestion, visualAid: value })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visualAids.map(aid => (
                    <SelectItem key={aid} value={aid}>{aid}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white font-semibold">Animation</Label>
              <Select value={newQuestion.animation} onValueChange={(value) => setNewQuestion({ ...newQuestion, animation: value })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {animations.map(animation => (
                    <SelectItem key={animation} value={animation}>{animation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-white font-semibold">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} className="bg-blue-500 hover:bg-blue-600">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newQuestion.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/30 cursor-pointer hover:bg-red-500/50"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={addQuestion} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 text-lg">
            ➕ Create Question
          </Button>
        </CardContent>
      </Card>

      {/* Existing Questions with enhanced display */}
      <Card className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md border-2 border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            📚 Educational Content Library ({questions.length})
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-white/30">
                Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-white/30">
                Avg. Time: {Math.round(questions.reduce((sum, q) => sum + q.timeLimit, 0) / questions.length || 0)}s
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {questions.map((question) => (
            <div key={question.id} className="bg-gradient-to-r from-white/20 to-white/10 p-6 rounded-xl border-2 border-white/30 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{question.emoji}</span>
                  <div className="flex gap-2">
                    <Badge className={`${
                      question.difficulty === 'easy' ? 'bg-green-500' :
                      question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {question.subject}
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {question.points} pts
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {question.timeLimit}s
                    </Badge>
                  </div>
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
              
              <h3 className="text-white font-semibold mb-2 text-lg">{question.question}</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                {question.options.map((option, index) => (
                  <div key={index} className={`p-3 rounded-lg ${index === question.correctAnswer ? 'bg-green-500/30 border border-green-400' : 'bg-white/10'}`}>
                    <span className="text-white text-sm">
                      {index === question.correctAnswer && '✅ '}{option}
                    </span>
                  </div>
                ))}
              </div>
              
              {question.explanation && (
                <div className="bg-blue-500/20 p-3 rounded-lg mb-3">
                  <p className="text-white/90 text-sm italic">{question.explanation}</p>
                </div>
              )}
              
              {question.learningObjective && (
                <div className="bg-purple-500/20 p-3 rounded-lg mb-3">
                  <p className="text-white/90 text-sm"><strong>Learning Goal:</strong> {question.learningObjective}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
