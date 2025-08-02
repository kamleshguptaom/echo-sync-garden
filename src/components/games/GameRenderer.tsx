
import React from 'react';

// Import all game components
import { MemoryGame } from './MemoryGame/MemoryGame';
import { MathGame } from './MathGame/MathGame';
import { WordGame } from './WordGame/WordGame';
import { WordMaster } from './WordMaster/WordMaster';
import { LogicGame } from './LogicGame/LogicGame';
import { GeometryGame } from './GeometryGame/GeometryGame';
import { ScienceGame } from './ScienceGame/ScienceGame';
import { GeographyGame } from './GeographyGame/GeographyGame';
import { HistoryGame } from './HistoryGame/HistoryGame';
import { TicTacToe } from './TicTacToe/TicTacToe';
import { Sudoku } from './Sudoku/Sudoku';
import { JigsawPuzzle } from './JigsawPuzzle/JigsawPuzzle';
import { WaffleGame } from './WaffleGame/WaffleGame';
import { LadderSnake } from './LadderSnake/LadderSnake';
import { ObjectBuilder } from './ObjectBuilder/ObjectBuilder';
import { PatternGame } from './PatternGame/PatternGame';
import { ConcentrationGame } from './ConcentrationGame/ConcentrationGame';
import { SpeedReading } from './SpeedReading/SpeedReading';
import { TypingGame } from './TypingGame/TypingGame';
import { DrawingGame } from './DrawingGame/DrawingGame';
import { RoadSafetyGame } from './RoadSafetyGame/RoadSafetyGame';
import { NumberSequence } from './NumberSequence/NumberSequence';
import { MathRacing } from './MathRacing/MathRacing';
import { VisualPerception } from './VisualPerception/VisualPerception';
import { AttentionTraining } from './AttentionTraining/AttentionTraining';
import { FractionGame } from './FractionGame/FractionGame';
import { AlgebraGame } from './AlgebraGame/AlgebraGame';
import { CriticalThinking } from './CriticalThinking/CriticalThinking';
import { GrammarGame } from './GrammarGame/GrammarGame';
import { BloodRelations } from './BloodRelations/BloodRelations';
import { LogicDashLab } from './LogicDashLab/LogicDashLab';
import { PhonicsFun } from './PhonicsFun/PhonicsFun';
import { EcoWarrior } from './EcoWarrior/EcoWarrior';
import { VehicleVoyage } from './VehicleVoyage/VehicleVoyage';
import { HealthyChoices } from './HealthyChoices/HealthyChoices';
import { FeelingFaces } from './FeelingFaces/FeelingFaces';
import { TimeMaster } from './TimeMaster/TimeMaster';
import { CoinCounter } from './CoinCounter/CoinCounter';
import { WeatherWizard } from './WeatherWizard/WeatherWizard';
import { AnimalHomes } from './AnimalHomes/AnimalHomes';
import { SpaceExplorer } from './SpaceExplorer/SpaceExplorer';
import { BodyParts } from './BodyParts/BodyParts';
import BrainTraining from './BrainTraining/BrainTraining';

import VirtualLab from './VirtualLab/VirtualLab';
import CreativeStudio from './CreativeStudio/CreativeStudio';
import MindMaze from './MindMaze/MindMaze';

interface GameRendererProps {
  gameId: string;
  onBack: () => void;
}

export const GameRenderer: React.FC<GameRendererProps> = ({ gameId, onBack }) => {
  const gameProps = { onBack };

  switch (gameId) {
    case 'memory': return <MemoryGame {...gameProps} />;
    case 'math': return <MathGame {...gameProps} />;
    case 'word': return <WordGame {...gameProps} />;
    case 'logic': return <LogicGame {...gameProps} />;
    case 'geometry': return <GeometryGame {...gameProps} />;
    case 'science': return <ScienceGame {...gameProps} />;
    case 'geography': return <GeographyGame {...gameProps} />;
    case 'history': return <HistoryGame {...gameProps} />;
    case 'tictactoe': return <TicTacToe {...gameProps} />;
    case 'sudoku': return <Sudoku {...gameProps} />;
    case 'jigsaw': return <JigsawPuzzle {...gameProps} />;
    case 'waffle': return <WaffleGame {...gameProps} />;
    case 'laddersnake': return <LadderSnake {...gameProps} />;
    case 'builder': return <ObjectBuilder {...gameProps} />;
    case 'pattern': return <PatternGame {...gameProps} />;
    case 'concentration': return <ConcentrationGame {...gameProps} />;
    case 'speedreading': return <SpeedReading {...gameProps} />;
    case 'typing': return <TypingGame {...gameProps} />;
    case 'drawing': return <DrawingGame {...gameProps} />;
    case 'visualperception': return <VisualPerception {...gameProps} />;
    case 'attention': return <AttentionTraining {...gameProps} />;
    case 'fractions': return <FractionGame {...gameProps} />;
    case 'algebra': return <AlgebraGame {...gameProps} />;
    case 'criticalthinking': return <CriticalThinking {...gameProps} />;
    case 'roadsafety': return <RoadSafetyGame {...gameProps} />;
    case 'numbersequence': return <NumberSequence {...gameProps} />;
    case 'mathracing': return <MathRacing {...gameProps} />;
    case 'grammar': return <GrammarGame {...gameProps} />;
    case 'bloodrelations': return <BloodRelations {...gameProps} />;
    case 'logicdashlab': return <LogicDashLab {...gameProps} />;
    case 'phonics': return <PhonicsFun {...gameProps} />;
    
    case 'recycling': return <EcoWarrior {...gameProps} />;
    case 'transportation': return <VehicleVoyage {...gameProps} />;
    case 'nutrition': return <HealthyChoices {...gameProps} />;
    case 'emotions': return <FeelingFaces {...gameProps} />;
    case 'clocklearning': return <TimeMaster {...gameProps} />;
    case 'moneymath': return <CoinCounter {...gameProps} />;
    case 'weatherscience': return <WeatherWizard {...gameProps} />;
    case 'animalhabitats': return <AnimalHomes {...gameProps} />;
    case 'solarsystem': return <SpaceExplorer {...gameProps} />;
    case 'bodyparts': return <BodyParts {...gameProps} />;
    
    case 'braintraining': return <BrainTraining {...gameProps} />;
    
    case 'virtuallab': return <VirtualLab {...gameProps} />;
    case 'creativestudio': return <CreativeStudio {...gameProps} />;
    case 'mindmaze': return <MindMaze {...gameProps} />;
    case 'mind-maze': return <MindMaze {...gameProps} />;
    case 'creative-studio': return <CreativeStudio {...gameProps} />;
    case 'virtual-lab': return <VirtualLab {...gameProps} />;
    case 'brain-training': return <BrainTraining {...gameProps} />;
    case 'word-game': return <WordMaster {...gameProps} />;
    case 'objectbuilder': return <ObjectBuilder {...gameProps} />;
    case 'visual-perception': return <VisualPerception {...gameProps} />;
    default:
      console.error(`Game not found: ${gameId}`);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Not Found</h2>
            <p className="text-white/90 mb-4">The requested game "{gameId}" could not be loaded.</p>
            <button 
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg"
            >
              Back to Games
            </button>
          </div>
        </div>
      );
  }
};
