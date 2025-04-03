
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CITIES, City } from "@/constants/app-constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CityFilterProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

export function CityFilter({ selectedCity, onCitySelect }: CityFilterProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Städer</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedCity} 
          onValueChange={onCitySelect}
          className="space-y-2"
        >
          {CITIES.map((city) => (
            <div key={city} className="flex items-center space-x-2">
              <RadioGroupItem value={city} id={`city-${city}`} />
              <Label 
                htmlFor={`city-${city}`}
                className="cursor-pointer"
              >
                {city}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
