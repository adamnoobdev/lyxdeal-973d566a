import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScroll } from "@/hooks/useScroll";
import { useSession } from "@/hooks/useSession";
import { Logo } from "./navigation/Logo";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileActions } from "./navigation/MobileActions";
import { MobileSearchContainer } from "./navigation/MobileSearchContainer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Alla Städer");
  const [hasSalon, setHasSalon] = useState(false);
  const { showMobileSearch } = useScroll();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSalon = async () => {
      if (session?.user) {
        const { data: salon } = await supabase
          .from('salons')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        setHasSalon(!!salon);
      } else {
        setHasSalon(false);
      }
    };

    checkSalon();
  }, [session]);

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
      toast.success("Du har loggat ut");
      navigate("/");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
    setIsOpen(false);
  };

  const handleDashboard = () => {
    if (hasSalon) {
      navigate("/salon/dashboard");
    } else {
      toast.error("Du har inte tillgång till en salongsportal");
    }
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
            hasSalon={hasSalon}
            onDashboard={handleDashboard}
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
            hasSalon={hasSalon}
            onDashboard={handleDashboard}
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