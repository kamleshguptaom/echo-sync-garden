
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface GrammarGameProps {
  onBack: () => void;
}

type GrammarTopic = 'sentence_framing' | 'active_passive' | 'direct_indirect' | 'figures_of_speech' | 'tenses' | 'punctuation' | 'mixed';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Question {
  id: number;
  topic: GrammarTopic;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
  example: string;
  animation?: string;
  externalLinks: { title: string; url: string }[];
}

export const GrammarGame: React.FC<GrammarGameProps> = ({ onBack }) => {
  const [topic, setTopic] = useState<GrammarTopic>('sentence_framing');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const questions: Question[] = [
    // Sentence Framing
    {
      id: 1,
      topic: 'sentence_framing',
      difficulty: 'easy',
      question: 'Arrange the words to form a correct sentence: "beautiful / The / garden / is / very"',
      options: [
        'The garden is very beautiful',
        'Beautiful the garden is very',
        'Very beautiful the garden is',
        'Garden the very is beautiful'
      ],
      correctAnswer: 0,
      explanation: 'In English, the standard word order is Subject + Verb + Complement. "The garden" (subject) + "is" (verb) + "very beautiful" (complement).',
      concept: 'Word Order in English Sentences',
      example: 'Subject + Verb + Object/Complement: "The cat (S) sits (V) on the mat (O)"',
      animation: '📝➡️📖',
      externalLinks: [
        { title: 'English Sentence Structure', url: 'https://en.wikipedia.org/wiki/English_grammar#Sentence_structure' },
        { title: 'Word Order Rules', url: 'https://www.grammarly.com/blog/sentence-structure/' }
      ]
    },
    {
      id: 2,
      topic: 'sentence_framing',
      difficulty: 'medium',
      question: 'Which sentence follows the correct subject-verb agreement?',
      options: [
        'The team are playing well',
        'The team is playing well',
        'The team were playing well',
        'The team have playing well'
      ],
      correctAnswer: 1,
      explanation: 'Collective nouns like "team" are usually treated as singular in American English, so they take singular verbs like "is".',
      concept: 'Subject-Verb Agreement',
      example: 'Singular: "The team is winning" vs Plural: "The players are winning"',
      animation: '👥=1️⃣',
      externalLinks: [
        { title: 'Subject-Verb Agreement', url: 'https://en.wikipedia.org/wiki/Agreement_(linguistics)' }
      ]
    },

    // Active-Passive Voice
    {
      id: 3,
      topic: 'active_passive',
      difficulty: 'easy',
      question: 'Convert to passive voice: "The chef cooks the meal"',
      options: [
        'The meal is cooked by the chef',
        'The meal was cooked by the chef',
        'The meal cooks by the chef',
        'The chef is cooking the meal'
      ],
      correctAnswer: 0,
      explanation: 'In passive voice, the object becomes the subject. Format: Object + be + past participle + by + subject.',
      concept: 'Active vs Passive Voice',
      example: 'Active: "Tom writes letters" → Passive: "Letters are written by Tom"',
      animation: '🔄➡️🔁',
      externalLinks: [
        { title: 'Active and Passive Voice', url: 'https://en.wikipedia.org/wiki/English_passive_voice' }
      ]
    },
    {
      id: 4,
      topic: 'active_passive',
      difficulty: 'hard',
      question: 'Which sentence is in passive voice?',
      options: [
        'The students completed the project',
        'The project was completed by the students',
        'The students are completing the project',
        'The students will complete the project'
      ],
      correctAnswer: 1,
      explanation: 'Passive voice uses "be + past participle" structure. The focus is on the action recipient rather than the doer.',
      concept: 'Identifying Passive Construction',
      example: 'Passive indicators: was/were/is/are + past participle + (by + agent)',
      animation: '🎯📋',
      externalLinks: [
        { title: 'Passive Voice Rules', url: 'https://www.grammarly.com/blog/passive-voice/' }
      ]
    },

    // Direct-Indirect Speech
    {
      id: 5,
      topic: 'direct_indirect',
      difficulty: 'easy',
      question: 'Convert to indirect speech: She said, "I am happy."',
      options: [
        'She said that I am happy',
        'She said that she was happy',
        'She said that she is happy',
        'She said I was happy'
      ],
      correctAnswer: 1,
      explanation: 'In indirect speech: 1st person changes to 3rd person, present tense changes to past tense, and quotation marks are removed.',
      concept: 'Direct and Indirect Speech Rules',
      example: 'Direct: He said, "I work here" → Indirect: He said that he worked there',
      animation: '💬➡️📝',
      externalLinks: [
        { title: 'Reported Speech', url: 'https://en.wikipedia.org/wiki/Reported_speech' }
      ]
    },
    {
      id: 6,
      topic: 'direct_indirect',
      difficulty: 'medium',
      question: 'Convert to direct speech: He told me that he would come tomorrow.',
      options: [
        'He said, "I will come tomorrow"',
        'He said, "I would come tomorrow"',
        'He said, "He will come tomorrow"',
        'He said, "I will come today"'
      ],
      correctAnswer: 0,
      explanation: '"Would" in indirect speech usually comes from "will" in direct speech. The time reference may need adjustment.',
      concept: 'Converting Indirect to Direct Speech',
      example: 'Modal verb changes: will→would, can→could, may→might',
      animation: '📝➡️💬',
      externalLinks: [
        { title: 'Speech Conversion Rules', url: 'https://www.grammarly.com/blog/a-complete-guide-to-indirect-speech/' }
      ]
    },

    // Figures of Speech
    {
      id: 7,
      topic: 'figures_of_speech',
      difficulty: 'easy',
      question: 'Identify the figure of speech: "The stars danced in the sky"',
      options: [
        'Metaphor',
        'Simile',
        'Personification',
        'Alliteration'
      ],
      correctAnswer: 2,
      explanation: 'Personification gives human qualities (dancing) to non-human things (stars). Stars cannot literally dance.',
      concept: 'Personification',
      example: 'Other examples: "The wind whispered", "Time crawls", "The sun smiled"',
      animation: '⭐💃',
      externalLinks: [
        { title: 'Figures of Speech', url: 'https://en.wikipedia.org/wiki/Figure_of_speech' },
        { title: 'Personification Examples', url: 'https://literarydevices.net/personification/' }
      ]
    },
    {
      id: 8,
      topic: 'figures_of_speech',
      difficulty: 'medium',
      question: 'What figure of speech is used in: "Life is a roller coaster"?',
      options: [
        'Simile',
        'Metaphor',
        'Hyperbole',
        'Oxymoron'
      ],
      correctAnswer: 1,
      explanation: 'A metaphor directly compares two different things without using "like" or "as". Life is being compared to a roller coaster.',
      concept: 'Metaphor vs Simile',
      example: 'Metaphor: "Life is a journey" vs Simile: "Life is like a journey"',
      animation: '🎢=🌍',
      externalLinks: [
        { title: 'Metaphor Definition', url: 'https://en.wikipedia.org/wiki/Metaphor' }
      ]
    },

    // Tenses
    {
      id: 9,
      topic: 'tenses',
      difficulty: 'easy',
      question: 'Choose the correct tense: "She _____ to school every day."',
      options: [
        'goes',
        'going',
        'gone',
        'go'
      ],
      correctAnswer: 0,
      explanation: 'For habitual actions (every day), we use simple present tense. Third person singular takes "s" or "es".',
      concept: 'Simple Present Tense',
      example: 'Habitual actions: "I eat breakfast daily", "He works in a bank"',
      animation: '🕐🔄',
      externalLinks: [
        { title: 'English Tenses', url: 'https://en.wikipedia.org/wiki/English_verbs#Tense_and_aspect' }
      ]
    },
    {
      id: 10,
      topic: 'tenses',
      difficulty: 'hard',
      question: 'Which sentence uses the present perfect continuous tense correctly?',
      options: [
        'I am studying for two hours',
        'I have been studying for two hours',
        'I was studying for two hours',
        'I study for two hours'
      ],
      correctAnswer: 1,
      explanation: 'Present perfect continuous: have/has + been + verb-ing. Used for actions that started in the past and continue to the present.',
      concept: 'Present Perfect Continuous Tense',
      example: 'Structure: Subject + have/has + been + verb-ing + time duration',
      animation: '⏰➡️📚',
      externalLinks: [
        { title: 'Perfect Continuous Tenses', url: 'https://www.grammarly.com/blog/present-perfect-continuous-tense/' }
      ]
    },

    // Punctuation
    {
      id: 11,
      topic: 'punctuation',
      difficulty: 'easy',
      question: 'Where should the comma be placed? "Yes I agree with you."',
      options: [
        'Yes, I agree with you.',
        'Yes I, agree with you.',
        'Yes I agree, with you.',
        'Yes I agree with, you.'
      ],
      correctAnswer: 0,
      explanation: 'A comma should be placed after introductory words like "yes", "no", "well", etc.',
      concept: 'Comma Usage Rules',
      example: 'After introductory words: "No, I cannot come", "Well, that is interesting"',
      animation: '✋,',
      externalLinks: [
        { title: 'Comma Rules', url: 'https://en.wikipedia.org/wiki/Comma' }
      ]
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      generateQuestion();
    }
  }, [gameStarted, topic, difficulty]);

  const generateQuestion = () => {
    const filteredQuestions = questions.filter(q => 
      (topic === 'mixed' || q.topic === topic) && 
      q.difficulty === difficulty
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
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setTotalQuestions(prev => prev + 1);
    setQuestionsAnswered(prev => prev + 1);
    
    if (answerIndex === currentQuestion?.correctAnswer) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 40;
      setScore(prev => prev + points);
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

  const formatTopic = (topic: GrammarTopic) => {
    return topic.split('_').map(word => 
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
          <h1 className="text-4xl font-bold text-white">📝 Grammar Master Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Grammar & Language Mastery</DialogTitle>
                <DialogDescription>Master the building blocks of effective communication</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">📝 Grammar Learning Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Improves written and spoken communication</li>
                      <li>Enhances professional credibility</li>
                      <li>Develops critical thinking about language</li>
                      <li>Builds confidence in expression</li>
                      <li>Supports academic and career success</li>
                    </ul>
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">📚➡️💭➡️📝</div>
                      <p className="text-sm">Grammar transforms thoughts into clear communication</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🎯 Grammar Topics Covered:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Sentence Structure:</span> Building clear, correct sentences</div>
                    <div><span className="font-medium">Voice:</span> Active vs passive construction</div>
                    <div><span className="font-medium">Speech:</span> Direct and indirect reporting</div>
                    <div><span className="font-medium">Figures:</span> Metaphors, similes, personification</div>
                    <div><span className="font-medium">Tenses:</span> Time relationships in verbs</div>
                    <div><span className="font-medium">Punctuation:</span> Clarity through proper marks</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/English_grammar" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">English Grammar</a>
                    <a href="https://en.wikipedia.org/wiki/Syntax" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Syntax</a>
                    <a href="https://en.wikipedia.org/wiki/Rhetoric" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Rhetoric</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Game Settings */}
        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Grammar Challenge Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Grammar Topic</label>
                <Select value={topic} onValueChange={(value) => setTopic(value as GrammarTopic)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sentence_framing">📝 Sentence Framing</SelectItem>
                    <SelectItem value="active_passive">🔄 Active-Passive Voice</SelectItem>
                    <SelectItem value="direct_indirect">💬 Direct-Indirect Speech</SelectItem>
                    <SelectItem value="figures_of_speech">🎨 Figures of Speech</SelectItem>
                    <SelectItem value="tenses">⏰ Tenses</SelectItem>
                    <SelectItem value="punctuation">📍 Punctuation</SelectItem>
                    <SelectItem value="mixed">🎲 Mixed Topics</SelectItem>
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
                  className="bg-green-500 hover:bg-green-600 text-lg px-8"
                >
                  Start Grammar Challenge
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
                  <div className="text-2xl font-bold text-purple-600">{questionsAnswered}</div>
                  <div className="text-sm">Questions</div>
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
                <span>{formatTopic(currentQuestion.topic)}</span>
                <span className="text-sm px-3 py-1 bg-blue-100 rounded-full">
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="text-center">
                <div className="text-2xl mb-4">{currentQuestion.animation}</div>
                <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
              </div>

              {/* Answer Options */}
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`text-left justify-start p-4 h-auto ${
                      selectedAnswer !== null ? 
                        (index === currentQuestion.correctAnswer ? 'bg-green-100 border-green-500' : 
                         index === selectedAnswer && index !== currentQuestion.correctAnswer ? 'bg-red-100 border-red-500' : '') 
                        : 'hover:bg-blue-50'
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
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{currentQuestion.animation}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">
                        {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Not quite right'}
                      </h4>
                      <p className="mb-3">{currentQuestion.explanation}</p>
                      
                      <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                        <h5 className="font-bold mb-1">💡 Concept: {currentQuestion.concept}</h5>
                        <p className="text-sm text-gray-700 mb-2">{currentQuestion.example}</p>
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
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                              {link.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={nextQuestion} 
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Next Question →
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Grammar Reference */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Grammar Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🏗️ Sentence Structure</h4>
                <p>Subject + Verb + Object</p>
                <p className="text-xs text-gray-600 mt-1">The foundation of clear communication</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🔄 Voice & Speech</h4>
                <p>Active ↔ Passive, Direct ↔ Indirect</p>
                <p className="text-xs text-gray-600 mt-1">Transform meaning and emphasis</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🎨 Style & Figures</h4>
                <p>Metaphors, Similes, Personification</p>
                <p className="text-xs text-gray-600 mt-1">Add creativity and vivid imagery</p>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Master these fundamentals to become a confident communicator!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
