import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const cities = [
  "Alla Städer",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Linköping"
];

interface CitiesProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export function Cities({ selectedCity, onSelectCity }: CitiesProps) {
  return (
    <ScrollArea className="w-full pb-4">
      <div className="mb-8 flex gap-2 px-4 md:px-0">
        {cities.map((city) => (
          <Button
            key={city}
            variant={selectedCity === city ? "default" : "outline"}
            onClick={() => onSelectCity(city)}
            className={`${
              selectedCity === city ? "bg-primary" : ""
            } whitespace-nowrap`}
          >
            {city}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}