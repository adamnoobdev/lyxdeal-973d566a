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
    queryKey: ['relatedDeals', category, currentDealId],
    queryFn: async () => {
      console.log('Fetching related deals for category:', category);
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('category', category)
        .neq('id', currentDealId)
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching related deals:', error);
        throw error;
      }

      return data as Deal[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(4)].map((_, i) => (
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
          Liknande erbjudanden
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