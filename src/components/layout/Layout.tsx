
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Footer } from "../Footer";
import { DesktopNav } from "../navigation/DesktopNav";
import { MobileNav } from "../navigation/MobileNav";
import { Toaster } from "../ui/sonner";
import { DevelopmentNav } from "../development/DevelopmentNav";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";

export default function Layout() {
  // State for navigation components
  const [currentCity, setCurrentCity] = useState("Alla Städer");
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut } = useSession();
  const navigate = useNavigate();
  
  // Event handlers for navigation components
  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
  };
  
  const handleCategorySelect = (category: string) => {
    // Handle category selection - we could navigate or filter content
    console.log("Category selected:", category);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <DesktopNav 
          currentCity={currentCity}
          onCitySelect={handleCitySelect}
          onCategorySelect={handleCategorySelect}
          session={session}
          onLogout={handleLogout}
        />
        <MobileNav 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentCity={currentCity}
          onCitySelect={handleCitySelect}
          onCategorySelect={handleCategorySelect}
          session={session}
          onLogout={handleLogout}
        />
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" closeButton />
      <DevelopmentNav />
    </div>
  );
}
