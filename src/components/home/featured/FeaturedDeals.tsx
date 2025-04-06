
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealCard } from "@/components/DealCard";
import { Deal } from "@/types/deal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ResponsiveGrid } from "@/components/common/ResponsiveGrid";
import { memo } from "react";

const FeaturedDealsComponent = () => {
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['featuredDeals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            rating,
            name
          )
        `)
        .eq('featured', true)
        .eq('is_active', true) // Endast aktiva erbjudanden
        .order('created_at', { ascending: false })
        .limit(8); // Begränsa antal för bättre prestanda

      if (error) throw error;
      
      // Transformera data för att lägga till salon_rating
      const processedData = data.map(deal => {
        return {
          ...deal,
          salon_rating: deal.salons?.rating || null
        };
      });
      
      return processedData as Deal[];
    },
    staleTime: 5 * 60 * 1000, // Cache data för 5 minuter
  });

  if (isLoading) {
    return (
      <ResponsiveGrid>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-accent/50 rounded-xl animate-pulse" />
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
};

export const FeaturedDeals = memo(FeaturedDealsComponent);
