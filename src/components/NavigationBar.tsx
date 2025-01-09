import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScroll } from "@/hooks/useScroll";
import { useSession } from "@/hooks/useSession";
import { Logo } from "./navigation/Logo";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileActions } from "./navigation/MobileActions";
import { MobileSearchContainer } from "./navigation/MobileSearchContainer";
import { supabase } from "@/integrations/supabase/client";

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

          <MobileActions 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            currentCity={currentCity}
            onCitySelect={handleCitySelect}
            onCategorySelect={handleCategorySelect}
            session={session}
            onLogout={handleLogout}
            onLogin={handleLogin}
          />
        </div>

        <MobileSearchContainer 
          showMobileSearch={showMobileSearch}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>
    </nav>
  );
};