import { SearchBar } from "../SearchBar";

interface SearchContainerProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isScrolled: boolean;
}

export const SearchContainer = ({
  searchQuery,
  onSearchChange,
  onSubmit,
  isScrolled,
}: SearchContainerProps) => {
  return (
    <div className="w-full transform-gpu">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        className={`w-full transition-all duration-200 ease-in-out ${
          isScrolled ? 'py-1.5' : 'py-2.5'
        }`}
      />
    </div>
  );
};