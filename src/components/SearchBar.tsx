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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Sök erbjudanden..."
          className="w-full pl-9 py-5 md:py-6 bg-white border border-input hover:border-primary/20 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/20 transition-all text-base md:text-lg rounded-lg md:rounded-xl"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          autoFocus={false}
        />
      </div>
    </form>
  );
};