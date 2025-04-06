
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
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Utvalda erbjudanden</h2>
        </div>
        <FeaturedDeals />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Alla erbjudanden</h2>
        </div>
        
        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det gick inte att hämta erbjudanden. Försök igen senare.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 sm:h-72 bg-accent/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <DealsGrid deals={deals} scrollable={true} />
        ) : (
          <p className="text-center text-muted-foreground py-6">
            Inga erbjudanden hittades.
          </p>
        )}
      </section>
    </div>
  );
}
