
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CollaborationSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CollaborationSearchBar({ searchTerm, onSearchChange }: CollaborationSearchBarProps) {
  return (
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Sök på rabattkod..."
        className="pl-8 w-full"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
