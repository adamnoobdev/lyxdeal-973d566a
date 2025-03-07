
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useSession } from '@/hooks/useSession';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Menu, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';
import { CITIES, CATEGORIES, City, Category } from '@/constants/app-constants';

interface NavigationBarProps {
  userRole?: string | null;
}

const NavigationBar = ({ userRole }: NavigationBarProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { session } = useSession();
  const [showBg, setShowBg] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City>('Alla Städer');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Alla Erbjudanden');
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Fetch logo from Supabase storage
    const fetchLogo = async () => {
      try {
        const { data } = await supabase.storage
          .from('assets')
          .getPublicUrl('Lyxdeal-logo.svg');
          
        if (data?.publicUrl) {
          setLogoUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowBg(true);
      } else {
        setShowBg(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let searchParams = new URLSearchParams();
    if (searchQuery) searchParams.append('q', searchQuery);
    if (selectedCity !== 'Alla Städer') searchParams.append('city', selectedCity);
    if (selectedCategory !== 'Alla Erbjudanden') searchParams.append('category', selectedCategory);
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const hasDashboard = !!userRole;
  const dashboardPath = userRole === 'admin' ? '/admin' : '/salon/dashboard';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors ${showBg ? 'bg-white shadow-sm dark:bg-gray-900' : 'bg-white/80 backdrop-blur-sm dark:bg-gray-900/80'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt="LyxDeal Logo" className="h-8 w-auto" />
              ) : (
                <span className="font-bold text-2xl">LyxDeal</span>
              )}
            </Link>
            <nav className="hidden md:flex items-center space-x-6 ml-6">
              <Link to="/" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Hem
              </Link>
              <Link to="/partner" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Partner
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                FAQ
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4 flex-1 md:max-w-xl ml-4">
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Input 
                  type="search" 
                  placeholder="Sök efter lyxiga erbjudanden..." 
                  className="pr-10 w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      {selectedCity} <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {CITIES.map((city) => (
                      <DropdownMenuItem 
                        key={city} 
                        onClick={() => setSelectedCity(city)}
                      >
                        {city}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      {selectedCategory} <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {CATEGORIES.map((category) => (
                      <DropdownMenuItem 
                        key={category} 
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </form>
            
            <div className="hidden md:flex items-center space-x-4">
              {hasDashboard && (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {userRole === 'admin' ? 'Admin' : 'Salong'}
                </Link>
              )}
              
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.user_metadata?.full_name} />
                        <AvatarFallback>{session?.user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => window.location.href = '/auth'} >
                      Min profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/auth'} >
                      Logga ut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground px-4 py-2"
                  >
                    Logga in
                  </Link>
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    Registrera
                  </Link>
                </>
              )}
              {mounted ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              ) : null}
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Meny</SheetTitle>
                  <SheetDescription>
                    Utforska LyxDeal.
                  </SheetDescription>
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
                        {CITIES.map((city) => (
                          <DropdownMenuItem 
                            key={city} 
                            onClick={() => setSelectedCity(city)}
                          >
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
                        {CATEGORIES.map((category) => (
                          <DropdownMenuItem 
                            key={category} 
                            onClick={() => setSelectedCategory(category)}
                          >
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
                  
                  {session?.user ? (
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
                      <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800">
                        Registrera
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
