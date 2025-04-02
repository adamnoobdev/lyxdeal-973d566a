
import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CITIES } from "@/constants/app-constants";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface CitiesProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

const CitiesComponent = ({ selectedCity, onSelectCity }: CitiesProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSearchPage = window.location.pathname === "/search";

  const handleCityClick = (city: string) => {
    onSelectCity(city);
    const category = searchParams.get('category') || '';
    
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

  return (
    <div className={`relative ${isSearchPage ? 'mx-0' : '-mx-4 md:mx-0'}`}>
      <div className="flex flex-wrap gap-2 px-4 pb-4 justify-center">
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
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
