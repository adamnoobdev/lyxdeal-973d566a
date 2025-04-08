
import { Star, Sparkles, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals } from "@/hooks/useDeals";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

export function DealsSection({ selectedCategory, selectedCity }: DealsSectionProps) {
  const { data: deals, isLoading, error } = useDeals(selectedCategory, selectedCity);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold">Utvalda erbjudanden</h2>
        </div>
        <FeaturedDeals />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold">Alla erbjudanden</h2>
        </div>
        
        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det gick inte att hämta erbjudanden. Försök igen senare.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-44 bg-accent/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <DealsGrid deals={deals} scrollable={true} compact={true} />
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Inga erbjudanden hittades.
          </p>
        )}
      </section>
    </div>
  );
}
