import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

export function FeaturedDeals() {
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['featuredDeals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deal[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att hämta utvalda erbjudanden. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }

  if (!deals?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
          quantityLeft={deal.quantity_left}
        />
      ))}
    </div>
  );
}