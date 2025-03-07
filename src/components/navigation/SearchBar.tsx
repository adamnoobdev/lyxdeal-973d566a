
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-full">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input 
          type="search" 
          placeholder="Sök på LyxDeal" 
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
        />
      </div>
    </form>
  );
};

export default SearchBar;
