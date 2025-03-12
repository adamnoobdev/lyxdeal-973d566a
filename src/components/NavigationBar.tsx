
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';

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
  const [showBg, setShowBg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City>('Alla Städer');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Alla Erbjudanden');
  const { session } = useSession();
  const navigate = useNavigate();

  // Handle scroll background effect
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
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors ${showBg ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and hamburger menu */}
          <div className="flex items-center gap-4">
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
            <Logo variant="default" />
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
            />

            <DashboardLink 
              hasDashboard={hasDashboard}
              dashboardPath={dashboardPath}
              userRole={userRole}
            />

            <UserMenu 
              session={session}
              hasDashboard={hasDashboard}
              dashboardPath={dashboardPath}
              userRole={userRole}
            />

            {/* Mobile search */}
            <div className="flex md:hidden">
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
