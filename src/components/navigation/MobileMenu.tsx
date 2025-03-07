
import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { City, Category, CITIES, CATEGORIES } from '@/constants/app-constants';

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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Meny</SheetTitle>
          <SheetDescription>Utforska LyxDeal.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Filter</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {selectedCity} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {CITIES.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setSelectedCity(city)}>
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {selectedCategory} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {CATEGORIES.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Navigation</p>
            <Link to="/" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
              Hem
            </Link>
            <Link to="/partner" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
              Partner
            </Link>
            <Link to="/faq" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
              FAQ
            </Link>
          </div>
          
          {hasDashboard && (
            <Link to={dashboardPath} className="px-4 py-2 block bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded">
              {userRole === 'admin' ? 'Admin Dashboard' : 'Salongens Dashboard'}
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Konto</p>
              <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
                Min profil
              </Link>
              <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
                Logga ut
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Konto</p>
              <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
                Logga in
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
