
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { Sparkles } from "lucide-react";
import { DealsGrid } from "../DealsGrid";

interface ProductRelatedDealsProps {
  currentDealId: number;
  category: string;
  city: string;
  salonRating?: number | null;
}

export const ProductRelatedDeals = ({ currentDealId, category, city, salonRating }: ProductRelatedDealsProps) => {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-accent/10 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!relatedDeals?.length) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Andra som såg på denna deal tittade även på</h2>
      </div>
      <DealsGrid deals={relatedDeals} scrollable={true} compact={true} />
    </div>
  );
};
