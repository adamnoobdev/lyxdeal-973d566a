
import { MapPin, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals } from "@/hooks/useDeals";
import { memo, useMemo } from "react";
import { CITIES } from "@/constants/app-constants";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

const DealsSectionComponent = ({
  selectedCategory,
  selectedCity
}: DealsSectionProps) => {
  // Determine which cities to show and in what order
  const orderedCities = useMemo(() => {
    if (selectedCity !== "Alla Städer") {
      // Put the selected city first, then the rest (excluding "Alla Städer")
      return [
        selectedCity,
        ...CITIES.filter(city => city !== "Alla Städer" && city !== selectedCity)
      ];
    }
    // Default order: all cities except "Alla Städer"
    return CITIES.filter(city => city !== "Alla Städer");
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
              
              <CityDeals city={city} selectedCategory={selectedCategory} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Separerar ut staden och dess erbjudanden till en egen komponent
interface CityDealsProps {
  city: string;
  selectedCategory: string;
}

const CityDeals = memo(({
  city,
  selectedCategory
}: CityDealsProps) => {
  const {
    data: deals,
    isLoading,
    error
  } = useDeals(selectedCategory, city);
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att hämta erbjudanden för {city}. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 md:h-64 bg-accent/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }
  
  if (!deals || deals.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          Inga erbjudanden hittades i {city}.
        </p>
      </div>
    );
  }
  
  return <DealsGrid deals={deals} />;
});

export const DealsSection = memo(DealsSectionComponent);
