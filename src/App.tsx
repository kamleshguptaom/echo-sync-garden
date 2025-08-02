import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreativeArts from "./pages/categories/CreativeArts";
import LifeSkillsSafety from "./pages/categories/LifeSkillsSafety";
import BrainMemoryTraining from "./pages/categories/BrainMemoryTraining";
import ExplorationDiscovery from "./pages/categories/ExplorationDiscovery";
import LanguageReading from "./pages/categories/LanguageReading";
import LogicPuzzles from "./pages/categories/LogicPuzzles";
import MathGames from "./pages/categories/MathGames";
import ScienceGames from "./pages/categories/ScienceGames";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creative-arts" element={<CreativeArts />} />
          <Route path="/life-skills-safety" element={<LifeSkillsSafety />} />
          <Route path="/brain-memory-training" element={<BrainMemoryTraining />} />
          <Route path="/exploration-discovery" element={<ExplorationDiscovery />} />
          <Route path="/language-reading" element={<LanguageReading />} />
          <Route path="/logic-puzzles" element={<LogicPuzzles />} />
          <Route path="/math-games" element={<MathGames />} />
          <Route path="/science-games" element={<ScienceGames />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
