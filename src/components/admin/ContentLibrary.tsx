
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface ContentItem {
  id: string;
  title: string;
  type: 'lesson' | 'tutorial' | 'guide' | 'template';
  category: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dateCreated: string;
  author: string;
  views: number;
  rating: number;
}

export const ContentLibrary: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Getting Started with Tic Tac Toe Strategy',
      type: 'tutorial',
      category: 'strategy',
      content: 'Learn the fundamental strategies for winning at Tic Tac Toe...',
      tags: ['strategy', 'beginner', 'logic'],
      difficulty: 'beginner',
      dateCreated: '2024-01-15',
      author: 'Game Master',
      views: 234,
      rating: 4.5
    },
    {
      id: '2',
      title: 'Advanced Memory Techniques',
      type: 'lesson',
      category: 'memory',
      content: 'Discover advanced techniques to improve your memory...',
      tags: ['memory', 'cognitive', 'advanced'],
      difficulty: 'advanced',
      dateCreated: '2024-01-10',
      author: 'Dr. Brain',
      views: 189,
      rating: 4.8
    }
  ]);

  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    title: '',
    type: 'lesson',
    category: '',
    content: '',
    tags: [],
    difficulty: 'beginner',
    author: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const addContent = () => {
    if (newContent.title && newContent.content) {
      const item: ContentItem = {
        id: Date.now().toString(),
        title: newContent.title,
        type: newContent.type || 'lesson',
        category: newContent.category || 'general',
        content: newContent.content,
        tags: newContent.tags || [],
        difficulty: newContent.difficulty || 'beginner',
        dateCreated: new Date().toISOString().split('T')[0],
        author: newContent.author || 'Anonymous',
        views: 0,
        rating: 0
      };
      
      setContentItems([...contentItems, item]);
      setNewContent({
        title: '',
        type: 'lesson',
        category: '',
        content: '',
        tags: [],
        difficulty: 'beginner',
        author: ''
      });
    }
  };

  const deleteContent = (id: string) => {
    setContentItems(contentItems.filter(item => item.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'tutorial': return '🎥';
      case 'guide': return '📋';
      case 'template': return '📄';
      default: return '📝';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Content Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-white">{contentItems.length}</div>
            <div className="text-white/80 text-sm">Total Content</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-white">{contentItems.filter(c => c.type === 'lesson').length}</div>
            <div className="text-white/80 text-sm">Lessons</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🎥</div>
            <div className="text-2xl font-bold text-white">{contentItems.filter(c => c.type === 'tutorial').length}</div>
            <div className="text-white/80 text-sm">Tutorials</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">👀</div>
            <div className="text-2xl font-bold text-white">{contentItems.reduce((sum, item) => sum + item.views, 0)}</div>
            <div className="text-white/80 text-sm">Total Views</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Content */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">📝 Create New Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Title</Label>
              <Input
                placeholder="Content title..."
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Author</Label>
              <Input
                placeholder="Author name..."
                value={newContent.author}
                onChange={(e) => setNewContent({ ...newContent, author: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Type</Label>
              <Select value={newContent.type} onValueChange={(value) => setNewContent({ ...newContent, type: value as any })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lesson">📚 Lesson</SelectItem>
                  <SelectItem value="tutorial">🎥 Tutorial</SelectItem>
                  <SelectItem value="guide">📋 Guide</SelectItem>
                  <SelectItem value="template">📄 Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Category</Label>
              <Input
                placeholder="Category..."
                value={newContent.category}
                onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Difficulty</Label>
              <Select value={newContent.difficulty} onValueChange={(value) => setNewContent({ ...newContent, difficulty: value as any })}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">🟢 Beginner</SelectItem>
                  <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                  <SelectItem value="advanced">🔴 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white">Content</Label>
            <Textarea
              placeholder="Write your content here..."
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-24"
            />
          </div>

          <Button onClick={addContent} className="bg-blue-500 hover:bg-blue-600 text-white">
            📝 Create Content
          </Button>
        </CardContent>
      </Card>

      {/* Content Library */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">📚 Content Library ({filteredContent.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lesson">Lessons</SelectItem>
                <SelectItem value="tutorial">Tutorials</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredContent.map((item) => (
              <div key={item.id} className="bg-white/20 p-4 rounded-lg border border-white/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <Badge className={`${getDifficultyColor(item.difficulty)} text-white text-xs`}>
                          {item.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">By {item.author} • {item.dateCreated}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      ✏️ Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteContent(item.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm mb-3 line-clamp-2">{item.content}</p>
                
                <div className="flex justify-between items-center text-xs text-white/60">
                  <div className="flex gap-4">
                    <span>👀 {item.views} views</span>
                    <span>⭐ {item.rating}/5</span>
                  </div>
                  <div className="flex gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
