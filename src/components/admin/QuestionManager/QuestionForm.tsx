
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  hints: string[];
  relatedTopics: string[];
  cognitiveLevel: string;
  ageGroup: string;
  prerequisites: string[];
}

interface QuestionFormProps {
  question: Partial<Question>;
  onQuestionChange: (question: Partial<Question>) => void;
  onSubmit: () => void;
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onQuestionChange,
  onSubmit,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag
}) => {
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art', 'Music', 'Physical Education'];
  const animations = ['none', 'bounce', 'pulse', 'shake', 'fadeIn', 'slideIn', 'rotate', 'wiggle', 'flash', 'rubberBand'];
  const visualAids = ['none', 'diagram', 'chart', 'animation', 'video', 'infographic', 'model', '3d-model', 'interactive', 'simulation'];
  const cognitivelevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
  const ageGroups = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years'];

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || ['', '', '', ''])];
    newOptions[index] = value;
    onQuestionChange({ ...question, options: newOptions });
  };

  const addHint = () => {
    const hints = question.hints || [];
    onQuestionChange({ ...question, hints: [...hints, ''] });
  };

  const updateHint = (index: number, value: string) => {
    const hints = [...(question.hints || [])];
    hints[index] = value;
    onQuestionChange({ ...question, hints });
  };

  const removeHint = (index: number) => {
    const hints = question.hints?.filter((_, i) => i !== index) || [];
    onQuestionChange({ ...question, hints });
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          ➕ Create Educational Content
          <span className="text-lg">🎓</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-purple-700 font-semibold text-sm">Question *</Label>
              <Textarea
                placeholder="Enter your educational question..."
                value={question.question || ''}
                onChange={(e) => onQuestionChange({ ...question, question: e.target.value })}
                className="bg-white/80 border-purple-200 text-gray-800 placeholder:text-gray-500 min-h-[100px] focus:border-purple-400"
              />
            </div>
            <div>
              <Label className="text-purple-700 font-semibold text-sm">Learning Objective</Label>
              <Textarea
                placeholder="What should students learn from this question?"
                value={question.learningObjective || ''}
                onChange={(e) => onQuestionChange({ ...question, learningObjective: e.target.value })}
                className="bg-white/80 border-purple-200 text-gray-800 placeholder:text-gray-500 focus:border-purple-400"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-purple-700 font-semibold text-sm">Detailed Explanation</Label>
              <Textarea
                placeholder="Provide a comprehensive explanation..."
                value={question.explanation || ''}
                onChange={(e) => onQuestionChange({ ...question, explanation: e.target.value })}
                className="bg-white/80 border-purple-200 text-gray-800 placeholder:text-gray-500 min-h-[100px] focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Label className="text-purple-700 font-semibold mb-3 block text-sm">Answer Options *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options?.map((option, index) => (
              <div key={index} className="relative">
                <Label className="text-gray-700 text-xs font-medium">
                  Option {index + 1} {index === question.correctAnswer && '✅ (Correct)'}
                </Label>
                <Input
                  placeholder={`Option ${index + 1}...`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className={`bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 ${
                    index === question.correctAnswer ? 'border-green-400 bg-green-50' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subject and Topic Information */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <Label className="text-purple-700 font-semibold mb-3 block text-sm">Subject Classification</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-700 text-xs font-medium">Subject *</Label>
              <Select value={question.subject || ''} onValueChange={(value) => onQuestionChange({ ...question, subject: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Topic</Label>
              <Input
                placeholder="e.g., Photosynthesis"
                value={question.topic || ''}
                onChange={(e) => onQuestionChange({ ...question, topic: e.target.value })}
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Concept</Label>
              <Input
                placeholder="e.g., Light absorption"
                value={question.concept || ''}
                onChange={(e) => onQuestionChange({ ...question, concept: e.target.value })}
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Category</Label>
              <Input
                placeholder="e.g., plant-biology"
                value={question.category || ''}
                onChange={(e) => onQuestionChange({ ...question, category: e.target.value })}
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Learning Configuration */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <Label className="text-purple-700 font-semibold mb-3 block text-sm">Learning Configuration</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-700 text-xs font-medium">Cognitive Level</Label>
              <Select value={question.cognitiveLevel || ''} onValueChange={(value) => onQuestionChange({ ...question, cognitiveLevel: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {cognitivelevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Age Group</Label>
              <Select value={question.ageGroup || ''} onValueChange={(value) => onQuestionChange({ ...question, ageGroup: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map(age => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Correct Answer</Label>
              <Select value={question.correctAnswer?.toString() || '0'} onValueChange={(value) => onQuestionChange({ ...question, correctAnswer: parseInt(value) })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
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
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <Label className="text-purple-700 font-semibold mb-3 block text-sm">Game Settings</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-gray-700 text-xs font-medium">Difficulty</Label>
              <Select value={question.difficulty || 'easy'} onValueChange={(value) => onQuestionChange({ ...question, difficulty: value as 'easy' | 'medium' | 'hard' })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
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
              <Label className="text-gray-700 text-xs font-medium">Emoji</Label>
              <Input
                placeholder="🔬"
                value={question.emoji || ''}
                onChange={(e) => onQuestionChange({ ...question, emoji: e.target.value })}
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Points</Label>
              <Input
                type="number"
                placeholder="10"
                value={question.points || 10}
                onChange={(e) => onQuestionChange({ ...question, points: parseInt(e.target.value) || 10 })}
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Visual Aid</Label>
              <Select value={question.visualAid || 'none'} onValueChange={(value) => onQuestionChange({ ...question, visualAid: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
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
              <Label className="text-gray-700 text-xs font-medium">Animation</Label>
              <Select value={question.animation || 'none'} onValueChange={(value) => onQuestionChange({ ...question, animation: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
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
          <div className="mt-4">
            <Label className="text-gray-700 text-xs font-medium">Time Limit: {question.timeLimit || 30} seconds</Label>
            <Slider
              value={[question.timeLimit || 30]}
              onValueChange={(value) => onQuestionChange({ ...question, timeLimit: value[0] })}
              max={120}
              min={10}
              step={5}
              className="mt-2"
            />
          </div>
        </div>

        {/* Hints Section */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <Label className="text-purple-700 font-semibold mb-3 block text-sm">Learning Hints</Label>
          <div className="space-y-2">
            {question.hints?.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Hint ${index + 1}...`}
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
                <Button onClick={() => removeHint(index)} variant="destructive" size="sm">
                  ✕
                </Button>
              </div>
            ))}
            <Button onClick={addHint} variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
              + Add Hint
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <Label className="text-purple-700 font-semibold mb-3 block text-sm">Tags & Keywords</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
            />
            <Button onClick={onAddTag} className="bg-teal-500 hover:bg-teal-600 text-white">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.tags?.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-teal-100 text-teal-700 border-teal-300 cursor-pointer hover:bg-red-100 hover:text-red-700"
                onClick={() => onRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={onSubmit} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg shadow-lg">
          ➕ Create Question
        </Button>
      </CardContent>
    </Card>
  );
};
