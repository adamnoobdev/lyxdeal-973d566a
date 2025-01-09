import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { SearchBar } from "./SearchBar";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";

export const NavigationBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const session = useSession();

  const currentCity = searchParams.get("city") || "Alla Städer";

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  const handleCityClick = (city: string) => {
    const params = new URLSearchParams(searchParams);
    if (city === "Alla Städer") {
      params.delete("city");
    } else {
      params.set("city", city);
    }
    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className={`border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          <Logo />

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            className={`flex-1 max-w-xl mx-auto ${
              isScrolled ? 'hidden md:flex' : 'hidden md:flex'
            }`}
          />

          <DesktopNav 
            currentCity={currentCity}
            onCitySelect={handleCityClick}
            onCategorySelect={handleCategoryClick}
            session={session}
            onLogout={handleLogout}
          />

          <MobileNav 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            currentCity={currentCity}
            onCitySelect={handleCityClick}
            onCategorySelect={handleCategoryClick}
            session={session}
            onLogout={handleLogout}
          />
        </div>
        
        <div className={`transform transition-all duration-300 pb-3 md:hidden ${
          isScrolled ? 'hidden' : 'block'
        }`}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            className="w-full"
          />
        </div>
      </div>
    </nav>
  );
};