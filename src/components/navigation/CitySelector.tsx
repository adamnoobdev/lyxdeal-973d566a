
import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { City, CITIES } from '@/constants/app-constants';

interface CitySelectorProps {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  setSelectedCity
}) => {
  return (
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
  );
};

export default CitySelector;
