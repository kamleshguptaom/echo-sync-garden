
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface MediaItem {
  id: string;
  name: string;
  type: 'emoji' | 'image' | 'animation' | 'video' | 'audio' | 'interactive';
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
}

export const MediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { 
      id: '1', 
      name: 'Victory Trophy', 
      type: 'emoji', 
      content: '🏆', 
      category: 'celebration', 
      description: 'Victory trophy for achievements',
      subject: 'General',
      tags: ['celebration', 'achievement', 'success'],
      difficulty: 'easy',
      educationalValue: 'Positive reinforcement for learning',
      usage: 'Reward systems, completion badges'
    },
    { 
      id: '2', 
      name: 'Thinking Process', 
      type: 'emoji', 
      content: '🤔', 
      category: 'actions', 
      description: 'Thinking face for reflection',
      subject: 'Psychology',
      tags: ['thinking', 'reflection', 'process'],
      difficulty: 'medium',
      educationalValue: 'Encourages critical thinking',
      usage: 'Question prompts, pause moments'
    },
    { 
      id: '3', 
      name: 'Success Bounce', 
      type: 'animation', 
      content: 'animate-bounce', 
      category: 'celebration', 
      description: 'Bounce animation for success',
      subject: 'General',
      tags: ['animation', 'success', 'feedback'],
      difficulty: 'easy',
      educationalValue: 'Visual feedback for correct answers',
      usage: 'Answer feedback, celebrations'
    }
  ]);

  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    name: '',
    type: 'emoji',
    content: '',
    category: '',
    description: '',
    subject: '',
    tags: [],
    difficulty: 'easy',
    educationalValue: '',
    usage: ''
  });

  const [newTag, setNewTag] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const mediaTypes = ['emoji', 'image', 'animation', 'video', 'audio', 'interactive'];
  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Art', 'Music'];
  const categories = ['celebration', 'actions', 'educational', 'feedback', 'navigation', 'decoration'];

  const addMediaItem = () => {
    if (newMedia.name && newMedia.content) {
      const item: MediaItem = {
        id: Date.now().toString(),
        name: newMedia.name,
        type: newMedia.type || 'emoji',
        content: newMedia.content,
        category: newMedia.category || 'general',
        description: newMedia.description || '',
        subject: newMedia.subject || 'General',
        tags: newMedia.tags || [],
        difficulty: newMedia.difficulty || 'easy',
        educationalValue: newMedia.educationalValue || '',
        usage: newMedia.usage || ''
      };
      
      setMediaItems([...mediaItems, item]);
      setNewMedia({
        name: '',
        type: 'emoji',
        content: '',
        category: '',
        description: '',
        subject: '',
        tags: [],
        difficulty: 'easy',
        educationalValue: '',
        usage: ''
      });
    }
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !newMedia.tags?.includes(newTag.trim())) {
      setNewMedia({ 
        ...newMedia, 
        tags: [...(newMedia.tags || []), newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewMedia({ 
      ...newMedia, 
      tags: newMedia.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const getPreview = (item: MediaItem) => {
    switch (item.type) {
      case 'emoji':
        return <span className="text-4xl animate-pulse">{item.content}</span>;
      case 'animation':
        return <div className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg ${item.content} flex items-center justify-center text-white font-bold`}>A</div>;
      case 'image':
        return <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">IMG</div>;
      case 'video':
        return <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center text-white">🎥</div>;
      case 'audio':
        return <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white">🎵</div>;
      case 'interactive':
        return <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white">⚡</div>;
      default:
        return <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center text-white">?</div>;
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const typeMatch = filterType === 'all' || item.type === filterType;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Add New Media Form */}
      <Card className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md border-2 border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
            🎨 Create Media Content
            <span className="text-lg">✨</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold">Media Name</Label>
                <Input
                  placeholder="Enter media name..."
                  value={newMedia.name}
                  onChange={(e) => setNewMedia({ ...newMedia, name: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Label className="text-white font-semibold">Content</Label>
                <Input
                  placeholder={
                    newMedia.type === 'emoji' ? '🎉' :
                    newMedia.type === 'image' ? 'https://example.com/image.png' :
                    newMedia.type === 'animation' ? 'animate-bounce' :
                    newMedia.type === 'video' ? 'https://example.com/video.mp4' :
                    newMedia.type === 'audio' ? 'https://example.com/audio.mp3' :
                    'interactive-element-id'
                  }
                  value={newMedia.content}
                  onChange={(e) => setNewMedia({ ...newMedia, content: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Label className="text-white font-semibold">Description</Label>
                <Textarea
                  placeholder="Describe the media and its purpose..."
                  value={newMedia.description}
                  onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold">Educational Value</Label>
                <Textarea
                  placeholder="How does this media enhance learning?"
                  value={newMedia.educationalValue}
                  onChange={(e) => setNewMedia({ ...newMedia, educationalValue: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Label className="text-white font-semibold">Usage Guidelines</Label>
                <Textarea
                  placeholder="When and how to use this media..."
                  value={newMedia.usage}
                  onChange={(e) => setNewMedia({ ...newMedia, usage: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-white font-semibold">Type</Label>
              <Select value={newMedia.type} onValueChange={(value) => setNewMedia({ ...newMedia, type: value as any })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
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
              <Label className="text-white font-semibold">Subject</Label>
              <Select value={newMedia.subject} onValueChange={(value) => setNewMedia({ ...newMedia, subject: value })}>
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
              <Label className="text-white font-semibold">Category</Label>
              <Select value={newMedia.category} onValueChange={(value) => setNewMedia({ ...newMedia, category: value })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
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
              <Label className="text-white font-semibold">Difficulty</Label>
              <Select value={newMedia.difficulty} onValueChange={(value) => setNewMedia({ ...newMedia, difficulty: value as any })}>
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
              {newMedia.tags?.map((tag, index) => (
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

          <Button onClick={addMediaItem} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg">
            🎨 Add Media
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Media Library */}
      <Card className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md border-2 border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-bold flex justify-between items-center">
            📁 Media Library ({filteredItems.length} items)
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {mediaTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-white/20 to-white/10 p-5 rounded-xl border-2 border-white/30 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getPreview(item)}
                    <div>
                      <h3 className="text-white font-bold text-sm">{item.name}</h3>
                      <div className="flex gap-1 mt-1">
                        <Badge className={`text-xs ${
                          item.difficulty === 'easy' ? 'bg-green-500' :
                          item.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {item.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteMediaItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1"
                  >
                    🗑️
                  </Button>
                </div>
                
                <p className="text-white/90 text-xs mb-2">{item.description}</p>
                
                {item.educationalValue && (
                  <div className="bg-blue-500/20 p-2 rounded-lg mb-2">
                    <p className="text-white/90 text-xs"><strong>Educational:</strong> {item.educationalValue}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                    {item.subject}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <code className="text-white/80 text-xs bg-black/20 px-2 py-1 rounded block truncate">
                  {item.content}
                </code>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
