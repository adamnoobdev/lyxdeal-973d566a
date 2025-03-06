
import { Star, Sparkles, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FeaturedDeals } from "@/components/home/featured/FeaturedDeals";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals } from "@/hooks/useDeals";
import { memo } from "react";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

const DealsSectionComponent = ({ selectedCategory, selectedCity }: DealsSectionProps) => {
  const { data: deals, isLoading, error } = useDeals(selectedCategory, selectedCity);

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2 px-4 md:px-0">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-semibold">Utvalda erbjudanden</h2>
        </div>
        <FeaturedDeals />
      </section>

      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2 px-4 md:px-0">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-semibold">Alla erbjudanden</h2>
        </div>
        
        {error ? (
          <Alert variant="destructive" className="mx-4 md:mx-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det gick inte att hämta erbjudanden. Försök igen senare.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-0">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="h-64 bg-accent/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <div className="px-4 md:px-0">
            <DealsGrid deals={deals} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Inga erbjudanden hittades.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export const DealsSection = memo(DealsSectionComponent);
