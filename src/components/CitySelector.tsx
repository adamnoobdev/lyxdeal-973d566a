
import { useNavigate, useSearchParams } from "react-router-dom";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, ChevronDown } from "lucide-react";
import { useCityDealsData } from "@/hooks/useCityDealsData";

interface CitySelectorProps {
  currentCity: string;
  onCitySelect: (city: string) => void;
  variant?: "desktop" | "mobile";
}

const CitySelectorComponent = ({ 
  currentCity, 
  onCitySelect,
  variant = "desktop" 
}: CitySelectorProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orderedCities, isLoading } = useCityDealsData("Alla Erbjudanden", currentCity);
  
  // Always include "Alla Städer" as the first option
  const citiesToDisplay = ["Alla Städer", ...orderedCities.filter(city => city !== "Alla Städer")];

  const handleCitySelect = (city: string) => {
    onCitySelect(city);
    
    // Always navigate to search page with the selected city
    if (city !== "Alla Städer") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('city', city);
      navigate(`/search?${newParams.toString()}`);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('city');
      navigate(`/search?${newParams.toString()}`);
    }
  };

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1">
        {citiesToDisplay.map((city) => (
          <Button
            key={city}
            variant="ghost"
            className="w-full justify-start gap-3 h-10 font-medium"
            onClick={() => handleCitySelect(city)}
          >
            <MapPin className="h-4 w-4" />
            <span>{city}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-sm font-medium hover:bg-accent flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          {currentCity}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-2 bg-white"
      >
        {citiesToDisplay.map((city) => (
          <DropdownMenuItem
            key={city}
            onClick={() => handleCitySelect(city)}
            className="flex items-center gap-3 py-2 px-3 cursor-pointer rounded-md"
          >
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{city}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const CitySelector = memo(CitySelectorComponent);
