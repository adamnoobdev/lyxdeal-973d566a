
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
}

const RelatedDealsComponent = ({ currentDealId, category, city, salonRating }: RelatedDealsProps) => {
  const { data: relatedDeals, isLoading } = useQuery({
    queryKey: ['relatedDeals', currentDealId, category],
    queryFn: async () => {
      // Först hämta några erbjudanden från samma kategori
      const { data: categoryDeals } = await supabase
        .from('deals')
        .select('*')
        .eq('category', category)
        .neq('id', currentDealId)
        .limit(3)
        .order('created_at', { ascending: false });

      // Sedan några populära erbjudanden från andra kategorier
      const { data: otherDeals } = await supabase
        .from('deals')
        .select('*')
        .neq('category', category)
        .neq('id', currentDealId)
        .limit(3)
        .order('created_at', { ascending: false });

      // Kombinera resultaten
      return [...(categoryDeals || []), ...(otherDeals || [])].slice(0, 6) as Deal[];
    },
    staleTime: 5 * 60 * 1000, // Cache i 5 minuter
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-accent/10 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!relatedDeals?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Fler erbjudanden</h2>
      </div>
      <ResponsiveGrid>
        {relatedDeals.map((deal) => (
          <DealCard key={deal.id} {...deal} />
        ))}
      </ResponsiveGrid>
    </div>
  );
};

export const RelatedDeals = memo(RelatedDealsComponent);
