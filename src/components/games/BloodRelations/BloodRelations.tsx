
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface BloodRelationsProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type RelationType = 'basic_family' | 'extended_family' | 'complex_relations' | 'mixed';

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female';
  x: number;
  y: number;
  generation: number;
}

interface Relation {
  from: string;
  to: string;
  type: 'parent' | 'spouse' | 'sibling';
}

interface Question {
  id: number;
  difficulty: Difficulty;
  type: RelationType;
  statement: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
  familyTree: {
    persons: Person[];
    relations: Relation[];
  };
  hint: string;
  externalLinks: { title: string; url: string }[];
}

export const BloodRelations: React.FC<BloodRelationsProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [relationType, setRelationType] = useState<RelationType>('basic_family');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      difficulty: 'easy',
      type: 'basic_family',
      statement: 'A is the father of B. B is the father of C.',
      question: 'What is the relation of A to C?',
      options: ['Father', 'Grandfather', 'Uncle', 'Brother'],
      correctAnswer: 1,
      explanation: 'A is B\'s father, and B is C\'s father. This makes A the grandfather of C (father of the father).',
      concept: 'Direct Lineage - Grandfather Relationship',
      familyTree: {
        persons: [
          { id: 'A', name: 'A', gender: 'male', x: 200, y: 50, generation: 1 },
          { id: 'B', name: 'B', gender: 'male', x: 200, y: 150, generation: 2 },
          { id: 'C', name: 'C', gender: 'male', x: 200, y: 250, generation: 3 }
        ],
        relations: [
          { from: 'A', to: 'B', type: 'parent' },
          { from: 'B', to: 'C', type: 'parent' }
        ]
      },
      hint: 'Think about the generations: A → B → C',
      externalLinks: [
        { title: 'Family Relationships', url: 'https://en.wikipedia.org/wiki/Family' },
        { title: 'Genealogy Basics', url: 'https://en.wikipedia.org/wiki/Genealogy' }
      ]
    },
    {
      id: 2,
      difficulty: 'easy',
      type: 'basic_family',
      statement: 'P is the sister of Q. R is the mother of Q.',
      question: 'What is the relation of P to R?',
      options: ['Aunt', 'Niece', 'Daughter', 'Mother'],
      correctAnswer: 2,
      explanation: 'P is Q\'s sister, and R is Q\'s mother. This makes P also the daughter of R.',
      concept: 'Sibling Relationships - Shared Parents',
      familyTree: {
        persons: [
          { id: 'R', name: 'R', gender: 'female', x: 200, y: 50, generation: 1 },
          { id: 'P', name: 'P', gender: 'female', x: 150, y: 150, generation: 2 },
          { id: 'Q', name: 'Q', gender: 'male', x: 250, y: 150, generation: 2 }
        ],
        relations: [
          { from: 'R', to: 'P', type: 'parent' },
          { from: 'R', to: 'Q', type: 'parent' },
          { from: 'P', to: 'Q', type: 'sibling' }
        ]
      },
      hint: 'If P and Q are siblings, they share the same parents',
      externalLinks: [
        { title: 'Family Types', url: 'https://en.wikipedia.org/wiki/Family#Types' },
        { title: 'Sibling Relationships', url: 'https://en.wikipedia.org/wiki/Sibling' }
      ]
    },
    {
      id: 3,
      difficulty: 'medium',
      type: 'basic_family',
      statement: 'J is the son of K. K is the husband of L. L has a daughter M.',
      question: 'What is the relation of J to M?',
      options: ['Brother', 'Sister', 'Cousin', 'Uncle'],
      correctAnswer: 0,
      explanation: 'J is K\'s son. K is married to L, making L J\'s mother. M is L\'s daughter, so M is J\'s sister.',
      concept: 'Nuclear Family Relations',
      familyTree: {
        persons: [
          { id: 'K', name: 'K', gender: 'male', x: 150, y: 50, generation: 1 },
          { id: 'L', name: 'L', gender: 'female', x: 250, y: 50, generation: 1 },
          { id: 'J', name: 'J', gender: 'male', x: 150, y: 150, generation: 2 },
          { id: 'M', name: 'M', gender: 'female', x: 250, y: 150, generation: 2 }
        ],
        relations: [
          { from: 'K', to: 'L', type: 'spouse' },
          { from: 'K', to: 'J', type: 'parent' },
          { from: 'L', to: 'M', type: 'parent' },
          { from: 'L', to: 'J', type: 'parent' },
          { from: 'J', to: 'M', type: 'sibling' }
        ]
      },
      hint: 'K and L are parents to their children',
      externalLinks: [
        { title: 'Family Structures', url: 'https://en.wikipedia.org/wiki/Nuclear_family' }
      ]
    },
    {
      id: 4,
      difficulty: 'medium',
      type: 'extended_family',
      statement: 'A and B are married. C is A\'s sister. D is B\'s brother. E is C\'s daughter. F is D\'s son.',
      question: 'What is the relation of E to F?',
      options: ['Brother', 'Sister', 'Cousin', 'Nephew'],
      correctAnswer: 2,
      explanation: 'E is the daughter of C, who is A\'s sister. F is the son of D, who is B\'s brother. A and B are married. This makes E and F cousins.',
      concept: 'Extended Family - Cousin Relationships',
      familyTree: {
        persons: [
          { id: 'C', name: 'C', gender: 'female', x: 100, y: 50, generation: 1 },
          { id: 'A', name: 'A', gender: 'female', x: 200, y: 50, generation: 1 },
          { id: 'B', name: 'B', gender: 'male', x: 300, y: 50, generation: 1 },
          { id: 'D', name: 'D', gender: 'male', x: 400, y: 50, generation: 1 },
          { id: 'E', name: 'E', gender: 'female', x: 100, y: 150, generation: 2 },
          { id: 'F', name: 'F', gender: 'male', x: 400, y: 150, generation: 2 }
        ],
        relations: [
          { from: 'A', to: 'B', type: 'spouse' },
          { from: 'A', to: 'C', type: 'sibling' },
          { from: 'B', to: 'D', type: 'sibling' },
          { from: 'C', to: 'E', type: 'parent' },
          { from: 'D', to: 'F', type: 'parent' }
        ]
      },
      hint: 'Children of siblings are cousins to each other',
      externalLinks: [
        { title: 'Cousin Relationships', url: 'https://en.wikipedia.org/wiki/Cousin' },
        { title: 'Extended Family', url: 'https://en.wikipedia.org/wiki/Extended_family' }
      ]
    },
    {
      id: 5,
      difficulty: 'hard',
      type: 'complex_relations',
      statement: 'A is the brother of B. B is the daughter of C. D is the husband of C. E is the father of D.',
      question: 'How is A related to E?',
      options: ['Grandson', 'Granddaughter', 'Son-in-law', 'Grandfather'],
      correctAnswer: 0,
      explanation: 'A is B\'s brother, so A is male. B is C\'s daughter. C is married to D. E is D\'s father. So E is A\'s grandfather.',
      concept: 'Multi-generational Relationships',
      familyTree: {
        persons: [
          { id: 'E', name: 'E', gender: 'male', x: 300, y: 50, generation: 1 },
          { id: 'C', name: 'C', gender: 'female', x: 200, y: 150, generation: 2 },
          { id: 'D', name: 'D', gender: 'male', x: 300, y: 150, generation: 2 },
          { id: 'A', name: 'A', gender: 'male', x: 150, y: 250, generation: 3 },
          { id: 'B', name: 'B', gender: 'female', x: 250, y: 250, generation: 3 }
        ],
        relations: [
          { from: 'E', to: 'D', type: 'parent' },
          { from: 'C', to: 'D', type: 'spouse' },
          { from: 'C', to: 'A', type: 'parent' },
          { from: 'C', to: 'B', type: 'parent' },
          { from: 'A', to: 'B', type: 'sibling' }
        ]
      },
      hint: 'Trace the relationship by working backward from A',
      externalLinks: [
        { title: 'Generational Relationships', url: 'https://en.wikipedia.org/wiki/Generation' }
      ]
    },
    {
      id: 6,
      difficulty: 'hard',
      type: 'complex_relations',
      statement: 'X is Y\'s father\'s nephew. Z is Y\'s grandfather. W is Z\'s only son.',
      question: 'How is X related to W?',
      options: ['Brother', 'Son', 'Nephew', 'Cousin'],
      correctAnswer: 3,
      explanation: 'Z is Y\'s grandfather, and W is Z\'s only son. This means W is Y\'s father. X is Y\'s father\'s nephew, which means X is W\'s nephew. Since W is X\'s uncle, X is W\'s nephew.',
      concept: 'Uncle-Nephew Relationship',
      familyTree: {
        persons: [
          { id: 'Z', name: 'Z', gender: 'male', x: 250, y: 50, generation: 1 },
          { id: 'W', name: 'W', gender: 'male', x: 200, y: 150, generation: 2 },
          { id: 'W_Sibling', name: 'W\'s Sibling', gender: 'male', x: 300, y: 150, generation: 2 },
          { id: 'Y', name: 'Y', gender: 'male', x: 200, y: 250, generation: 3 },
          { id: 'X', name: 'X', gender: 'male', x: 300, y: 250, generation: 3 }
        ],
        relations: [
          { from: 'Z', to: 'W', type: 'parent' },
          { from: 'Z', to: 'W_Sibling', type: 'parent' },
          { from: 'W', to: 'Y', type: 'parent' },
          { from: 'W_Sibling', to: 'X', type: 'parent' },
          { from: 'W', to: 'W_Sibling', type: 'sibling' }
        ]
      },
      hint: 'If W is Z\'s only son, what relationship must W have to Y?',
      externalLinks: [
        { title: 'Family Relations', url: 'https://en.wikipedia.org/wiki/Family#Kinship_terminology' }
      ]
    },
    {
      id: 7,
      difficulty: 'expert',
      type: 'complex_relations',
      statement: 'If A + B means A is the mother of B; A - B means A is the father of B; A × B means A is the sister of B; A ÷ B means A is the brother of B; A = B means A is the wife of B, then which of the following means M is the maternal uncle of N?',
      question: 'Which expression represents M is the maternal uncle of N?',
      options: [
        'M × P - N',
        'M ÷ P + N',
        'P + N ÷ M',
        'P + M ÷ N'
      ],
      correctAnswer: 1,
      explanation: 'Maternal uncle means the brother of the mother. M ÷ P means M is the brother of P. P + N means P is the mother of N. Together, M ÷ P + N means M is the brother of P, and P is the mother of N.',
      concept: 'Symbolic Representation of Family Relations',
      familyTree: {
        persons: [
          { id: 'M', name: 'M', gender: 'male', x: 150, y: 150, generation: 2 },
          { id: 'P', name: 'P', gender: 'female', x: 250, y: 150, generation: 2 },
          { id: 'N', name: 'N', gender: 'male', x: 250, y: 250, generation: 3 }
        ],
        relations: [
          { from: 'M', to: 'P', type: 'sibling' },
          { from: 'P', to: 'N', type: 'parent' }
        ]
      },
      hint: 'Maternal refers to mother\'s side, uncle is a male sibling',
      externalLinks: [
        { title: 'Kinship Terminology', url: 'https://en.wikipedia.org/wiki/Kinship#Kinship_terminology' }
      ]
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      generateQuestion();
    }
  }, [gameStarted, relationType, difficulty]);

  const generateQuestion = () => {
    const filteredQuestions = questions.filter(q => 
      (relationType === 'mixed' || q.type === relationType) && 
      (q.difficulty === difficulty)
    );
    
    if (filteredQuestions.length === 0) {
      // Fallback to any question if no match found
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion(randomQuestion);
    } else {
      const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setCurrentQuestion(randomQuestion);
    }
    
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setTotalQuestions(prev => prev + 1);
    setQuestionsAnswered(prev => prev + 1);
    
    if (answerIndex === currentQuestion?.correctAnswer) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 40;
      // Reduce points by half if hint was used
      const adjustedPoints = showHint ? Math.floor(points / 2) : points;
      setScore(prev => prev + adjustedPoints);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const getAccuracy = () => {
    if (totalQuestions === 0) return 0;
    return Math.round((score / (totalQuestions * 25)) * 100);
  };

  const renderFamilyTree = (tree: Question['familyTree']) => {
    return (
      <div className="relative h-64 border border-gray-200 rounded-lg bg-blue-50 overflow-hidden mb-4">
        {/* Persons */}
        {tree.persons.map(person => (
          <div 
            key={person.id} 
            className={`absolute rounded-full w-12 h-12 flex items-center justify-center border-2 ${
              person.gender === 'male' ? 'bg-blue-100 border-blue-500' : 'bg-pink-100 border-pink-500'
            }`}
            style={{ left: person.x - 24, top: person.y - 24 }}
          >
            <div className="text-lg font-bold">{person.name}</div>
          </div>
        ))}
        
        {/* Relations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {tree.relations.map((relation, idx) => {
            const fromPerson = tree.persons.find(p => p.id === relation.from);
            const toPerson = tree.persons.find(p => p.id === relation.to);
            
            if (!fromPerson || !toPerson) return null;
            
            const strokeColor = relation.type === 'parent' ? '#3B82F6' : 
                               relation.type === 'spouse' ? '#EC4899' : '#10B981';
            
            const strokeWidth = relation.type === 'spouse' ? 3 : 2;
            const strokeDasharray = relation.type === 'sibling' ? '5,5' : undefined;
            
            return (
              <line 
                key={idx}
                x1={fromPerson.x} 
                y1={fromPerson.y} 
                x2={toPerson.x} 
                y2={toPerson.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
              />
            );
          })}
        </svg>
        
        <div className="absolute bottom-1 right-2 text-xs text-gray-500">
          {showAnimation ? 'Animation playing...' : 'Relationship visualization'}
        </div>
      </div>
    );
  };
  
  const [showAnimation, setShowAnimation] = useState(false);
  
  const playAnimation = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };

  const formatType = (type: RelationType) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline" className="bg-white/90">
              ← Back to Hub
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-gray-100">
              ← Previous
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">👪 Blood Relations Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Family Relations & Logic Puzzles</DialogTitle>
                <DialogDescription>Master the complex web of family relationships</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">👪 Blood Relations Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Enhances logical thinking abilities</li>
                      <li>Improves deductive reasoning skills</li>
                      <li>Strengthens relationship visualization</li>
                      <li>Builds crucial aptitude test skills</li>
                      <li>Develops systematic problem-solving</li>
                    </ul>
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">👨‍👩‍👦‍👦</div>
                      <p className="text-sm">Family trees represent complex relationship networks</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🎯 Key Relationships:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Direct Relations:</span> Parent, child, sibling, spouse</div>
                    <div><span className="font-medium">First Degree:</span> Grandparent, uncle, aunt, cousin</div>
                    <div><span className="font-medium">Compound:</span> Brother-in-law, sister-in-law, maternal uncle</div>
                    <div><span className="font-medium">Complex:</span> Multi-generational relationships</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Family" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Family Structure</a>
                    <a href="https://en.wikipedia.org/wiki/Kinship" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Kinship</a>
                    <a href="https://en.wikipedia.org/wiki/Family_tree" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Family Trees</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Game Settings */}
        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Blood Relations Challenge Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Relation Type</label>
                <Select value={relationType} onValueChange={(value) => setRelationType(value as RelationType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic_family">👨‍👩‍👧‍👦 Basic Family</SelectItem>
                    <SelectItem value="extended_family">👨‍👨‍👧‍👧 Extended Family</SelectItem>
                    <SelectItem value="complex_relations">🧩 Complex Relations</SelectItem>
                    <SelectItem value="mixed">🎲 Mixed Relations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {!gameStarted ? (
              <div className="text-center">
                <Button 
                  onClick={() => setGameStarted(true)} 
                  className="bg-purple-500 hover:bg-purple-600 text-lg px-8"
                >
                  Start Blood Relations Challenge
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm">Score</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{streak}</div>
                  <div className="text-sm">Streak</div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getAccuracy()}%</div>
                  <div className="text-sm">Accuracy</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Area */}
        {gameStarted && currentQuestion && (
          <Card className="mb-6 bg-white/95">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{formatType(currentQuestion.type)}</span>
                <span className="text-sm px-3 py-1 bg-purple-100 rounded-full">
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Problem Statement */}
              <div className="text-lg font-medium p-4 bg-blue-50 rounded-lg">
                {currentQuestion.statement}
              </div>
              
              {/* Family Tree Visualization */}
              {renderFamilyTree(currentQuestion.familyTree)}
              
              {/* Animation Control */}
              <div className="flex justify-center">
                <Button 
                  onClick={playAnimation}
                  variant="outline"
                  className="bg-purple-50"
                  disabled={showAnimation}
                >
                  {showAnimation ? '▶️ Playing...' : '▶️ Animate Relationship'}
                </Button>
              </div>

              {/* Question */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
                
                {/* Hint Button */}
                {!showHint && !showExplanation && (
                  <Button 
                    onClick={() => setShowHint(true)}
                    variant="outline"
                    className="mb-4 text-sm"
                  >
                    💡 Show Hint
                  </Button>
                )}
                
                {/* Hint */}
                {showHint && !showExplanation && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4 animate-fade-in">
                    <p className="text-sm italic">Hint: {currentQuestion.hint}</p>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`text-left justify-start p-4 ${
                      selectedAnswer !== null ? 
                        (index === currentQuestion.correctAnswer ? 'bg-green-100 border-green-500' : 
                         index === selectedAnswer && index !== currentQuestion.correctAnswer ? 'bg-red-100 border-red-500' : '') 
                        : 'hover:bg-purple-50'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-blue-50 p-6 rounded-lg animate-fade-in space-y-4">
                  <h4 className="font-bold text-lg">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Not quite right'}
                  </h4>
                  
                  <p className="mb-3">{currentQuestion.explanation}</p>
                  
                  <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                    <h5 className="font-bold mb-1">💡 Concept: {currentQuestion.concept}</h5>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-bold mb-2">🔗 Learn More:</h5>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.externalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <Button 
                      onClick={nextQuestion} 
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Next Question →
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reference Guide */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Blood Relations Reference Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold mb-2">👨‍👩‍👧 Direct Relations</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Father's son</strong> = Brother</li>
                  <li>• <strong>Mother's daughter</strong> = Sister</li>
                  <li>• <strong>Father/Mother's father</strong> = Grandfather</li>
                  <li>• <strong>Father/Mother's mother</strong> = Grandmother</li>
                  <li>• <strong>Son/Daughter's son</strong> = Grandson</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">👨‍👨‍👦‍👦 Extended Relations</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Father/Mother's brother</strong> = Uncle</li>
                  <li>• <strong>Father/Mother's sister</strong> = Aunt</li>
                  <li>• <strong>Uncle/Aunt's son/daughter</strong> = Cousin</li>
                  <li>• <strong>Brother/Sister's son</strong> = Nephew</li>
                  <li>• <strong>Brother/Sister's daughter</strong> = Niece</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Visualize relationships by working step-by-step through family connections!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
