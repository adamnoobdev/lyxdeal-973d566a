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
  const [userRole, setUserRole] = useState<'customer' | 'salon_owner' | 'admin' | null>(null);
  const { showMobileSearch } = useScroll();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (session?.user) {
        const { data: salon, error } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking user role:', error);
          setUserRole('customer');
          return;
        }
        
        if (salon) {
          setUserRole(salon.role as 'salon_owner' | 'admin');
        } else {
          setUserRole('customer');
        }
      } else {
        setUserRole(null);
      }
    };

    checkUserRole();
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
    try {
      // Clear local state first
      setUserRole(null);
      
      // Remove any stored session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Always navigate and show success message, regardless of server response
      navigate("/");
      toast.success("Du har loggat ut");
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure we still navigate and show success even if there's an error
      navigate("/");
      toast.success("Du har loggat ut");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
    setIsOpen(false);
  };

  const handleDashboard = () => {
    if (userRole === 'salon_owner') {
      navigate("/salon/dashboard");
    } else if (userRole === 'admin') {
      navigate("/admin");
    } else {
      toast.error("Du har inte tillgång till denna sida");
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
            userRole={userRole}
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
            userRole={userRole}
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