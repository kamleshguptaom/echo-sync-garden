
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface QuestionBuilderProps {
  question: Partial<Question>;
  onQuestionChange: (question: Partial<Question>) => void;
  onSubmit: () => void;
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  onQuestionChange,
  onSubmit,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag
}) => {
  const [newHint, setNewHint] = useState('');
  const [newPrereq, setNewPrereq] = useState('');
  const [newRelatedTopic, setNewRelatedTopic] = useState('');

  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const categories = ['arithmetic', 'algebra', 'geometry', 'science', 'language', 'history', 'geography', 'general'];
  const cognitivelevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
  const ageGroups = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years'];
  const animations = ['none', 'bounce', 'fade', 'slide', 'pulse', 'spin', 'ping'];

  const addHint = () => {
    if (newHint.trim()) {
      onQuestionChange({ 
        ...question, 
        hints: [...(question.hints || []), newHint.trim()] 
      });
      setNewHint('');
    }
  };

  const removeHint = (index: number) => {
    const updatedHints = question.hints?.filter((_, i) => i !== index) || [];
    onQuestionChange({ ...question, hints: updatedHints });
  };

  const addPrereq = () => {
    if (newPrereq.trim()) {
      onQuestionChange({ 
        ...question, 
        prerequisites: [...(question.prerequisites || []), newPrereq.trim()] 
      });
      setNewPrereq('');
    }
  };

  const removePrereq = (index: number) => {
    const updatedPrereqs = question.prerequisites?.filter((_, i) => i !== index) || [];
    onQuestionChange({ ...question, prerequisites: updatedPrereqs });
  };

  const addRelatedTopic = () => {
    if (newRelatedTopic.trim()) {
      onQuestionChange({ 
        ...question, 
        relatedTopics: [...(question.relatedTopics || []), newRelatedTopic.trim()] 
      });
      setNewRelatedTopic('');
    }
  };

  const removeRelatedTopic = (index: number) => {
    const updatedTopics = question.relatedTopics?.filter((_, i) => i !== index) || [];
    onQuestionChange({ ...question, relatedTopics: updatedTopics });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          🎓 Interactive Question Builder
          <span className="text-lg animate-bounce">✨</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">📝 Basic Info</TabsTrigger>
            <TabsTrigger value="content">💡 Content</TabsTrigger>
            <TabsTrigger value="learning">🎯 Learning</TabsTrigger>
            <TabsTrigger value="advanced">⚙️ Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-700 font-semibold">Question Text *</Label>
                <Textarea
                  placeholder="Enter your question here..."
                  value={question.question || ''}
                  onChange={(e) => onQuestionChange({ ...question, question: e.target.value })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
              <div>
                <Label className="text-blue-700 font-semibold">Explanation</Label>
                <Textarea
                  placeholder="Explain the correct answer..."
                  value={question.explanation || ''}
                  onChange={(e) => onQuestionChange({ ...question, explanation: e.target.value })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
            </div>

            <div className="bg-white/60 p-4 rounded-lg">
              <Label className="text-blue-700 font-semibold mb-3 block">Answer Options *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={question.correctAnswer === index}
                      onChange={() => onQuestionChange({ ...question, correctAnswer: index })}
                      className="w-4 h-4 text-blue-500"
                    />
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={question.options?.[index] || ''}
                      onChange={(e) => {
                        const newOptions = [...(question.options || ['', '', '', ''])];
                        newOptions[index] = e.target.value;
                        onQuestionChange({ ...question, options: newOptions });
                      }}
                      className={`bg-white/80 ${question.correctAnswer === index ? 'border-green-400 ring-2 ring-green-200' : 'border-blue-200'}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-blue-700 font-semibold">Subject</Label>
                <Select value={question.subject || ''} onValueChange={(value) => onQuestionChange({ ...question, subject: value })}>
                  <SelectTrigger className="bg-white/80 border-blue-200">
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
                <Label className="text-blue-700 font-semibold">Category</Label>
                <Select value={question.category || ''} onValueChange={(value) => onQuestionChange({ ...question, category: value })}>
                  <SelectTrigger className="bg-white/80 border-blue-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-blue-700 font-semibold">Difficulty</Label>
                <Select value={question.difficulty || 'easy'} onValueChange={(value) => onQuestionChange({ ...question, difficulty: value as any })}>
                  <SelectTrigger className="bg-white/80 border-blue-200">
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
                <Label className="text-blue-700 font-semibold">Points</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={question.points || ''}
                  onChange={(e) => onQuestionChange({ ...question, points: parseInt(e.target.value) || 10 })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-blue-700 font-semibold">Emoji</Label>
                <Input
                  placeholder="❓"
                  value={question.emoji || ''}
                  onChange={(e) => onQuestionChange({ ...question, emoji: e.target.value })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
              <div>
                <Label className="text-blue-700 font-semibold">Time Limit (seconds)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={question.timeLimit || ''}
                  onChange={(e) => onQuestionChange({ ...question, timeLimit: parseInt(e.target.value) || 30 })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
              <div>
                <Label className="text-blue-700 font-semibold">Animation</Label>
                <Select value={question.animation || 'none'} onValueChange={(value) => onQuestionChange({ ...question, animation: value })}>
                  <SelectTrigger className="bg-white/80 border-blue-200">
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
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-700 font-semibold">Learning Objective</Label>
                <Textarea
                  placeholder="What should students learn from this question?"
                  value={question.learningObjective || ''}
                  onChange={(e) => onQuestionChange({ ...question, learningObjective: e.target.value })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-blue-700 font-semibold">Cognitive Level</Label>
                  <Select value={question.cognitiveLevel || ''} onValueChange={(value) => onQuestionChange({ ...question, cognitiveLevel: value })}>
                    <SelectTrigger className="bg-white/80 border-blue-200">
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
                  <Label className="text-blue-700 font-semibold">Age Group</Label>
                  <Select value={question.ageGroup || ''} onValueChange={(value) => onQuestionChange({ ...question, ageGroup: value })}>
                    <SelectTrigger className="bg-white/80 border-blue-200">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map(age => (
                        <SelectItem key={age} value={age}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Hints Section */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <Label className="text-blue-700 font-semibold mb-3 block">Hints</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a helpful hint..."
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  className="bg-white border-yellow-300"
                  onKeyPress={(e) => e.key === 'Enter' && addHint()}
                />
                <Button onClick={addHint} className="bg-yellow-500 hover:bg-yellow-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.hints?.map((hint, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-yellow-100 text-yellow-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeHint(index)}
                  >
                    {hint} ×
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-700 font-semibold">Topic</Label>
                <Input
                  placeholder="Specific topic..."
                  value={question.topic || ''}
                  onChange={(e) => onQuestionChange({ ...question, topic: e.target.value })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
              <div>
                <Label className="text-blue-700 font-semibold">Concept</Label>
                <Input
                  placeholder="Key concept..."
                  value={question.concept || ''}
                  onChange={(e) => onQuestionChange({ ...question, concept: e.target.value })}
                  className="bg-white/80 border-blue-200"
                />
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Label className="text-blue-700 font-semibold mb-3 block">Prerequisites</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add prerequisite knowledge..."
                  value={newPrereq}
                  onChange={(e) => setNewPrereq(e.target.value)}
                  className="bg-white border-purple-300"
                  onKeyPress={(e) => e.key === 'Enter' && addPrereq()}
                />
                <Button onClick={addPrereq} className="bg-purple-500 hover:bg-purple-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.prerequisites?.map((prereq, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-purple-100 text-purple-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removePrereq(index)}
                  >
                    {prereq} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Related Topics Section */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-blue-700 font-semibold mb-3 block">Related Topics</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add related topic..."
                  value={newRelatedTopic}
                  onChange={(e) => setNewRelatedTopic(e.target.value)}
                  className="bg-white border-green-300"
                  onKeyPress={(e) => e.key === 'Enter' && addRelatedTopic()}
                />
                <Button onClick={addRelatedTopic} className="bg-green-500 hover:bg-green-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.relatedTopics?.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-green-100 text-green-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeRelatedTopic(index)}
                  >
                    {topic} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-blue-700 font-semibold mb-3 block">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => onNewTagChange(e.target.value)}
                  className="bg-white border-blue-300"
                  onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
                />
                <Button onClick={onAddTag} className="bg-blue-500 hover:bg-blue-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.tags?.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-blue-100 text-blue-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => onRemoveTag(tag)}
                  >
                    #{tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-6 border-t border-blue-200 mt-6">
          <Button 
            onClick={onSubmit} 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎓 Create Interactive Question
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
