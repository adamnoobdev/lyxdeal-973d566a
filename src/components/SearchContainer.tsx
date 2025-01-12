import { SearchBar } from "./SearchBar";

interface SearchContainerProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchContainer = ({
  searchQuery,
  onSearchChange,
  onSearch,
}: SearchContainerProps) => {
  return (
    <div className="w-full transform-gpu">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          onSearch();
        }}
        className="w-full"
      />
    </div>
  );
};