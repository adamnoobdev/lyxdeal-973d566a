import { MobileSearchBar } from "./MobileSearchBar";

interface MobileSearchContainerProps {
  showMobileSearch: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const MobileSearchContainer = ({
  showMobileSearch,
  searchQuery,
  onSearchChange,
  onSearch
}: MobileSearchContainerProps) => (
  <div 
    className={`md:hidden overflow-hidden transition-[height] duration-300 ease-in-out ${
      showMobileSearch ? 'h-14' : 'h-0'
    }`}
  >
    <MobileSearchBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onSubmit={onSearch}
      showMobileSearch={showMobileSearch}
    />
  </div>
);