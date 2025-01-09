import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
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
  const session = useSession();

  const currentCity = searchParams.get("city") || "Alla Städer";

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
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <Logo />

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-auto hidden md:block"
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
        
        <div className="pb-3 md:hidden">
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