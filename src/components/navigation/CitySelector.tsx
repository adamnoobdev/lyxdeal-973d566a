
import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { City, CITIES } from '@/constants/app-constants';
import { useLocation, useNavigate } from 'react-router-dom';

interface CitySelectorProps {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  setSelectedCity,
  className = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    
    // If we're on the homepage, stay there but with the updated city
    if (location.pathname === '/') {
      // City selection is handled by state update, no navigation needed
      return;
    }
    
    // If we're on another page, navigate to the homepage with the selected city
    navigate('/', { state: { selectedCity: city } });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`hidden md:inline-flex ${className}`}>
          <MapPin className="mr-1 h-4 w-4" /> {selectedCity} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-white">
        {CITIES.map(city => (
          <DropdownMenuItem 
            key={city} 
            onClick={() => handleCitySelect(city)}
            className="cursor-pointer"
          >
            {city}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CitySelector;
