import { Button } from "@/components/ui/button";

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
    <div className="mb-8 flex flex-wrap gap-2">
      {cities.map((city) => (
        <Button
          key={city}
          variant={selectedCity === city ? "default" : "outline"}
          onClick={() => onSelectCity(city)}
          className={selectedCity === city ? "bg-primary" : ""}
        >
          {city}
        </Button>
      ))}
    </div>
  );
}