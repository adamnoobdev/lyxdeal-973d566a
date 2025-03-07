
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { City, Category, CITIES, CATEGORIES } from '@/constants/app-constants';

interface MobileSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  handleSearch
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="pt-16">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              type="search" 
              placeholder="Sök på LyxDeal" 
              className="pl-10 pr-4 py-2 w-full" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  {selectedCity} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {CITIES.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setSelectedCity(city)}>
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  {selectedCategory} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {CATEGORIES.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button type="submit" className="w-full">
            Sök
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearch;
