
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { DealCard } from "../DealCard";
import { Sparkles } from "lucide-react";
import { ResponsiveGrid } from "../common/ResponsiveGrid";
import { memo } from "react";

interface RelatedDealsProps {
  currentDealId: number;
  category: string;
  city: string;
  salonRating?: number | null;
  compact?: boolean;
}

const RelatedDealsComponent = ({ currentDealId, category, city, salonRating, compact = true }: RelatedDealsProps) => {
  const { data: relatedDeals, isLoading } = useQuery({
    queryKey: ['relatedDeals', currentDealId, category],
    queryFn: async () => {
      // Först hämta några erbjudanden från samma kategori
      const { data: categoryDeals } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            rating,
            name
          )
        `)
        .eq('category', category)
        .neq('id', currentDealId)
        .limit(3)
        .order('created_at', { ascending: false });

      // Sedan några populära erbjudanden från andra kategorier
      const { data: otherDeals } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            rating,
            name
          )
        `)
        .neq('category', category)
        .neq('id', currentDealId)
        .limit(3)
        .order('created_at', { ascending: false });

      // Kombinera och transformera resultaten
      const combinedDeals = [
        ...(categoryDeals || []).map(deal => ({
          ...deal,
          salon_rating: deal.salons?.rating || null
        })),
        ...(otherDeals || []).map(deal => ({
          ...deal,
          salon_rating: deal.salons?.rating || null
        }))
      ].slice(0, 6);
      
      return combinedDeals as Deal[];
    },
    staleTime: 5 * 60 * 1000, // Cache i 5 minuter
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-44 bg-accent/10 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!relatedDeals?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-bold">Fler erbjudanden</h2>
      </div>
      <ResponsiveGrid>
        {relatedDeals.map((deal) => (
          <DealCard key={deal.id} {...deal} compact={true} />
        ))}
      </ResponsiveGrid>
    </div>
  );
};

export const RelatedDeals = memo(RelatedDealsComponent);
