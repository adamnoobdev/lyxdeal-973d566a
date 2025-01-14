import { Star, Sparkles, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FeaturedDeals } from "@/components/home/featured/FeaturedDeals";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals } from "@/hooks/useDeals";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

export function DealsSection({ selectedCategory, selectedCity }: DealsSectionProps) {
  const { data: deals, isLoading, error } = useDeals(selectedCategory, selectedCity);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Utvalda erbjudanden</h2>
        </div>
        <FeaturedDeals />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Alla erbjudanden</h2>
        </div>
        
        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det gick inte att hämta erbjudanden. Försök igen senare.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-96 bg-accent/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <DealsGrid deals={deals} />
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
}