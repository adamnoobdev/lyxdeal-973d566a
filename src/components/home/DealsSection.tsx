import { Sparkles, Star } from "lucide-react";
import { DealsGrid } from "../DealsGrid";
import { FeaturedDeals } from "../FeaturedDeals";
import { Deal } from "@/types/deal";

interface DealsSectionProps {
  deals: Deal[] | undefined;
  isLoading: boolean;
}

export const DealsSection = ({ deals, isLoading }: DealsSectionProps) => {
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          deals && <DealsGrid deals={deals} />
        )}
      </section>
    </div>
  );
};