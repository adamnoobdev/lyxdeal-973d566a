
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useScroll } from '@/hooks/useScroll';

// Import custom components
import Logo from './navigation/Logo';
import SearchBar from './navigation/SearchBar';
import CitySelector from './navigation/CitySelector';
import { UserMenu } from './navigation/UserMenu';
import MobileMenu from './navigation/MobileMenu';
import MobileSearch from './navigation/MobileSearch';

// Import types and constants
import { City, Category } from '@/constants/app-constants';
import { useAuth } from '@/hooks/useAuth';

interface NavigationBarProps {
  userRole?: string | null;
}

const NavigationBar = ({
  userRole
}: NavigationBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City>('Alla Städer');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Alla Erbjudanden');
  const { session } = useSession();
  const { profile } = useAuth(); 
  const navigate = useNavigate();
  const { isScrolled } = useScroll();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let searchParams = new URLSearchParams();
    if (searchQuery) searchParams.append('q', searchQuery);
    if (selectedCity !== 'Alla Städer') searchParams.append('city', selectedCity);
    if (selectedCategory !== 'Alla Erbjudanden') searchParams.append('category', selectedCategory);
    navigate(`/search?${searchParams.toString()}`);
  };

  // Använd userRole om det skickas som prop, annars använd rollen från auth-profilen
  const effectiveUserRole = userRole || profile?.role;
  const topPosition = session?.user ? 'top-0' : 'top-[40px]';

  return (
    <header 
      className={`fixed ${topPosition} w-full z-40 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Mobile menu */}
          <div className="md:hidden">
            <MobileMenu 
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              userRole={effectiveUserRole}
              isLoggedIn={!!session?.user}
            />
          </div>

          {/* Center logo for mobile, left for desktop */}
          <div className="flex items-center md:flex-none flex-1 md:flex-initial justify-center md:justify-start">
            <Logo />
          </div>

          {/* Middle section - Search bar (desktop only) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            <CitySelector 
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              className="hidden md:flex"
            />

            <UserMenu 
              userRole={effectiveUserRole}
              className="hidden md:flex"
            />

            {/* Mobile search and actions */}
            <div className="flex md:hidden items-center">
              <MobileSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                handleSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
