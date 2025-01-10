import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealCard } from "@/components/DealCard";
import { Deal } from "@/types/deal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ResponsiveGrid } from "@/components/common/ResponsiveGrid";

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
      <ResponsiveGrid>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
        ))}
      </ResponsiveGrid>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att hämta utvalda erbjudanden. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }

  if (!deals?.length) {
    return null;
  }

  return (
    <ResponsiveGrid>
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
        />
      ))}
    </ResponsiveGrid>
  );
}