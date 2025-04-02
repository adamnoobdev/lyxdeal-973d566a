
import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { City, CITIES } from '@/constants/app-constants';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    
    // Navigate to search page with the selected city
    if (city !== "Alla Städer") {
      navigate(`/search?city=${city}`);
    } else {
      navigate('/search');
    }
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
