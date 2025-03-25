
import { Star, MapPin, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals } from "@/hooks/useDeals";
import { memo, useState } from "react";
import { CITIES } from "@/constants/app-constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

const DealsSectionComponent = ({ selectedCategory, selectedCity }: DealsSectionProps) => {
  const [activeCity, setActiveCity] = useState<string>(selectedCity !== "Alla Städer" ? selectedCity : "Stockholm");
  const { data: deals, isLoading, error } = useDeals(selectedCategory, activeCity);

  return (
    <div className="space-y-8 md:space-y-12 px-4 md:px-0">
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-semibold">Skönhetserbjudanden efter stad</h2>
        </div>
        
        <Tabs defaultValue={activeCity} onValueChange={setActiveCity} className="w-full">
          <TabsList className="w-full flex flex-wrap gap-2 mb-6 justify-center">
            {CITIES.filter(city => city !== "Alla Städer").map((city) => (
              <TabsTrigger 
                key={city} 
                value={city}
                className="px-4 py-2 whitespace-nowrap"
              >
                {city}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {CITIES.filter(city => city !== "Alla Städer").map((city) => (
            <TabsContent key={city} value={city} className="mt-0">
              {error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Det gick inte att hämta erbjudanden. Försök igen senare.
                  </AlertDescription>
                </Alert>
              ) : isLoading && activeCity === city ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-48 md:h-64 bg-accent/5 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : deals && deals.length > 0 && activeCity === city ? (
                <DealsGrid deals={deals} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Inga erbjudanden hittades i {city}.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export const DealsSection = memo(DealsSectionComponent);
