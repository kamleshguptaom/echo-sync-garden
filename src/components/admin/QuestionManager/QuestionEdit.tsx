
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';

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

interface QuestionEditProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [newTag, setNewTag] = useState('');

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const cognitivelevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
  const ageGroups = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years'];

  const updateOption = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const addTag = () => {
    if (newTag.trim() && !editedQuestion.tags.includes(newTag.trim())) {
      setEditedQuestion({ 
        ...editedQuestion, 
        tags: [...editedQuestion.tags, newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedQuestion({ 
      ...editedQuestion, 
      tags: editedQuestion.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSave = () => {
    onSave(editedQuestion);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-t-lg">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-bold">✏️ Edit Question</span>
          <Button onClick={onCancel} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-700 font-semibold">Question</Label>
            <Textarea
              value={editedQuestion.question}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
              className="bg-white border-blue-200"
            />
          </div>
          <div>
            <Label className="text-blue-700 font-semibold">Explanation</Label>
            <Textarea
              value={editedQuestion.explanation}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, explanation: e.target.value })}
              className="bg-white border-blue-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-700 font-semibold">Answer Options</Label>
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className={`${index === editedQuestion.correctAnswer ? 'border-green-400 bg-green-50' : 'bg-white'}`}
              />
              {index === editedQuestion.correctAnswer && <span className="text-green-600">✓</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-blue-700 font-semibold">Subject</Label>
            <Select value={editedQuestion.subject} onValueChange={(value) => setEditedQuestion({ ...editedQuestion, subject: value })}>
              <SelectTrigger className="bg-white">
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
            <Label className="text-blue-700 font-semibold">Difficulty</Label>
            <Select value={editedQuestion.difficulty} onValueChange={(value) => setEditedQuestion({ ...editedQuestion, difficulty: value as any })}>
              <SelectTrigger className="bg-white">
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
            <Label className="text-blue-700 font-semibold">Correct Answer</Label>
            <Select value={editedQuestion.correctAnswer.toString()} onValueChange={(value) => setEditedQuestion({ ...editedQuestion, correctAnswer: parseInt(value) })}>
              <SelectTrigger className="bg-white">
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
            <Label className="text-blue-700 font-semibold">Points</Label>
            <Input
              type="number"
              value={editedQuestion.points}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, points: parseInt(e.target.value) || 10 })}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-blue-700 font-semibold">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-white"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {editedQuestion.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
