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
    <div className="px-4 py-2">
      <SearchContainer
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        isScrolled={false}
      />
    </div>
  );
};