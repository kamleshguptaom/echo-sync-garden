
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

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

interface MediaLibraryProps {
  mediaItems: MediaItem[];
  onDeleteItem: (id: string) => void;
  onEditItem: (item: MediaItem) => void;
  filterType: string;
  filterCategory: string;
  filterSubject: string;
  onFilterTypeChange: (type: string) => void;
  onFilterCategoryChange: (category: string) => void;
  onFilterSubjectChange: (subject: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaItems,
  onDeleteItem,
  onEditItem,
  filterType,
  filterCategory,
  filterSubject,
  onFilterTypeChange,
  onFilterCategoryChange,
  onFilterSubjectChange
}) => {
  const mediaTypes = ['all', 'emoji', 'image', 'animation', 'video', 'audio', 'interactive', '3d-model', 'ar-content', 'vr-content'];
  const subjects = ['all', 'General', 'Mathematics', 'Science', 'English', 'History', 'Art', 'Music'];
  const categories = ['all', 'celebration', 'actions', 'educational', 'feedback', 'navigation', 'decoration', 'interactive', 'assessment', 'tutorial', 'game-element'];

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
      case '3d-model':
        return <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white">🧊</div>;
      case 'ar-content':
        return <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center text-white">🔍</div>;
      case 'vr-content':
        return <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white">🥽</div>;
      default:
        return <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center text-white">?</div>;
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const subjectMatch = filterSubject === 'all' || item.subject === filterSubject;
    return typeMatch && categoryMatch && subjectMatch;
  });

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-t-lg">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-bold">📁 Media Library ({filteredItems.length} items)</span>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={onFilterTypeChange}>
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {mediaTypes.slice(1).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={onFilterSubjectChange}>
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.slice(1).map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-white/80 to-gray-50/80 p-5 rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {getPreview(item)}
                  <div>
                    <h3 className="text-gray-800 font-bold text-sm">{item.name}</h3>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Badge className={`text-xs ${
                        item.difficulty === 'easy' ? 'bg-green-500' :
                        item.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {item.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => onEditItem(item)}
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 px-2 py-1"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => onDeleteItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-700 text-xs mb-2">{item.description}</p>
              
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                  {item.subject}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                  {item.category}
                </Badge>
              </div>
              
              <code className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                {item.content}
              </code>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
