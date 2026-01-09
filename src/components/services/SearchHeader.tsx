import { memo, useState, useCallback } from 'react';
import { Search, MapPin, ChevronDown, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { City, BusinessSolution } from '@/types/services';

interface SearchHeaderProps {
  searchCity: string;
  onSearchChange: (value: string) => void;
  onCitySelect: (cityName: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  isSearchFocused: boolean;
  showSuggestions: boolean;
  filteredCities: City[];
  currentService: string;
  businessSolutions: BusinessSolution[];
  onServiceNavigation: (href: string) => void;
}

/**
 * Optimized Search Header Component
 * - Memoized to prevent re-renders
 * - Handles city search and service type switching
 * - Reusable across Virtual Office, Coworking Space, Event Space pages
 * - Features smooth animations and focus states
 */
const SearchHeader = memo<SearchHeaderProps>(({
  searchCity,
  onSearchChange,
  onCitySelect,
  onSearchSubmit,
  onSearchFocus,
  onSearchBlur,
  isSearchFocused,
  showSuggestions,
  filteredCities,
  currentService,
  businessSolutions,
  onServiceNavigation,
}) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-lg border p-4 mb-4 relative transition-all duration-300 ${isSearchFocused
          ? 'border-primary shadow-2xl shadow-primary/20 bg-white dark:bg-zinc-900'
          : 'border-gray-200 dark:border-white/10 shadow-sm'
        }`}
    >
      <div className="flex items-center gap-4">
        {/* Search Label */}
        <div
          className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
            }`}
        >
          <Search
            className={`w-4 h-4 transition-all duration-300 ${isSearchFocused ? 'text-primary scale-110' : ''
              }`}
          />
          SEARCH CITY
        </div>

        {/* Search Form */}
        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
          <div className="relative">
            <Input
              type="text"
              value={searchCity}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              placeholder="Search for a city..."
              className={`pr-10 transition-all duration-300 dark:bg-zinc-800 dark:text-white ${isSearchFocused
                  ? 'border-primary ring-2 ring-primary/20 focus:ring-primary/30'
                  : 'border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary focus:border-transparent'
                }`}
            />
            <Button
              type="submit"
              size="sm"
              className={`absolute right-1 top-1 h-8 px-3 transition-all duration-300 ${isSearchFocused ? 'bg-primary/90 scale-105' : ''
                }`}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* City Suggestions Dropdown */}
          {showSuggestions && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border border-primary/20 dark:border-white/10 rounded-md shadow-xl z-[100] mt-1 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
              {filteredCities.map((city) => (
                <div
                  key={city.key}
                  className="px-4 py-3 hover:bg-primary/5 dark:hover:bg-zinc-800 cursor-pointer border-b border-gray-100 dark:border-zinc-800 last:border-b-0 transition-colors duration-200"
                  onClick={() => onCitySelect(city.name)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {city.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Service Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-300 font-medium flex items-center gap-2 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              {currentService}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-lg"
          >
            {businessSolutions.map((solution) => (
              <DropdownMenuItem
                key={solution.label}
                onClick={() => onServiceNavigation(solution.href)}
                className="cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <solution.icon className="w-4 h-4 mr-3 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {solution.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {solution.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

SearchHeader.displayName = 'SearchHeader';

export default SearchHeader;
