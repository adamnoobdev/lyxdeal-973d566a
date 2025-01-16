import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSubmit,
  className = ""
}: SearchBarProps) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
        <Input
          type="search"
          placeholder="Sök erbjudanden..."
          className="w-full pl-11 py-6 bg-white border-2 border-primary/10 shadow-sm hover:border-primary/20 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/20 transition-all text-lg rounded-xl"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          autoFocus={false}
        />
      </div>
    </form>
  );
};