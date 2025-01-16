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
    className={`md:hidden overflow-hidden transition-[height,opacity] duration-300 ease-in-out border-b ${
      showMobileSearch ? 'h-16 opacity-100' : 'h-0 opacity-0'
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