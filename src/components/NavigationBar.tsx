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
    let lastScrollY = window.scrollY;
    let ticking = false;
    let rafId: number;

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 50);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
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
      className={`border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 will-change-transform ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-[height] duration-200 ease-in-out ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          <Logo />

          <SearchContainer
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            isScrolled={isScrolled}
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
      </div>
    </nav>
  );
};

export const NavigationBar = memo(NavigationBarComponent);