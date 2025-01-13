import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { DealCard } from "../DealCard";
import { Sparkles } from "lucide-react";

interface RelatedDealsProps {
  currentDealId: number;
  category: string;
}

export function RelatedDeals({ currentDealId, category }: RelatedDealsProps) {
  const { data: relatedDeals, isLoading } = useQuery({
    queryKey: ['relatedDeals', currentDealId],
    queryFn: async () => {
      console.log('Fetching related deals');
      
      // First try to get some deals from the same category
      const { data: categoryDeals } = await supabase
        .from('deals')
        .select('*')
        .eq('category', category)
        .neq('id', currentDealId)
        .limit(3)
        .order('created_at', { ascending: false });

      // Then get other popular deals from different categories
      const { data: otherDeals } = await supabase
        .from('deals')
        .select('*')
        .neq('category', category)
        .neq('id', currentDealId)
        .limit(5)
        .order('created_at', { ascending: false });

      // Combine and shuffle the results
      const allDeals = [...(categoryDeals || []), ...(otherDeals || [])];
      const shuffledDeals = allDeals
        .sort(() => Math.random() - 0.5)
        .slice(0, 6); // Show up to 6 deals

      return shuffledDeals as Deal[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-accent/10 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!relatedDeals?.length) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Fler erbjudanden
        </h2>
      </div>
      <div className="grid gap-4">
        {relatedDeals.map((deal) => (
          <DealCard key={deal.id} {...deal} />
        ))}
      </div>
    </div>
  );
}