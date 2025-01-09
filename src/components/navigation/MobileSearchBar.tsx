import { SearchContainer } from "../navigation/SearchContainer";

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
    <div 
      className={`md:hidden pb-3 transition-all duration-300 transform ${
        showMobileSearch ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <SearchContainer
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        isScrolled={false}
      />
    </div>
  );
};