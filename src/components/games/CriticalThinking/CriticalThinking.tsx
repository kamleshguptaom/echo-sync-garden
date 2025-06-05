
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CriticalThinkingProps {
  onBack: () => void;
}

type ChallengeType = 'logical_fallacies' | 'evidence_evaluation' | 'bias_detection' | 'argument_analysis' | 'problem_solving';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Challenge {
  id: number;
  type: ChallengeType;
  difficulty: Difficulty;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const CriticalThinking: React.FC<CriticalThinkingProps> = ({ onBack }) => {
  const [challengeType, setChallengeType] = useState<ChallengeType>('logical_fallacies');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [challengeNumber, setChallengeNumber] = useState(0);

  // Sample challenges database
  const challenges: Challenge[] = [
    {
      id: 1,
      type: 'logical_fallacies',
      difficulty: 'easy',
      scenario: "A politician says: 'My opponent wants to cut the education budget. Clearly, they don't care about our children's future.'",
      question: "What logical fallacy is present in this statement?",
      options: [
        "Ad hominem (attacking the person)",
        "Straw man (misrepresenting opponent's position)",
        "False dilemma (presenting only two options)",
        "Appeal to emotion"
      ],
      correctAnswer: 3,
      explanation: "This is an Appeal to Emotion fallacy. The speaker is trying to win the argument by manipulating emotions rather than using valid reasoning. They're implying that budget cuts automatically mean not caring about children, which is an emotional appeal rather than a logical argument."
    },
    {
      id: 2,
      type: 'evidence_evaluation',
      difficulty: 'easy',
      scenario: "A new weight loss supplement claims: '95% of users lost weight in our study!' The fine print mentions the study had 20 participants who were also on strict diets and exercise plans.",
      question: "What is the main problem with the evidence presented?",
      options: [
        "The sample size is too small for reliable conclusions",
        "There's no control group to compare against",
        "Other factors (diet/exercise) likely caused the weight loss",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "All three issues are present: The sample size (20 people) is too small to make broad claims, there's no mention of a control group to compare against, and most importantly, the participants were also dieting and exercising, which are known ways to lose weight, making it impossible to determine if the supplement had any effect."
    },
    {
      id: 3,
      type: 'bias_detection',
      difficulty: 'medium',
      scenario: "After studying for an exam, Sarah says: 'I studied for five hours and got an A. Studying for five hours must be why I got an A.'",
      question: "What cognitive bias is Sarah demonstrating?",
      options: [
        "Confirmation bias",
        "Availability heuristic",
        "Post hoc fallacy",
        "Anchoring bias"
      ],
      correctAnswer: 2,
      explanation: "Sarah is demonstrating the post hoc fallacy (post hoc ergo propter hoc - 'after this, therefore because of this'). She's assuming that because she studied for five hours (event A) and then got an A (event B), event A must have caused event B. While studying likely helped, many other factors could have contributed to her success, and the specific five-hour duration might not be the magical number."
    },
    {
      id: 4,
      type: 'argument_analysis',
      difficulty: 'medium',
      scenario: "An article states: 'Violent crime rates have increased by 5% this year. We must immediately increase the police budget by 20% to address this urgent crisis.'",
      question: "What is the flaw in this argument?",
      options: [
        "It uses a modest statistic to justify a disproportionate response",
        "It assumes increasing police budget is the only/best solution",
        "It doesn't establish causation between budget and crime rates",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "The argument has multiple flaws: It treats a 5% increase as an 'urgent crisis' warranting a much larger 20% budget increase; it assumes that increasing police budgets is the only or best solution without considering alternatives; and it doesn't provide evidence that police funding levels actually affect crime rates in a direct, proportional way."
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      generateNewChallenge();
    }
  }, [gameStarted, challengeType, difficulty]);

  const generateNewChallenge = () => {
    const filteredChallenges = challenges.filter(
      c => c.type === challengeType && c.difficulty === difficulty
    );
    
    if (filteredChallenges.length > 0) {
      const nextChallenge = filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
      setCurrentChallenge(nextChallenge);
      setSelectedAnswer(null);
      setFeedback(null);
      setShowExplanation(false);
      setChallengeNumber(challengeNumber + 1);
    }
  };

  const checkAnswer = () => {
    if (currentChallenge === null || selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentChallenge.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15));
    }
  };

  const nextChallenge = () => {
    generateNewChallenge();
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setChallengeNumber(0);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🤔 Critical Thinking</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Critical Thinking Skills</DialogTitle>
                <DialogDescription>Develop analytical skills to evaluate claims and make better decisions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">🤔 Critical Thinking Components</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Logical Fallacies:</strong> Recognizing flawed reasoning patterns</li>
                    <li><strong>Evidence Evaluation:</strong> Assessing the quality and relevance of evidence</li>
                    <li><strong>Bias Detection:</strong> Identifying prejudices and cognitive biases</li>
                    <li><strong>Argument Analysis:</strong> Breaking down and evaluating arguments</li>
                    <li><strong>Problem Solving:</strong> Applying analytical thinking to find solutions</li>
                  </ul>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Critical_thinking" target="_blank" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Critical Thinking</a>
                    <a href="https://en.wikipedia.org/wiki/Logical_fallacy" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Logical Fallacies</a>
                    <a href="https://en.wikipedia.org/wiki/Cognitive_bias" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Cognitive Biases</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Critical Thinking Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Challenge Type</label>
                  <Select value={challengeType} onValueChange={(value) => setChallengeType(value as ChallengeType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logical_fallacies">Logical Fallacies</SelectItem>
                      <SelectItem value="evidence_evaluation">Evidence Evaluation</SelectItem>
                      <SelectItem value="bias_detection">Bias Detection</SelectItem>
                      <SelectItem value="argument_analysis">Argument Analysis</SelectItem>
                      <SelectItem value="problem_solving">Problem Solving</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-white/95">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Challenge #{challengeNumber}</span>
                  <span>Score: {score}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentChallenge && (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-lg mb-2">{currentChallenge.scenario}</p>
                      <p className="font-bold">{currentChallenge.question}</p>
                    </div>
                    
                    <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                      {currentChallenge.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={feedback !== null} />
                          <Label htmlFor={`option-${index}`} className="flex-1">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={checkAnswer} 
                        disabled={selectedAnswer === null || feedback !== null}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Check Answer
                      </Button>
                      
                      {feedback && (
                        <Button 
                          onClick={() => setShowExplanation(!showExplanation)} 
                          variant="outline"
                        >
                          {showExplanation ? 'Hide' : 'Show'} Explanation
                        </Button>
                      )}
                      
                      {feedback && (
                        <Button onClick={nextChallenge}>
                          Next Challenge
                        </Button>
                      )}
                    </div>
                    
                    {feedback && (
                      <div className={`p-4 rounded-lg ${feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className="font-bold">
                          {feedback === 'correct' ? 
                            '✅ Correct! Great critical thinking!' : 
                            '❌ Not quite right. Let\'s review the thinking process.'}
                        </p>
                        
                        {showExplanation && (
                          <div className="mt-2">
                            <p className="font-semibold mb-1">Explanation:</p>
                            <p>{currentChallenge.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
