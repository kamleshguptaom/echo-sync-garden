import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Trophy, Target, Brain, Book, Gamepad2, Calculator, Palette, Zap, Eye, Music, Puzzle, Code, Globe, History, Languages, Atom, Car, Users, Mountain, Crosshair } from 'lucide-react';

interface GameHubProps {
  onGameSelect: (gameId: string) => void;
}

interface Game {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: string;
  estimatedTime: string;
  skills: string[];
}

export const GameHub: React.FC<GameHubProps> = ({ onGameSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortOption, setSortOption] = useState('popularity');
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);

  const games = [
    // Cognitive & Brain Training
    { 
      id: 'memory-game', 
      title: '🧠 Memory Game', 
      category: 'cognitive', 
      description: 'Test and improve your memory skills',
      icon: Brain,
      difficulty: 'Medium',
      estimatedTime: '5-10 min',
      skills: ['Memory', 'Concentration', 'Pattern Recognition']
    },
    { 
      id: 'visual-perception', 
      title: '👁️ Visual Perception Training', 
      category: 'cognitive', 
      description: 'Enhance visual processing and pattern recognition',
      icon: Eye,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Visual Processing', 'Pattern Recognition', 'Attention']
    },
    { 
      id: 'concentration-game', 
      title: '🎯 Concentration Challenge', 
      category: 'cognitive', 
      description: 'Improve focus and cognitive control',
      icon: Target,
      difficulty: 'Hard',
      estimatedTime: '8-12 min',
      skills: ['Focus', 'Cognitive Control', 'Reaction Time']
    },
    { 
      id: 'pattern-game', 
      title: '🔍 Pattern Recognition', 
      category: 'cognitive', 
      description: 'Identify and complete complex patterns',
      icon: Puzzle,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Pattern Recognition', 'Logic', 'Analysis']
    },
    { 
      id: 'attention-training', 
      title: '⚡ Attention Training', 
      category: 'cognitive', 
      description: 'Enhance focus and selective attention',
      icon: Zap,
      difficulty: 'Medium',
      estimatedTime: '8-12 min',
      skills: ['Attention', 'Focus', 'Processing Speed']
    },

    // Math & Logic Games
    { 
      id: 'math-game', 
      title: '🔢 Math Challenge', 
      category: 'math', 
      description: 'Solve math problems at your level',
      icon: Calculator,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Arithmetic', 'Problem Solving', 'Speed']
    },
    { 
      id: 'algebra-game', 
      title: '📊 Algebra Quest', 
      category: 'math', 
      description: 'Master algebraic equations and concepts',
      icon: Calculator,
      difficulty: 'Hard',
      estimatedTime: '15-20 min',
      skills: ['Algebra', 'Equations', 'Mathematical Reasoning']
    },
    { 
      id: 'geometry-game', 
      title: '📐 Geometry Challenge', 
      category: 'math', 
      description: 'Explore shapes, angles, and spatial reasoning',
      icon: Calculator,
      difficulty: 'Hard',
      estimatedTime: '15-20 min',
      skills: ['Geometry', 'Spatial Reasoning', 'Visualization']
    },
    { 
      id: 'fraction-game', 
      title: '🍕 Fraction Master', 
      category: 'math', 
      description: 'Learn fractions through visual exercises',
      icon: Calculator,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Fractions', 'Visual Math', 'Number Sense']
    },
    { 
      id: 'logic-game', 
      title: '🧩 Logic Challenge', 
      category: 'logic', 
      description: 'Solve logical puzzles and reasoning problems',
      icon: Puzzle,
      difficulty: 'Hard',
      estimatedTime: '15-20 min',
      skills: ['Logic', 'Deduction', 'Critical Thinking']
    },
    { 
      id: 'critical-thinking', 
      title: '🤔 Critical Thinking', 
      category: 'logic', 
      description: 'Develop analytical and critical thinking skills',
      icon: Brain,
      difficulty: 'Hard',
      estimatedTime: '15-25 min',
      skills: ['Analysis', 'Evaluation', 'Reasoning']
    },
    { 
      id: 'number-sequence', 
      title: '🔢 Number Patterns', 
      category: 'math', 
      description: 'Identify and complete number sequences',
      icon: Calculator,
      difficulty: 'Medium',
      estimatedTime: '8-12 min',
      skills: ['Pattern Recognition', 'Number Sense', 'Logic']
    },
    { 
      id: 'math-racing', 
      title: '🏎️ Math Racing', 
      category: 'math', 
      description: 'Fast-paced math problem solving race',
      icon: Zap,
      difficulty: 'Medium',
      estimatedTime: '5-10 min',
      skills: ['Speed Math', 'Quick Thinking', 'Accuracy']
    },

    // Language & Communication
    { 
      id: 'word-game', 
      title: '📝 Word Masters', 
      category: 'language', 
      description: 'Expand vocabulary and language skills',
      icon: Book,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Vocabulary', 'Language', 'Word Recognition']
    },
    { 
      id: 'grammar-game', 
      title: '✏️ Grammar Master', 
      category: 'language', 
      description: 'Perfect your grammar and sentence structure',
      icon: Languages,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Grammar', 'Language Rules', 'Writing']
    },
    { 
      id: 'speed-reading', 
      title: '⚡ Speed Reading', 
      category: 'language', 
      description: 'Improve reading speed and comprehension',
      icon: Book,
      difficulty: 'Medium',
      estimatedTime: '15-20 min',
      skills: ['Reading Speed', 'Comprehension', 'Focus']
    },
    { 
      id: 'story-book', 
      title: '📚 Interactive Stories', 
      category: 'language', 
      description: 'Engage with interactive storytelling',
      icon: Book,
      difficulty: 'Easy',
      estimatedTime: '10-20 min',
      skills: ['Reading', 'Comprehension', 'Imagination']
    },

    // Subject Learning
    { 
      id: 'science-game', 
      title: '🧪 Science Explorer', 
      category: 'science', 
      description: 'Discover scientific concepts through experiments',
      icon: Atom,
      difficulty: 'Medium',
      estimatedTime: '15-20 min',
      skills: ['Science', 'Experimentation', 'Discovery']
    },
    { 
      id: 'history-game', 
      title: '🏛️ History Quest', 
      category: 'social', 
      description: 'Journey through historical events and figures',
      icon: History,
      difficulty: 'Medium',
      estimatedTime: '15-20 min',
      skills: ['History', 'Timeline', 'Cultural Knowledge']
    },
    { 
      id: 'geography-game', 
      title: '🌍 Geography Explorer', 
      category: 'social', 
      description: 'Explore countries, capitals, and landmarks',
      icon: Globe,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Geography', 'World Knowledge', 'Spatial Awareness']
    },
    { 
      id: 'road-safety', 
      title: '🚦 Road Safety Academy', 
      category: 'life-skills', 
      description: 'Learn essential road safety rules and signs',
      icon: Car,
      difficulty: 'Easy',
      estimatedTime: '10-15 min',
      skills: ['Safety', 'Traffic Rules', 'Awareness']
    },

    // Games & Entertainment
    { 
      id: 'tic-tac-toe', 
      title: '⭕ Tic Tac Toe Pro', 
      category: 'strategy', 
      description: 'Classic strategy game with advanced features',
      icon: Users,
      difficulty: 'Easy',
      estimatedTime: '3-8 min',
      skills: ['Strategy', 'Planning', 'Logic']
    },
    { 
      id: 'carrom-game', 
      title: '🎯 Carrom Master', 
      category: 'sports', 
      description: 'Digital carrom board game with realistic physics',
      icon: Target,
      difficulty: 'Medium',
      estimatedTime: '10-20 min',
      skills: ['Precision', 'Physics', 'Strategy']
    },
    { 
      id: 'aiming-game', 
      title: '🏹 Advanced Archery', 
      category: 'sports', 
      description: 'Precision archery and shooting challenges',
      icon: Crosshair,
      difficulty: 'Medium',
      estimatedTime: '8-15 min',
      skills: ['Precision', 'Hand-eye Coordination', 'Focus']
    },

    // Creative & Skills
    { 
      id: 'typing-game', 
      title: '⌨️ Typing Master', 
      category: 'skills', 
      description: 'Improve typing speed and accuracy',
      icon: Gamepad2,
      difficulty: 'Medium',
      estimatedTime: '10-15 min',
      skills: ['Typing', 'Speed', 'Accuracy']
    },
    { 
      id: 'coding-game', 
      title: '💻 Coding Adventure', 
      category: 'technology', 
      description: 'Learn programming concepts through games',
      icon: Code,
      difficulty: 'Hard',
      estimatedTime: '20-30 min',
      skills: ['Programming', 'Logic', 'Problem Solving']
    },
    { 
      id: 'drawing-game', 
      title: '🎨 Creative Drawing', 
      category: 'creative', 
      description: 'Express creativity through digital drawing',
      icon: Palette,
      difficulty: 'Easy',
      estimatedTime: '15-30 min',
      skills: ['Creativity', 'Art', 'Expression']
    }
  ];

  const filteredGames = games.filter(game => {
    const searchMatch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || game.category === categoryFilter;
    const difficultyMatch = difficultyFilter === 'all' || game.difficulty === difficultyFilter;
    return searchMatch && categoryMatch && difficultyMatch;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortOption === 'name') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
    } else {
      // Popularity (Placeholder - Replace with actual popularity metric)
      return Math.random() - 0.5;
    }
  });

  const handleGameSelect = (gameId: string) => {
    onGameSelect(gameId);
    addToRecentlyPlayed(gameId);
  };

  const addToRecentlyPlayed = (gameId: string) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(id => id !== gameId);
      return [gameId, ...filtered].slice(0, 4); // Keep only 4 unique games
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive': return <Brain className="mr-2 h-4 w-4" />;
      case 'math': return <Calculator className="mr-2 h-4 w-4" />;
      case 'language': return <Book className="mr-2 h-4 w-4" />;
      case 'science': return <Atom className="mr-2 h-4 w-4" />;
      case 'social': return <Globe className="mr-2 h-4 w-4" />;
      case 'life-skills': return <Car className="mr-2 h-4 w-4" />;
      case 'strategy': return <Users className="mr-2 h-4 w-4" />;
      case 'sports': return <Mountain className="mr-2 h-4 w-4" />;
      case 'skills': return <Gamepad2 className="mr-2 h-4 w-4" />;
      case 'technology': return <Code className="mr-2 h-4 w-4" />;
      case 'creative': return <Palette className="mr-2 h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🧠 Brain Training Games</h1>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/90"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 rounded bg-white/90 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="cognitive">Cognitive</option>
              <option value="math">Math</option>
              <option value="language">Language</option>
              <option value="science">Science</option>
              <option value="social">Social</option>
              <option value="life-skills">Life Skills</option>
              <option value="strategy">Strategy</option>
              <option value="sports">Sports</option>
              <option value="skills">Skills</option>
              <option value="technology">Technology</option>
              <option value="creative">Creative</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="p-2 rounded bg-white/90 text-sm"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Recently Played Games */}
        {recentlyPlayed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              <History className="inline-block mr-2 h-5 w-5" /> Recently Played
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyPlayed.map(gameId => {
                const game = games.find(g => g.id === gameId);
                return game ? (
                  <Card key={game.id} className="bg-white/95 hover:scale-105 transition-transform">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">{game.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => handleGameSelect(game.id)} className="w-full">
                        Play Again
                      </Button>
                    </CardContent>
                  </Card>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Game Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGames.map((game) => (
            <Card key={game.id} className="bg-white/95 hover:scale-105 transition-transform">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  {getCategoryIcon(game.category)}
                  {game.title}
                </CardTitle>
                <Trophy className="text-yellow-500 h-5 w-5" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {game.estimatedTime}
                  </div>
                  <div>Difficulty: {game.difficulty}</div>
                </div>
                <Button onClick={() => handleGameSelect(game.id)} className="mt-4 w-full">
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
