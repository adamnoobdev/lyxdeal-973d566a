
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useSession } from '@/hooks/useSession';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Menu, ChevronDown, MapPin, Heart, ShoppingCart, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';
import { CITIES, CATEGORIES, City, Category } from '@/constants/app-constants';

interface NavigationBarProps {
  userRole?: string | null;
}

const NavigationBar = ({
  userRole
}: NavigationBarProps) => {
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
        const { data } = await supabase.storage.from('assets').getPublicUrl('Lyxdeal-logo.svg');
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
          {/* Left section - Logo and hamburger menu */}
          <div className="flex items-center gap-4">
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

            <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt="LyxDeal Logo" className="h-8 w-auto" />
              ) : (
                <span className="font-bold text-2xl">LyxDeal</span>
              )}
            </Link>
          </div>

          {/* Middle section - Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  type="search" 
                  placeholder="Sök på LyxDeal" 
                  className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link to="/search" className="relative">
                <MapPin className="h-5 w-5" />
                <span className="sr-only">Välj stad</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  <MapPin className="mr-1 h-4 w-4" /> {selectedCity} <ChevronDown className="ml-1 h-4 w-4" />
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

            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoriter</span>
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Kundvagn</span>
            </Button>

            {hasDashboard && (
              <Link to={dashboardPath} className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {userRole === 'admin' ? 'Admin' : 'Salong'}
              </Link>
            )}

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.user_metadata?.full_name} />
                      <AvatarFallback>{session?.user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => window.location.href = '/auth'}>
                    Min profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/auth'}>
                    Logga ut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                  <Link to="/auth">Logga in</Link>
                </Button>
                <Button size="sm" asChild className="hidden md:inline-flex">
                  <Link to="/auth">Registrera</Link>
                </Button>
              </>
            )}

            {mounted ? (
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="ml-1">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            ) : null}

            {/* Mobile search and menu */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="pt-16">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        type="search" 
                        placeholder="Sök på LyxDeal" 
                        className="pl-10 pr-4 py-2 w-full"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
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
                          <Button variant="outline" size="sm" className="flex-1">
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
                    <Button type="submit" className="w-full">
                      Sök
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
