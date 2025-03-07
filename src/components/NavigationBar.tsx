import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useSession } from '@/hooks/useSession';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';

interface NavigationBarProps {
  userRole?: string | null;
}

const NavigationBar = ({ userRole }: NavigationBarProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { session } = useSession();
  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const hasDashboard = !!userRole;
  const dashboardPath = userRole === 'admin' ? '/admin' : '/salon/dashboard';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors ${showBg ? 'bg-white shadow-sm' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="font-bold text-2xl">LyxDeal</span>
            </a>
            <nav className="hidden md:flex items-center space-x-6 ml-6">
              <Link to="/" className="text-gray-600 hover:text-gray-800">
                Hem
              </Link>
              <Link to="/partner" className="text-gray-600 hover:text-gray-800">
                Partner
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-gray-800">
                FAQ
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:flex-none">
              <Input type="search" placeholder="Sök efter lyxiga erbjudanden..." className="pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {hasDashboard && (
                <a 
                  href={dashboardPath}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {userRole === 'admin' ? 'Admin' : 'Salong'}
                </a>
              )}
              
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.user_metadata?.full_name} />
                        <AvatarFallback>{session?.user?.user_metadata?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
                <div className="grid gap-4 py-4">
                  <Link to="/" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                    Hem
                  </Link>
                  <Link to="/partner" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                    Partner
                  </Link>
                  <Link to="/faq" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                    FAQ
                  </Link>
                  {session?.user ? (
                    <>
                      <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                        Min profil
                      </Link>
                      <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                        Logga ut
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                        Logga in
                      </Link>
                      <Link to="/auth" className="px-4 py-2 block text-gray-700 hover:bg-gray-100 rounded">
                        Registrera
                      </Link>
                    </>
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
