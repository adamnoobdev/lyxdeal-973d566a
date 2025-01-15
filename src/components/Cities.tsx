import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CITIES } from "@/constants/app-constants";
import { MapPin } from "lucide-react";

interface CitiesProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

const CitiesComponent = ({ selectedCity, onSelectCity }: CitiesProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    <div className="relative -mx-4 md:mx-0">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full gap-3 px-4 pb-4 justify-start md:justify-center">
          {CITIES.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              onClick={() => handleCityClick(city)}
              className={`
                group relative overflow-hidden min-w-[140px]
                ${selectedCity === city 
                  ? "bg-primary hover:bg-primary/90 shadow-lg" 
                  : "hover:bg-primary/20 border-primary/20"}
                h-10 px-4 transition-all duration-300
                hover:shadow-md active:scale-95
              `}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{city}</span>
              </span>
              {selectedCity === city && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gradient" />
              )}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
};

export const Cities = memo(CitiesComponent);