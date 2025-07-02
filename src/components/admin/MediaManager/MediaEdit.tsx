
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';

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

interface MediaEditProps {
  media: MediaItem;
  onSave: (media: MediaItem) => void;
  onCancel: () => void;
}

export const MediaEdit: React.FC<MediaEditProps> = ({ media, onSave, onCancel }) => {
  const [editedMedia, setEditedMedia] = useState<MediaItem>(media);
  const [newTag, setNewTag] = useState('');

  const mediaTypes = ['emoji', 'image', 'animation', 'video', 'audio', 'interactive', '3d-model', 'ar-content', 'vr-content'];
  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Art', 'Music'];
  const categories = ['celebration', 'actions', 'educational', 'feedback', 'navigation', 'decoration'];

  const addTag = () => {
    if (newTag.trim() && !editedMedia.tags.includes(newTag.trim())) {
      setEditedMedia({ 
        ...editedMedia, 
        tags: [...editedMedia.tags, newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedMedia({ 
      ...editedMedia, 
      tags: editedMedia.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSave = () => {
    onSave(editedMedia);
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-t-lg">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-bold">✏️ Edit Media</span>
          <Button onClick={onCancel} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="text-orange-700 font-semibold">Name</Label>
            <Input
              value={editedMedia.name}
              onChange={(e) => setEditedMedia({ ...editedMedia, name: e.target.value })}
              className="bg-white border-orange-200"
            />
          </div>
          <div>
            <Label className="text-orange-700 font-semibold">Content</Label>
            <Input
              value={editedMedia.content}
              onChange={(e) => setEditedMedia({ ...editedMedia, content: e.target.value })}
              className="bg-white border-orange-200"
            />
          </div>
        </div>

        <div>
          <Label className="text-orange-700 font-semibold">Description</Label>
          <Textarea
            value={editedMedia.description}
            onChange={(e) => setEditedMedia({ ...editedMedia, description: e.target.value })}
            className="bg-white border-orange-200"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-orange-700 font-semibold">Type</Label>
            <Select value={editedMedia.type} onValueChange={(value) => setEditedMedia({ ...editedMedia, type: value as any })}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mediaTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-orange-700 font-semibold">Subject</Label>
            <Select value={editedMedia.subject} onValueChange={(value) => setEditedMedia({ ...editedMedia, subject: value })}>
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
            <Label className="text-orange-700 font-semibold">Category</Label>
            <Select value={editedMedia.category} onValueChange={(value) => setEditedMedia({ ...editedMedia, category: value })}>
              <SelectTrigger className="bg-white">
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
            <Label className="text-orange-700 font-semibold">Difficulty</Label>
            <Select value={editedMedia.difficulty} onValueChange={(value) => setEditedMedia({ ...editedMedia, difficulty: value as any })}>
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
        </div>

        <div>
          <Label className="text-orange-700 font-semibold">Tags</Label>
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
            {editedMedia.tags.map((tag, index) => (
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
