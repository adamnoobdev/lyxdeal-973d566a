
import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Home, Gift, HelpCircle, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { City, Category, CITIES, CATEGORIES } from '@/constants/app-constants';
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <Button variant="ghost" size="icon" className="md:hidden ml-2 hover:bg-primary/10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[85vw] max-w-[300px]">
        <ScrollArea className="h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Meny</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Filter</h3>
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
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Navigation</h3>
              <nav className="flex flex-col space-y-1">
                <Link to="/" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10">
                  <Home className="h-4 w-4 mr-2" />
                  Hem
                </Link>
                <Link to="/partner" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10">
                  <Gift className="h-4 w-4 mr-2" />
                  Partner
                </Link>
                <Link to="/faq" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
              </nav>
            </div>
            
            {hasDashboard && (
              <Link to={dashboardPath} className="flex items-center justify-center px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium">
                {userRole === 'admin' ? 'Admin Dashboard' : 'Salongens Dashboard'}
              </Link>
            )}
            
            {isLoggedIn ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Konto</h3>
                <nav className="flex flex-col space-y-1">
                  <Link to="/auth" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10">
                    <User className="h-4 w-4 mr-2" />
                    Min profil
                  </Link>
                  <Link to="/auth?logout=true" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 text-red-500">
                    Logga ut
                  </Link>
                </nav>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center justify-center px-4 py-2 bg-secondary text-primary hover:bg-secondary/90 rounded-md text-sm font-medium">
                Logga in
              </Link>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
