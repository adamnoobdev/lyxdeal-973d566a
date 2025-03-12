import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from './Logo';
import { City, Category, CITIES, CATEGORIES } from '@/constants/app-constants';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/integrations/supabase/client';

interface MobileMenuProps {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  hasDashboard: boolean;
  dashboardPath: string;
  userRole?: string | null;
  isLoggedIn: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  hasDashboard,
  dashboardPath,
  userRole,
  isLoggedIn
}) => {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setOpen(false);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden p-1.5">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Öppna meny</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Logo variant="miniature" />
              <span className="font-semibold text-lg">LyxDeal</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Stäng meny</span>
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <nav className="px-2 py-4">
              <div className="space-y-1 px-3 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Navigering</h3>
                <Link 
                  to="/" 
                  className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Hem
                </Link>
                {hasDashboard && (
                  <Link 
                    to={dashboardPath} 
                    className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    {userRole === 'admin' ? 'Admin' : 'Salong'}dashboard
                  </Link>
                )}
                <Link 
                  to="/partner" 
                  className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Bli Partner
                </Link>
              </div>
              <Separator />
              <div className="space-y-1 px-3 py-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Städer</h3>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`block w-full text-left py-2 px-3 rounded-md 
                      ${selectedCity === city 
                        ? 'bg-primary-100 text-primary-500 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <Separator />
              <div className="space-y-1 px-3 py-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Kategorier</h3>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`block w-full text-left py-2 px-3 rounded-md 
                      ${selectedCategory === category 
                        ? 'bg-primary-100 text-primary-500 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <Separator />
              <div className="space-y-1 px-3 py-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Logga ut
                  </button>
                ) : (
                  <Link 
                    to="/auth" 
                    className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Logga in
                  </Link>
                )}
              </div>
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/faq" 
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                Vanliga frågor
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                Villkor
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
