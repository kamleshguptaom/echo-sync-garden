
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  categories: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  categories,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="mb-8 p-6 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-white/10 border-white/30 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Filter */}
        <div className="w-full md:w-48">
          <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="bg-white/10 border-white/30 text-white">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}

        {/* Filter Icon for mobile */}
        <div className="flex items-center text-white/70">
          <Filter className="h-4 w-4" />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-500/30 text-white text-sm rounded-full">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="px-3 py-1 bg-green-500/30 text-white text-sm rounded-full">
              Category: {selectedCategory}
            </span>
          )}
          {selectedDifficulty !== 'all' && (
            <span className="px-3 py-1 bg-purple-500/30 text-white text-sm rounded-full">
              Level: {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
