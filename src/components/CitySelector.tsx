import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MapPin } from "lucide-react";

const cities = [
  "Alla Städer",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Linköping"
];

interface CitySelectorProps {
  currentCity: string;
  onCitySelect: (city: string) => void;
}

export const CitySelector = ({ currentCity, onCitySelect }: CitySelectorProps) => {
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
        className="w-56 p-2"
      >
        {cities.map((city) => (
          <DropdownMenuItem
            key={city}
            onClick={() => onCitySelect(city)}
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