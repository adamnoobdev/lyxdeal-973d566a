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
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-2 px-4 justify-center">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              onClick={() => onSelectCity(city)}
              className={`${
                selectedCity === city ? "bg-primary" : ""
              } flex-shrink-0 text-xs py-2 px-4 h-8`}
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