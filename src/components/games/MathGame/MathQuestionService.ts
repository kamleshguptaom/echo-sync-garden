
interface MathConcept {
  emoji: string;
  visual: string;
  explanation: string;
  example: string;
}

interface MathQuestion {
  num1: number;
  num2: number;
  operation: '+' | '-' | '*' | '/';
  answer: number;
  concept: MathConcept;
  topic: string;
}

export class MathQuestionService {
  private concepts = {
    addition: {
      emoji: '➕',
      visual: '🍎🍎 + 🍎 = 🍎🍎🍎',
      explanation: 'Addition means combining numbers together',
      example: 'If you have 2 apples and get 1 more, you have 3 apples!'
    },
    subtraction: {
      emoji: '➖',
      visual: '🍪🍪🍪 - 🍪 = 🍪🍪',
      explanation: 'Subtraction means taking away from a number',
      example: 'If you have 3 cookies and eat 1, you have 2 left!'
    },
    multiplication: {
      emoji: '✖️',
      visual: '🌟🌟 × 3 = 🌟🌟🌟🌟🌟🌟',
      explanation: 'Multiplication is repeated addition',
      example: '2 groups of 3 stars equals 6 stars total!'
    },
    division: {
      emoji: '➗',
      visual: '🍕🍕🍕🍕 ÷ 2 = 🍕🍕 | 🍕🍕',
      explanation: 'Division means splitting into equal groups',
      example: '4 pizza slices shared by 2 people = 2 slices each!'
    }
  };

  private topics = {
    easy: [
      'Basic Addition', 'Simple Subtraction', 'Counting', 'Number Recognition'
    ],
    medium: [
      'Two-digit Addition', 'Borrowing Subtraction', 'Times Tables', 'Word Problems'
    ],
    hard: [
      'Multi-digit Operations', 'Complex Division', 'Mixed Operations', 'Advanced Problems'
    ]
  };

  generateQuestion(difficulty: 'easy' | 'medium' | 'hard'): MathQuestion {
    let num1: number, num2: number, operation: '+' | '-' | '*' | '/', answer: number;
    let concept: MathConcept;
    let topic: string;

    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        topic = this.topics.easy[Math.floor(Math.random() * this.topics.easy.length)];
        break;

      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = ['+', '-', '*'][Math.floor(Math.random() * 3)] as '+' | '-' | '*';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        if (operation === '*') {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
        }
        topic = this.topics.medium[Math.floor(Math.random() * this.topics.medium.length)];
        break;

      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operation = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)] as '+' | '-' | '*' | '/';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        if (operation === '*') {
          num1 = Math.floor(Math.random() * 15) + 1;
          num2 = Math.floor(Math.random() * 15) + 1;
        }
        if (operation === '/') {
          answer = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          num1 = answer * num2;
        }
        topic = this.topics.hard[Math.floor(Math.random() * this.topics.hard.length)];
        break;
    }

    switch (operation) {
      case '+':
        answer = num1 + num2;
        concept = this.concepts.addition;
        break;
      case '-':
        answer = num1 - num2;
        concept = this.concepts.subtraction;
        break;
      case '*':
        answer = num1 * num2;
        concept = this.concepts.multiplication;
        break;
      case '/':
        answer = Math.round(num1 / num2);
        concept = this.concepts.division;
        break;
    }

    return { num1, num2, operation, answer, concept, topic };
  }

  getRandomTip(): string {
    const tips = [
      "💡 Count on your fingers for small numbers!",
      "🔢 Break big numbers into smaller parts!",
      "📊 Draw pictures to visualize the problem!",
      "🎯 Practice makes perfect!",
      "🌟 Check your answer by working backwards!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
}
