
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useScroll } from '@/hooks/useScroll';

// Import custom components
import Logo from './navigation/Logo';
import SearchBar from './navigation/SearchBar';
import CitySelector from './navigation/CitySelector';
import UserMenu from './navigation/UserMenu';
import MobileMenu from './navigation/MobileMenu';
import MobileSearch from './navigation/MobileSearch';
import DashboardLink from './navigation/DashboardLink';

// Import types and constants
import { City, Category } from '@/constants/app-constants';

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

  const hasDashboard = !!userRole;
  const dashboardPath = userRole === 'admin' ? '/admin' : '/salon/dashboard';

  return (
    <header 
      className={`fixed top-8 left-0 w-full z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and hamburger menu */}
          <div className="flex items-center gap-2">
            <MobileMenu 
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              hasDashboard={hasDashboard}
              dashboardPath={dashboardPath}
              userRole={userRole}
              isLoggedIn={!!session?.user}
            />
            <Logo />
          </div>

          {/* Middle section - Search bar */}
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

            <DashboardLink 
              hasDashboard={hasDashboard}
              dashboardPath={dashboardPath}
              userRole={userRole}
              className="hidden md:flex"
            />

            <UserMenu 
              session={session}
              hasDashboard={hasDashboard}
              dashboardPath={dashboardPath}
              userRole={userRole}
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
