
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
  // Get all cities to check which ones have deals
  const { data: allDeals, isLoading: isLoadingAllDeals } = useDeals(
    selectedCategory === "Alla Erbjudanden" ? undefined : selectedCategory, 
    "Alla Städer"
  );
  
  // Create a list of cities that have active deals
  const citiesWithDeals = useMemo(() => {
    if (!allDeals) return [];
    
    // Get unique cities from deals
    const uniqueCities = [...new Set(allDeals.map(deal => deal.city))];
    
    // Return cities in the order they appear in the CITIES constant
    // but only include cities that have deals
    return CITIES.filter(city => 
      city === "Alla Städer" || uniqueCities.includes(city)
    );
  }, [allDeals]);

  // Determine which cities to show and in what order
  const orderedCities = useMemo(() => {
    if (isLoadingAllDeals) {
      // During loading, show a subset of cities to prevent layout jumps
      return selectedCity !== "Alla Städer" 
        ? [selectedCity] 
        : CITIES.filter(city => city !== "Alla Städer").slice(0, 3);
    }
    
    if (selectedCity !== "Alla Städer") {
      // If a specific city is selected, show it first, followed by other cities with deals
      return [
        selectedCity,
        ...citiesWithDeals.filter(city => 
          city !== "Alla Städer" && city !== selectedCity
        )
      ];
    }
    
    // Default: show all cities with deals except "Alla Städer"
    return citiesWithDeals.filter(city => city !== "Alla Städer");
  }, [selectedCity, citiesWithDeals, isLoadingAllDeals]);

  if (isLoadingAllDeals) {
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
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 md:h-64 bg-accent/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
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
