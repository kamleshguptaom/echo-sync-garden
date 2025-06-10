
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface MediaItem {
  id: string;
  name: string;
  type: 'emoji' | 'image' | 'animation' | 'video' | 'audio' | 'interactive' | '3d-model' | 'ar-content' | 'vr-content';
  content: string;
  category: string;
  description: string;
  subject: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  educationalValue: string;
  usage: string;
  duration?: number;
  size?: string;
  accessibility: string;
  learningOutcome: string;
  ageGroup: string;
  interactivityLevel: string;
  cognitiveLoad: string;
  prerequisites: string[];
}

interface MediaFormProps {
  media: Partial<MediaItem>;
  onMediaChange: (media: Partial<MediaItem>) => void;
  onSubmit: () => void;
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const MediaForm: React.FC<MediaFormProps> = ({
  media,
  onMediaChange,
  onSubmit,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag
}) => {
  const mediaTypes = ['emoji', 'image', 'animation', 'video', 'audio', 'interactive', '3d-model', 'ar-content', 'vr-content'];
  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Art', 'Music', 'Computer Science', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const categories = ['celebration', 'actions', 'educational', 'feedback', 'navigation', 'decoration', 'interactive', 'assessment', 'tutorial', 'game-element'];
  const ageGroups = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years'];
  const interactivityLevels = ['Static', 'Low', 'Medium', 'High', 'Very High'];
  const cognitiveLoads = ['Low', 'Medium', 'High'];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          🎨 Create Media Content
          <span className="text-lg">✨</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-green-700 font-semibold text-sm">Media Name *</Label>
              <Input
                placeholder="Enter media name..."
                value={media.name || ''}
                onChange={(e) => onMediaChange({ ...media, name: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm">Content *</Label>
              <Input
                placeholder={
                  media.type === 'emoji' ? '🎉' :
                  media.type === 'image' ? 'https://example.com/image.png' :
                  media.type === 'animation' ? 'animate-bounce' :
                  media.type === 'video' ? 'https://example.com/video.mp4' :
                  media.type === 'audio' ? 'https://example.com/audio.mp3' :
                  media.type === '3d-model' ? 'https://example.com/model.glb' :
                  'content-identifier'
                }
                value={media.content || ''}
                onChange={(e) => onMediaChange({ ...media, content: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm">Description</Label>
              <Textarea
                placeholder="Describe the media and its purpose..."
                value={media.description || ''}
                onChange={(e) => onMediaChange({ ...media, description: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm">Learning Outcome</Label>
              <Textarea
                placeholder="What will students achieve using this media?"
                value={media.learningOutcome || ''}
                onChange={(e) => onMediaChange({ ...media, learningOutcome: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-green-700 font-semibold text-sm">Educational Value</Label>
              <Textarea
                placeholder="How does this media enhance learning?"
                value={media.educationalValue || ''}
                onChange={(e) => onMediaChange({ ...media, educationalValue: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm">Usage Guidelines</Label>
              <Textarea
                placeholder="When and how to use this media..."
                value={media.usage || ''}
                onChange={(e) => onMediaChange({ ...media, usage: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm">Accessibility Features</Label>
              <Textarea
                placeholder="Describe accessibility considerations..."
                value={media.accessibility || ''}
                onChange={(e) => onMediaChange({ ...media, accessibility: e.target.value })}
                className="bg-white/80 border-green-200 text-gray-800 placeholder:text-gray-500 focus:border-green-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Label className="text-green-700 font-semibold mb-3 block text-sm">Media Classification</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-700 text-xs font-medium">Type *</Label>
              <Select value={media.type || 'emoji'} onValueChange={(value) => onMediaChange({ ...media, type: value as any })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Subject</Label>
              <Select value={media.subject || 'General'} onValueChange={(value) => onMediaChange({ ...media, subject: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
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
              <Label className="text-gray-700 text-xs font-medium">Category</Label>
              <Select value={media.category || 'educational'} onValueChange={(value) => onMediaChange({ ...media, category: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Difficulty</Label>
              <Select value={media.difficulty || 'easy'} onValueChange={(value) => onMediaChange({ ...media, difficulty: value as any })}>
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
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <Label className="text-green-700 font-semibold mb-3 block text-sm">Learning Configuration</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-700 text-xs font-medium">Age Group</Label>
              <Select value={media.ageGroup || ''} onValueChange={(value) => onMediaChange({ ...media, ageGroup: value })}>
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
              <Label className="text-gray-700 text-xs font-medium">Interactivity Level</Label>
              <Select value={media.interactivityLevel || ''} onValueChange={(value) => onMediaChange({ ...media, interactivityLevel: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {interactivityLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 text-xs font-medium">Cognitive Load</Label>
              <Select value={media.cognitiveLoad || ''} onValueChange={(value) => onMediaChange({ ...media, cognitiveLoad: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select load" />
                </SelectTrigger>
                <SelectContent>
                  {cognitiveLoads.map(load => (
                    <SelectItem key={load} value={load}>{load}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <Label className="text-green-700 font-semibold mb-3 block text-sm">Tags & Keywords</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
            />
            <Button onClick={onAddTag} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {media.tags?.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-yellow-100 text-yellow-700 border-yellow-300 cursor-pointer hover:bg-red-100 hover:text-red-700"
                onClick={() => onRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={onSubmit} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 text-lg shadow-lg">
          🎨 Add Media
        </Button>
      </CardContent>
    </Card>
  );
};
