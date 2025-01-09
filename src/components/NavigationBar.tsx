import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { Logo } from "./navigation/Logo";
import { MobileSearchBar } from "./navigation/MobileSearchBar";
import { useScroll } from "@/hooks/useScroll";
import { useSession } from "@/hooks/useSession";

export const NavigationBar = () => {
  const [searchParams] = useSearchParams();
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <DesktopNav
            currentCity={currentCity}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            isScrolled={isScrolled}
          />
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <MobileNav
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            session={session}
            currentCity={currentCity}
          />
        </div>
      </div>

      <MobileSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmit={handleSearch}
        showMobileSearch={showMobileSearch}
      />
    </nav>
  );
};