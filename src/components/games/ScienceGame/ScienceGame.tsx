
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ScienceGameProps {
  onBack: () => void;
}

type QuestionType = 'physics' | 'chemistry' | 'biology' | 'earth-science' | 'astronomy' | 'random';
type Difficulty = 'easy' | 'medium' | 'hard';

interface ScienceQuestion {
  type: QuestionType;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  concept: string;
  animation?: string;
  visualAid?: string;
}

const scienceConcepts = {
  physics: "Physics studies matter, energy, and their interactions. Key concepts include force, motion, energy, waves, and electricity.",
  chemistry: "Chemistry studies the composition, structure, and properties of matter. Key concepts include atoms, molecules, reactions, and bonds.",
  biology: "Biology studies living organisms and life processes. Key concepts include cells, genetics, evolution, and ecosystems.",
  'earth-science': "Earth Science studies our planet and its systems. Key concepts include geology, weather, climate, and natural resources.",
  astronomy: "Astronomy studies celestial objects and space. Key concepts include planets, stars, galaxies, and the universe."
};

export const ScienceGame: React.FC<ScienceGameProps> = ({ onBack }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('physics');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<ScienceQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  const questionBank = {
    physics: {
      easy: [
        {
          question: "What force pulls objects toward Earth?",
          options: ["Magnetism", "Gravity", "Friction", "Pressure"],
          correct: 1,
          explanation: "Gravity is the force that attracts objects with mass toward each other. Earth's gravity pulls everything toward its center.",
          concept: "Gravity is a fundamental force that keeps us on the ground and causes objects to fall.",
          animation: "🌍 ➡️ 🍎 (Apple falls toward Earth)",
          visualAid: "F = ma, where gravitational acceleration g ≈ 9.8 m/s²"
        },
        {
          question: "What happens to the speed of sound in warmer air?",
          options: ["It decreases", "It increases", "It stays the same", "It stops"],
          correct: 1,
          explanation: "Sound travels faster in warmer air because the molecules move more quickly and can transmit vibrations faster.",
          concept: "Sound speed depends on the medium's temperature and properties.",
          animation: "🌡️⬆️ = 🔊💨 (Warmer = Faster sound)",
          visualAid: "v = √(γRT/M) where T is temperature"
        },
        {
          question: "Which color of light has the longest wavelength?",
          options: ["Red", "Blue", "Green", "Violet"],
          correct: 0,
          explanation: "Red light has the longest wavelength in the visible spectrum, around 700 nanometers.",
          concept: "Light wavelength determines color - red is longest, violet is shortest.",
          animation: "🔴━━━━━ 🔵━━ 🟣━ (Red longest, violet shortest)",
          visualAid: "λ(red) ≈ 700nm, λ(violet) ≈ 400nm"
        },
        {
          question: "What type of energy does a moving car have?",
          options: ["Potential", "Kinetic", "Chemical", "Nuclear"],
          correct: 1,
          explanation: "A moving car has kinetic energy, which is the energy of motion.",
          concept: "Kinetic energy is the energy an object has due to its motion.",
          animation: "🚗💨 = KE (Moving car has kinetic energy)",
          visualAid: "KE = ½mv² where m is mass, v is velocity"
        },
        {
          question: "What is the unit of force?",
          options: ["Joule", "Newton", "Watt", "Volt"],
          correct: 1,
          explanation: "The Newton (N) is the SI unit of force, named after Sir Isaac Newton.",
          concept: "Force causes acceleration when applied to objects with mass.",
          animation: "📏 F = ma (Force equals mass times acceleration)",
          visualAid: "1 Newton = 1 kg⋅m/s²"
        }
      ],
      medium: [
        {
          question: "What is the unit of electrical resistance?",
          options: ["Volt", "Ampere", "Ohm", "Watt"],
          correct: 2,
          explanation: "The ohm (Ω) is the unit of electrical resistance, named after Georg Simon Ohm who discovered Ohm's law.",
          concept: "Electrical resistance opposes the flow of electric current in a circuit.",
          animation: "⚡ ➡️ 🚧 ➡️ ⚡ (Current faces resistance)",
          visualAid: "V = I × R (Ohm's Law)"
        },
        {
          question: "Which law states that energy cannot be created or destroyed?",
          options: ["Newton's First Law", "Conservation of Energy", "Hooke's Law", "Ohm's Law"],
          correct: 1,
          explanation: "The Law of Conservation of Energy states that energy can only be transformed from one form to another, never created or destroyed.",
          concept: "Energy is conserved in all physical processes.",
          animation: "🔋 ↔️ ⚡ ↔️ 🔥 (Energy transforms, never lost)",
          visualAid: "E₁ + E₂ + ... = constant"
        },
        {
          question: "What is the relationship between frequency and wavelength?",
          options: ["Directly proportional", "Inversely proportional", "No relationship", "Exponentially related"],
          correct: 1,
          explanation: "Frequency and wavelength are inversely proportional - as frequency increases, wavelength decreases.",
          concept: "Wave speed equals frequency times wavelength.",
          animation: "🌊⬆️ = λ⬇️ (Higher frequency = shorter wavelength)",
          visualAid: "c = fλ where c is wave speed"
        }
      ],
      hard: [
        {
          question: "What is the speed of light in a vacuum?",
          options: ["300,000 km/s", "299,792,458 m/s", "186,000 mph", "3×10⁸ m/s"],
          correct: 3,
          explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second, often approximated as 3×10⁸ m/s.",
          concept: "Light speed is a fundamental constant and the maximum speed possible in the universe.",
          animation: "💡━━━━━━━━━━━━━━━━━━━━━━━━➤ (3×10⁸ m/s)",
          visualAid: "c = 299,792,458 m/s (exact definition)"
        },
        {
          question: "What principle explains why airplanes can fly?",
          options: ["Archimedes' Principle", "Bernoulli's Principle", "Pascal's Principle", "Boyle's Law"],
          correct: 1,
          explanation: "Bernoulli's Principle states that faster-moving air has lower pressure, creating lift over airplane wings.",
          concept: "Fluid dynamics and pressure differences create aerodynamic lift.",
          animation: "✈️ ↑ Air flows faster over top → Lower pressure → Lift",
          visualAid: "P + ½ρv² + ρgh = constant"
        }
      ]
    },
    chemistry: {
      easy: [
        {
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correct: 0,
          explanation: "Water is H2O - two hydrogen atoms bonded to one oxygen atom.",
          concept: "Chemical formulas show the types and numbers of atoms in a molecule.",
          animation: "H-H + O = H₂O (Two hydrogens bond with oxygen)",
          visualAid: "H-O-H bond angle: 104.5°"
        },
        {
          question: "What gas do plants absorb during photosynthesis?",
          options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
          correct: 2,
          explanation: "Plants absorb carbon dioxide (CO2) from the air and use it with water and sunlight to make glucose.",
          concept: "Photosynthesis converts CO2 and water into glucose and oxygen using sunlight.",
          animation: "🌱 + CO₂ + ☀️ → 🍃 + O₂ (Plant makes food)",
          visualAid: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂"
        },
        {
          question: "What happens when you mix an acid and a base?",
          options: ["Explosion", "Neutralization", "Evaporation", "Freezing"],
          correct: 1,
          explanation: "When acids and bases mix, they neutralize each other, forming water and a salt.",
          concept: "Acid-base neutralization is a fundamental chemical reaction.",
          animation: "🔴(Acid) + 🔵(Base) → 💧(Water) + 🧂(Salt)",
          visualAid: "HCl + NaOH → H₂O + NaCl"
        },
        {
          question: "How many electrons does a carbon atom have?",
          options: ["4", "6", "8", "12"],
          correct: 1,
          explanation: "Carbon has 6 electrons in its neutral state, which equals its atomic number.",
          concept: "Atomic number determines the number of protons and electrons in a neutral atom.",
          animation: "⚛️ C: 6p⁺ + 6e⁻ (6 protons, 6 electrons)",
          visualAid: "Electron configuration: 1s² 2s² 2p²"
        }
      ],
      medium: [
        {
          question: "What is the pH of pure water at 25°C?",
          options: ["6", "7", "8", "9"],
          correct: 1,
          explanation: "Pure water has a pH of 7, which is neutral - neither acidic nor basic.",
          concept: "pH measures how acidic or basic a solution is, with 7 being neutral.",
          animation: "pH: 0━━━7━━━14 (Acidic ← Neutral → Basic)",
          visualAid: "pH = -log[H⁺] = 7 when [H⁺] = 10⁻⁷ M"
        },
        {
          question: "What type of bond forms between sodium and chlorine?",
          options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
          correct: 1,
          explanation: "Sodium and chlorine form an ionic bond when sodium transfers an electron to chlorine.",
          concept: "Ionic bonds form between metals and nonmetals through electron transfer.",
          animation: "Na⁺ ↔️ Cl⁻ (Electron transfer creates ions)",
          visualAid: "Na → Na⁺ + e⁻; Cl + e⁻ → Cl⁻"
        }
      ],
      hard: [
        {
          question: "What is Avogadro's number approximately?",
          options: ["6.022×10²³", "3.14×10⁸", "9.81×10²", "1.602×10⁻¹⁹"],
          correct: 0,
          explanation: "Avogadro's number (6.022×10²³) is the number of particles in one mole of substance.",
          concept: "A mole is a unit used to count very large numbers of tiny particles like atoms or molecules.",
          animation: "1 mole = 6.022×10²³ particles (🔬🔬🔬...)",
          visualAid: "NA = 6.02214076×10²³ mol⁻¹"
        }
      ]
    },
    biology: {
      easy: [
        {
          question: "What is the basic unit of life?",
          options: ["Tissue", "Organ", "Cell", "Organism"],
          correct: 2,
          explanation: "The cell is the smallest unit that can be considered alive and perform all life functions.",
          concept: "All living things are made of one or more cells, which are the building blocks of life.",
          animation: "🔬 Cell → Tissue → Organ → Organism",
          visualAid: "Cell Theory: All life is made of cells"
        },
        {
          question: "Which organ pumps blood through the body?",
          options: ["Brain", "Lungs", "Heart", "Liver"],
          correct: 2,
          explanation: "The heart is a muscular organ that pumps blood throughout the circulatory system.",
          concept: "The circulatory system transports nutrients, oxygen, and waste throughout the body.",
          animation: "❤️ → 🩸 → 🫁 → 🩸 → ❤️ (Heart pumps blood)",
          visualAid: "Heart rate: ~70 beats/min, ~100,000 beats/day"
        },
        {
          question: "What do plants need to make their own food?",
          options: ["Only water", "Sunlight, water, CO2", "Only sunlight", "Only soil"],
          correct: 1,
          explanation: "Plants need sunlight, water, and carbon dioxide to perform photosynthesis and make glucose.",
          concept: "Photosynthesis is how plants convert light energy into chemical energy.",
          animation: "☀️ + 💧 + CO₂ → 🍃 (Photosynthesis ingredients)",
          visualAid: "Chloroplasts contain chlorophyll for light absorption"
        },
        {
          question: "What controls what enters and exits a cell?",
          options: ["Nucleus", "Cell membrane", "Cytoplasm", "Mitochondria"],
          correct: 1,
          explanation: "The cell membrane is selectively permeable, controlling what substances can enter or leave the cell.",
          concept: "Cell membranes maintain cellular homeostasis through selective permeability.",
          animation: "🧱🚪🧱 Cell membrane acts like a selective gate",
          visualAid: "Phospholipid bilayer with embedded proteins"
        }
      ],
      medium: [
        {
          question: "What process do plants use to make their own food?",
          options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
          correct: 1,
          explanation: "Photosynthesis allows plants to convert sunlight, water, and CO2 into glucose and oxygen.",
          concept: "Photosynthesis is how plants capture and store energy from sunlight.",
          animation: "🌱: 6CO₂ + 6H₂O + ☀️ → C₆H₁₂O₆ + 6O₂",
          visualAid: "Light reactions + Calvin cycle = glucose production"
        },
        {
          question: "What is DNA's primary function?",
          options: ["Energy storage", "Protein synthesis", "Genetic information storage", "Cell structure"],
          correct: 2,
          explanation: "DNA stores genetic information that determines an organism's characteristics and guides protein synthesis.",
          concept: "DNA contains the instructions for building and maintaining living organisms.",
          animation: "🧬 DNA → RNA → Protein (Central Dogma)",
          visualAid: "A-T and G-C base pairing in double helix"
        }
      ],
      hard: [
        {
          question: "How many chromosomes do humans typically have?",
          options: ["23", "44", "46", "48"],
          correct: 2,
          explanation: "Humans typically have 46 chromosomes - 23 pairs, with one chromosome from each parent in each pair.",
          concept: "Chromosomes carry genetic information (DNA) that determines our traits and characteristics.",
          animation: "👨 (23) + 👩 (23) = 👶 (46 chromosomes)",
          visualAid: "22 autosome pairs + 1 sex chromosome pair (XX or XY)"
        }
      ]
    },
    'earth-science': {
      easy: [
        {
          question: "What causes the seasons on Earth?",
          options: ["Distance from Sun", "Earth's tilt", "Moon phases", "Solar flares"],
          correct: 1,
          explanation: "Earth's seasons are caused by the planet's tilt of 23.5 degrees as it orbits the Sun.",
          concept: "Earth's axial tilt causes different regions to receive varying amounts of sunlight throughout the year.",
          animation: "🌍↗️ → ☀️ (Tilt causes seasons)",
          visualAid: "Axial tilt: 23.5° from orbital plane"
        },
        {
          question: "Which layer of Earth is the hottest?",
          options: ["Crust", "Mantle", "Outer core", "Inner core"],
          correct: 3,
          explanation: "The inner core is the hottest layer, reaching temperatures of about 5,700°C (10,300°F).",
          concept: "Earth has four main layers, each with different properties and temperatures.",
          animation: "🌍: Crust → Mantle → Outer Core → 🔥Inner Core🔥",
          visualAid: "Temperature increases ~25°C per km depth"
        },
        {
          question: "What percentage of Earth's surface is covered by water?",
          options: ["50%", "61%", "71%", "83%"],
          correct: 2,
          explanation: "Approximately 71% of Earth's surface is covered by water, mostly in the oceans.",
          concept: "Earth is often called the 'Blue Planet' due to its abundant water.",
          animation: "🌍 = 71% 💧 + 29% 🗻 (Water dominates surface)",
          visualAid: "Oceans hold 97% of Earth's water"
        }
      ],
      medium: [
        {
          question: "What type of rock is formed from cooled magma?",
          options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"],
          correct: 2,
          explanation: "Igneous rocks form when magma or lava cools and solidifies.",
          concept: "The rock cycle shows how rocks transform between igneous, sedimentary, and metamorphic types.",
          animation: "🌋 → 🔥Magma → ❄️Cool → 🗿Igneous Rock",
          visualAid: "Intrusive (slow cooling) vs Extrusive (fast cooling)"
        }
      ],
      hard: [
        {
          question: "What is the main cause of plate tectonic movement?",
          options: ["Wind", "Ocean currents", "Convection in mantle", "Gravity"],
          correct: 2,
          explanation: "Plate tectonics are driven by convection currents in Earth's hot mantle.",
          concept: "Convection in the mantle creates currents that move the crustal plates.",
          animation: "🔥Heat rises → ❄️Cools → 🔄Convection → 🌍Plate movement",
          visualAid: "Mantle temperature: 1000-4000°C drives convection"
        }
      ]
    },
    astronomy: {
      easy: [
        {
          question: "Which planet is closest to the Sun?",
          options: ["Venus", "Mercury", "Earth", "Mars"],
          correct: 1,
          explanation: "Mercury is the closest planet to the Sun, orbiting at an average distance of 58 million kilometers.",
          concept: "The solar system has eight planets in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
          animation: "☀️ → ☿Mercury → ♀Venus → 🌍Earth → ♂Mars...",
          visualAid: "Mercury orbit: 88 Earth days"
        },
        {
          question: "What causes the Moon's phases?",
          options: ["Earth's shadow", "Moon's rotation", "Sun's position", "Clouds"],
          correct: 2,
          explanation: "Moon phases are caused by the changing position of the Sun, Moon, and Earth, which affects how much of the Moon's lit surface we can see.",
          concept: "The Moon reflects sunlight, and we see different amounts of its lit surface as it orbits Earth.",
          animation: "☀️ → 🌙 → 🌍 (Sun lights Moon, we see phases)",
          visualAid: "29.5 day cycle: New → Waxing → Full → Waning"
        },
        {
          question: "How long does it take Earth to orbit the Sun?",
          options: ["24 hours", "1 month", "1 year", "10 years"],
          correct: 2,
          explanation: "Earth takes approximately 365.25 days (1 year) to complete one orbit around the Sun.",
          concept: "Earth's orbital period defines our calendar year.",
          animation: "🌍 🔄 ☀️ (365.25 days for one orbit)",
          visualAid: "Orbital speed: ~30 km/s, Distance: ~150 million km"
        }
      ],
      medium: [
        {
          question: "What is a light-year?",
          options: ["Time light travels", "Distance light travels in a year", "Speed of light", "Age of light"],
          correct: 1,
          explanation: "A light-year is the distance light travels in one year, about 9.46 trillion kilometers.",
          concept: "Light-years are used to measure vast distances in space because of the enormous scales involved.",
          animation: "💡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━➤ (1 year of travel)",
          visualAid: "1 ly ≈ 9.46 × 10¹² km"
        },
        {
          question: "What type of star is our Sun?",
          options: ["Red giant", "White dwarf", "Yellow dwarf", "Blue supergiant"],
          correct: 2,
          explanation: "Our Sun is classified as a yellow dwarf star, also known as a G-type main-sequence star.",
          concept: "Stars are classified by their temperature, size, and color.",
          animation: "☀️ G-type: Medium size, ~5,800K surface temperature",
          visualAid: "Main sequence: Hydrogen → Helium fusion"
        }
      ],
      hard: [
        {
          question: "What happens to a star when it runs out of nuclear fuel?",
          options: ["It disappears", "It becomes a planet", "It collapses or explodes", "It moves away"],
          correct: 2,
          explanation: "When a star runs out of fuel, it either collapses into a white dwarf, neutron star, or black hole, or explodes as a supernova.",
          concept: "Stellar evolution depends on the star's mass and determines its final fate.",
          animation: "⭐ → 🔥Fuel out → 💥Supernova OR 🕳️Black hole",
          visualAid: "Mass determines fate: <8 solar masses → white dwarf, >8 → neutron star/black hole"
        }
      ]
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time's up
      setTimerActive(false);
      setStreak(0);
      setFeedback("⏰ Time's up! Moving to next question.");
      setShowExplanation(true);
      setTimeout(() => {
        if (questionsAnswered < 9) {
          generateNewQuestion();
        } else {
          setGameStarted(false);
          setCurrentQuestion(null);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, questionsAnswered]);

  // Real-time updates when settings change
  useEffect(() => {
    if (gameStarted && currentQuestion) {
      generateNewQuestion();
    }
  }, [questionType, difficulty]);

  const getRandomQuestionType = (): QuestionType => {
    const types: QuestionType[] = ['physics', 'chemistry', 'biology', 'earth-science', 'astronomy'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const generateQuestion = (): ScienceQuestion => {
    const actualType = questionType === 'random' ? getRandomQuestionType() : questionType;
    const questions = questionBank[actualType as keyof typeof questionBank]?.[difficulty] || questionBank.physics.easy;
    const questionData = questions[Math.floor(Math.random() * questions.length)];
    
    return {
      type: actualType,
      category: actualType.charAt(0).toUpperCase() + actualType.slice(1).replace('-', ' '),
      ...questionData
    };
  };

  const generateNewQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFeedback('');
    setTimeLeft(30);
    setTimerActive(true);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setFeedback('');
    setSelectedAnswer(null);
    setShowExplanation(false);
    setHintsUsed(0);
    setSkipsUsed(0);
    setCurrentQuestion(generateQuestion());
    setTimeLeft(30);
    setTimerActive(true);
  };

  const useHint = () => {
    if (!currentQuestion || hintsUsed >= 3) return;
    
    const hints = [
      `💡 Category: ${currentQuestion.category}`,
      `💡 Think about: ${currentQuestion.concept}`,
      `💡 Visual aid: ${currentQuestion.visualAid || currentQuestion.animation || 'Think step by step'}`
    ];
    
    setFeedback(hints[hintsUsed]);
    setHintsUsed(hintsUsed + 1);
    
    setTimeout(() => setFeedback(''), 4000);
  };

  const skipQuestion = () => {
    if (skipsUsed >= 2) return;
    
    setSkipsUsed(skipsUsed + 1);
    setStreak(0);
    setQuestionsAnswered(questionsAnswered + 1);
    setTimerActive(false);
    
    if (questionsAnswered < 9) {
      generateNewQuestion();
    } else {
      setGameStarted(false);
      setCurrentQuestion(null);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(null);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setFeedback('');
    setSelectedAnswer(null);
    setShowExplanation(false);
    setHintsUsed(0);
    setSkipsUsed(0);
    setTimerActive(false);
    setTimeLeft(30);
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return;
    
    setTimerActive(false);
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft);
      const points = (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) * (streak + 1) + timeBonus;
      setScore(score + points);
      setStreak(streak + 1);
      setFeedback(`Correct! 🎉 +${points} points (${timeBonus} time bonus)`);
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`);
    }
    
    setShowExplanation(true);
    setQuestionsAnswered(questionsAnswered + 1);
    
    setTimeout(() => {
      if (questionsAnswered < 9) {
        generateNewQuestion();
      } else {
        setGameStarted(false);
        setCurrentQuestion(null);
      }
    }, 4000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🔬 Science Challenge</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Science Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>1. Choose your science subject and difficulty level</p>
                <p>2. Answer multiple choice questions about science topics</p>
                <p>3. Use hints (max 3 per game) and skips (max 2 per game)</p>
                <p>4. Read explanations and visual aids to learn more</p>
                <p>5. Build streaks for bonus points!</p>
                <p>6. Beat the 30-second timer for time bonus</p>
                <p>7. Settings update in real-time during gameplay</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center flex-wrap">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">⚛️ Physics</SelectItem>
                    <SelectItem value="chemistry">🧪 Chemistry</SelectItem>
                    <SelectItem value="biology">🧬 Biology</SelectItem>
                    <SelectItem value="earth-science">🌍 Earth Science</SelectItem>
                    <SelectItem value="astronomy">🌌 Astronomy</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="w-32">
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
          </CardContent>
        </Card>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">
              {gameStarted ? (
                <div className="flex justify-between items-center">
                  <span>Score: {score}</span>
                  <span>Question: {questionsAnswered + 1}/10</span>
                  <span>Streak: {streak}</span>
                </div>
              ) : (
                "Test Your Science Knowledge!"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-lg">Ready to explore science?</p>
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-xl px-8 py-3">
                  Start Challenge
                </Button>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 font-medium">
                    {currentQuestion.category} | {difficulty.toUpperCase()}
                  </span>
                  <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                
                <div className="text-xl font-semibold text-gray-800">
                  {currentQuestion.question}
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`p-4 text-left ${selectedAnswer === index ? 'bg-blue-500 text-white' : ''}`}
                      onClick={() => setSelectedAnswer(index)}
                      disabled={showExplanation}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>
                
                <div className="flex justify-center gap-2 flex-wrap">
                  <Button 
                    onClick={checkAnswer} 
                    disabled={selectedAnswer === null || showExplanation}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Submit
                  </Button>
                  
                  <Button 
                    onClick={useHint} 
                    disabled={hintsUsed >= 3}
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200"
                  >
                    💡 Hint ({hintsUsed}/3)
                  </Button>
                  
                  <Button 
                    onClick={skipQuestion} 
                    disabled={skipsUsed >= 2}
                    variant="outline"
                    className="bg-orange-100 hover:bg-orange-200"
                  >
                    ⏭️ Skip ({skipsUsed}/2)
                  </Button>
                  
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    className="bg-red-100 hover:bg-red-200"
                  >
                    🔄 Reset
                  </Button>
                  
                  <Dialog open={showConcept} onOpenChange={setShowConcept}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-purple-100 hover:bg-purple-200">
                        📚 Concept
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{currentQuestion.category} Concepts</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm">{scienceConcepts[currentQuestion.type as keyof typeof scienceConcepts]}</p>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold text-purple-800 mb-2">About this question:</h4>
                          <p className="text-sm text-purple-700 mb-3">{currentQuestion.concept}</p>
                          {currentQuestion.animation && (
                            <div className="bg-white p-3 rounded border-2 border-purple-200 mb-3">
                              <h5 className="font-medium text-purple-800 mb-2">Visual Animation:</h5>
                              <p className="text-lg font-mono text-center animate-pulse">{currentQuestion.animation}</p>
                            </div>
                          )}
                          {currentQuestion.visualAid && (
                            <div className="bg-blue-50 p-3 rounded border-2 border-blue-200">
                              <h5 className="font-medium text-blue-800 mb-2">Mathematical/Visual Aid:</h5>
                              <p className="text-sm font-mono text-blue-700">{currentQuestion.visualAid}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${
                    feedback.includes('Correct') ? 'text-green-600' : 
                    feedback.includes('Hint') || feedback.includes('Visual') ? 'text-yellow-600' : 
                    'text-red-600'
                  } animate-bounce`}>
                    {feedback}
                  </div>
                )}
                
                {showExplanation && (
                  <div className="bg-blue-50 p-4 rounded-lg text-left max-w-md mx-auto space-y-3">
                    <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                    <p className="text-blue-700">{currentQuestion.explanation}</p>
                    {currentQuestion.visualAid && (
                      <div className="bg-white p-3 rounded border-2 border-blue-200">
                        <h5 className="font-medium text-blue-800 mb-2">Formula/Visual Aid:</h5>
                        <p className="text-sm font-mono text-blue-600">{currentQuestion.visualAid}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Science Challenge Complete!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Questions Answered: {questionsAnswered}/10</p>
                <p className="text-lg">Best Streak: {Math.max(...Array.from({length: questionsAnswered}, (_, i) => streak))}</p>
                <div className="text-sm text-gray-600">
                  Performance: {score >= 300 ? '🏆 Science Master!' : score >= 200 ? '⭐ Excellent!' : score >= 100 ? '👍 Well Done!' : '📚 Keep Learning!'}
                </div>
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
