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
          className="w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </form>
  );
};