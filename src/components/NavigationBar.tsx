import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { SearchContainer } from "./navigation/SearchContainer";

const NavigationBarComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const session = useSession();

  const currentCity = searchParams.get("city") || "Alla Städer";

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleCategoryClick = useCallback((category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
  }, [searchParams, navigate]);

  const handleCityClick = useCallback((city: string) => {
    const params = new URLSearchParams(searchParams);
    if (city === "Alla Städer") {
      params.delete("city");
    } else {
      params.set("city", city);
    }
    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
  }, [searchParams, navigate]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  return (
    <nav 
      className={`border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 transform-gpu will-change-transform ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <div className="hidden md:flex flex-1 max-w-3xl mx-8">
            <SearchContainer
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmit={handleSearch}
              isScrolled={isScrolled}
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <DesktopNav 
              currentCity={currentCity}
              onCitySelect={handleCityClick}
              onCategorySelect={handleCategoryClick}
              session={session}
              onLogout={handleLogout}
            />
          </div>

          <div className="md:hidden">
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
        </div>

        <div className="md:hidden pb-3">
          <SearchContainer
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            isScrolled={isScrolled}
          />
        </div>
      </div>
    </nav>
  );
};

export const NavigationBar = memo(NavigationBarComponent);