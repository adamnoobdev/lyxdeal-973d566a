import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CITIES } from "@/constants/app-constants";

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
        <div className="flex w-full gap-2 md:gap-3 px-4 pb-2 justify-start md:justify-center">
          {CITIES.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              onClick={() => handleCityClick(city)}
              className={`
                ${selectedCity === city ? "bg-primary shadow-md" : "hover:bg-accent"}
                flex-shrink-0 text-xs md:text-sm py-1.5 px-3 md:px-4 h-8 transition-all duration-300
                hover:shadow-md active:scale-95
              `}
            >
              {city}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
};

export const Cities = memo(CitiesComponent);