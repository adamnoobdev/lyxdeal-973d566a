
import { MapPin, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { memo, useMemo } from "react";
import { CITIES } from "@/constants/app-constants";
import { CityDeals } from "./CityDeals";
import { useCityDealsData } from "@/hooks/useCityDealsData";

interface CityDealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

const CityDealsSectionComponent = ({
  selectedCategory,
  selectedCity
}: CityDealsSectionProps) => {
  // Create a list of cities that have active deals
  const { isLoading, orderedCities, citiesWithDeals } = useCityDealsData(selectedCategory, selectedCity);

  if (isLoading) {
    return <CityDealsSectionLoading selectedCity={selectedCity} />;
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-semibold">Skönhetserbjudanden efter stad</h2>
        </div>
        
        {orderedCities.length > 0 ? (
          <div className="space-y-12">
            {orderedCities.map(city => (
              <div key={city} className="space-y-4">
                <h3 className="text-lg md:text-xl font-medium border-b pb-2">
                  {city}
                  {city === selectedCity && selectedCity !== "Alla Städer" && (
                    <span className="ml-2 text-primary font-normal text-sm">(Vald stad)</span>
                  )}
                </h3>
                
                <CityDeals city={city} selectedCategory={selectedCategory} />
              </div>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              Inga erbjudanden hittades för de valda filtren.
            </AlertDescription>
          </Alert>
        )}
      </section>
    </div>
  );
};

// Loading state component for CityDealsSection
const CityDealsSectionLoading = memo(({ selectedCity }: { selectedCity: string }) => {
  const orderedCities = useMemo(() => {
    return selectedCity !== "Alla Städer" 
      ? [selectedCity] 
      : CITIES.filter(city => city !== "Alla Städer").slice(0, 3);
  }, [selectedCity]);

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-semibold">Skönhetserbjudanden efter stad</h2>
        </div>
        
        <div className="space-y-12">
          {orderedCities.map(city => (
            <div key={city} className="space-y-4">
              <h3 className="text-lg md:text-xl font-medium border-b pb-2">
                {city}
                {city === selectedCity && selectedCity !== "Alla Städer" && (
                  <span className="ml-2 text-primary font-normal text-sm">(Vald stad)</span>
                )}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 md:h-64 lg:h-72 bg-accent/5 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export const CityDealsSection = memo(CityDealsSectionComponent);
