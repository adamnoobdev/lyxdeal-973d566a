import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { Logo } from "./navigation/Logo";
import { MobileSearchBar } from "./navigation/MobileSearchBar";
import { SearchBar } from "./SearchBar";
import { useScroll } from "@/hooks/useScroll";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export const NavigationBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isScrolled, showMobileSearch } = useScroll(50);
  const session = useSession();

  const currentCity = searchParams.get("city") || "Alla Städer";

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  const handleCitySelect = useCallback((city: string) => {
    setSearchParams(prev => {
      if (city === "Alla Städer") {
        prev.delete("city");
      } else {
        prev.set("city", city);
      }
      return prev;
    });
  }, [setSearchParams]);

  const handleCategorySelect = useCallback((category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Logo />

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:space-x-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            className="w-full max-w-md"
          />
          <DesktopNav
            currentCity={currentCity}
            onCitySelect={handleCitySelect}
            onCategorySelect={handleCategorySelect}
            session={session}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <MobileNav
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

      <div className="px-4">
        <MobileSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSubmit={handleSearch}
          showMobileSearch={showMobileSearch}
        />
      </div>
    </nav>
  );
};