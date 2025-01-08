import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const cities = [
  "Alla Städer",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Linköping",
];

interface CitiesProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export function Cities({ selectedCity, onSelectCity }: CitiesProps) {
  return (
    <div className="relative mb-6 -mx-4 md:mx-0">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full gap-3 px-4 pb-2 justify-start md:justify-center">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              onClick={() => onSelectCity(city)}
              className={`
                ${selectedCity === city ? "bg-primary shadow-md" : "hover:bg-accent"}
                flex-shrink-0 text-xs py-1.5 px-4 h-8 transition-all duration-300
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
}