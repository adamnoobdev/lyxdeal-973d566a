import { SearchBar } from "../SearchBar";

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showMobileSearch: boolean;
}

export const MobileSearchBar = ({
  searchQuery,
  onSearchChange,
  onSubmit,
  showMobileSearch,
}: MobileSearchBarProps) => {
  return (
    <div className="px-4 py-3">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        className="w-full"
      />
    </div>
  );
};