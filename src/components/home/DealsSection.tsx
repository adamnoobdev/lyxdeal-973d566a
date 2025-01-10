import { Sparkles, Star } from "lucide-react";
import { DealsGrid } from "../DealsGrid";
import { FeaturedDeals } from "../FeaturedDeals";
import { Deal } from "@/types/deal";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle } from "lucide-react";

interface DealsSectionProps {
  deals: Deal[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const DealsSection = ({ deals, isLoading, error }: DealsSectionProps) => {
  return (
    <div className="space-y-12">
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Utvalda erbjudanden</h2>
        </div>
        <FeaturedDeals />
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Alla erbjudanden</h2>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det gick inte att hämta erbjudanden. Försök igen senare.
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <DealsGrid deals={deals} />
        ) : (
          <Alert>
            <AlertDescription>
              Inga erbjudanden hittades med valda filter.
            </AlertDescription>
          </Alert>
        )}
      </section>
    </div>
  );
};