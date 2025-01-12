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
    <div className="space-y-12 animate-fade-up">
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Utvalda erbjudanden</h2>
        </div>
        <FeaturedDeals />
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Alla erbjudanden</h2>
        </div>
        
        {error ? (
          <Alert variant="destructive" className="animate-fade-up">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det gick inte att hämta erbjudanden. Försök igen senare.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-96 bg-accent/5 rounded-xl animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-48 bg-accent/10 rounded-t-xl" />
                <div className="p-4 space-y-4">
                  <div className="h-4 w-2/3 bg-accent/10 rounded" />
                  <div className="h-4 w-1/2 bg-accent/10 rounded" />
                  <div className="h-4 w-3/4 bg-accent/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <DealsGrid deals={deals} />
        ) : (
          <div className="text-center py-12 bg-accent/5 rounded-xl animate-fade-up">
            <p className="text-muted-foreground">
              Inga erbjudanden hittades.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}