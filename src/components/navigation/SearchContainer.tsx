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
    <>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        className="w-full"
      />
      
      <div className="md:hidden">
        <div 
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            isScrolled ? 'h-0 opacity-0' : 'h-12 opacity-100 pb-3'
          }`}
          style={{
            transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)',
            willChange: 'transform, height, opacity'
          }}
        >
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSubmit={onSubmit}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};