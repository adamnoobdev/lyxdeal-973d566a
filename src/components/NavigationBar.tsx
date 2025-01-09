import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScroll } from "@/hooks/useScroll";
import { useSession } from "@/hooks/useSession";
import { Logo } from "./navigation/Logo";
import { SearchBar } from "./SearchBar";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { MobileSearchBar } from "./navigation/MobileSearchBar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { LogOut, UserRound } from "lucide-react";

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Alla Städer");
  const { showMobileSearch } = useScroll();
  const session = useSession();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setIsOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    if (session) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col">
        <div className="flex h-16 items-center px-4 md:container md:px-6">
          <Logo />

          <DesktopNavigation 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            currentCity={currentCity}
            onCitySelect={handleCitySelect}
            onCategorySelect={handleCategorySelect}
            session={session}
            onLogout={handleLogout}
          />

          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            {session ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logga ut</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleLogin}
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden xs:inline">Logga in</span>
              </Button>
            )}

            <MobileNavigation 
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currentCity={currentCity}
              onCitySelect={handleCitySelect}
              onCategorySelect={handleCategorySelect}
              session={session}
              onLogout={handleLogout}
            />
          </div>
        </div>

        <MobileSearchBarContainer 
          showMobileSearch={showMobileSearch}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>
    </nav>
  );
};

const DesktopNavigation = ({
  searchQuery,
  onSearchChange,
  onSearch,
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  onLogout
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: any;
  onLogout: () => Promise<void>;
}) => (
  <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:space-x-4">
    <SearchBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onSubmit={onSearch}
      className="w-full max-w-md"
    />
    <DesktopNav
      currentCity={currentCity}
      onCitySelect={onCitySelect}
      onCategorySelect={onCategorySelect}
      session={session}
      onLogout={onLogout}
    />
  </div>
);

// Mobile Navigation Component
const MobileNavigation = ({
  isOpen,
  setIsOpen,
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  onLogout
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: any;
  onLogout: () => Promise<void>;
}) => (
  <MobileNav
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    currentCity={currentCity}
    onCitySelect={onCitySelect}
    onCategorySelect={onCategorySelect}
    session={session}
    onLogout={onLogout}
  />
);

const MobileSearchBarContainer = ({
  showMobileSearch,
  searchQuery,
  onSearchChange,
  onSearch
}: {
  showMobileSearch: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}) => (
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
