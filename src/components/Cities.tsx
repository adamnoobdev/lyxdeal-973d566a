
import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CITIES } from "@/constants/app-constants";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useCityDealsData } from "@/hooks/useCityDealsData";

interface CitiesProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedCategory?: string;
}

const CitiesComponent = ({ 
  selectedCity, 
  onSelectCity, 
  selectedCategory = "Alla Erbjudanden" 
}: CitiesProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSearchPage = window.location.pathname === "/search";

  // Use the hook to get cities with active deals
  const { orderedCities, isLoading } = useCityDealsData(selectedCategory, selectedCity);
  
  // Always include "Alla Städer" as the first option
  const citiesToDisplay = ["Alla Städer", ...orderedCities.filter(city => city !== "Alla Städer")];

  const handleCityClick = (city: string) => {
    onSelectCity(city);
    
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

  if (isLoading) {
    return (
      <div className={`relative ${isSearchPage ? 'mx-0' : '-mx-4 md:mx-0'}`}>
        <div className="flex flex-wrap gap-2 px-4 pb-4 justify-center">
          {["Alla Städer", ...CITIES.filter(city => city !== "Alla Städer").slice(0, 3)].map((city) => (
            <div
              key={city}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-accent/20 animate-pulse h-5 w-16"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isSearchPage ? 'mx-0' : '-mx-4 md:mx-0'}`}>
      <div className="flex flex-wrap gap-2 px-4 pb-4 justify-center">
        {citiesToDisplay.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
              "shadow-sm hover:shadow-md active:scale-95",
              selectedCity === city 
                ? "bg-primary text-white border-transparent"
                : "bg-white text-primary/90 border border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            <MapPin className="w-3 h-3" />
            <span>{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const Cities = memo(CitiesComponent);
