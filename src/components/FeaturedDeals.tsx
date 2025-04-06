
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { ResponsiveGrid } from "./common/ResponsiveGrid";

export function FeaturedDeals() {
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['featuredDeals'],
    queryFn: async () => {
      console.log('Starting featured deals fetch...');
      try {
        console.log('Executing featured deals query...');
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
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching featured deals:', error);
          console.error('Error details:', error.message, error.details, error.hint);
          throw error;
        }

        // Transformera data för att lägga till salon_rating
        const processedData = data.map(deal => {
          return {
            ...deal,
            salon_rating: deal.salons?.rating || null
          };
        });
        
        console.log('Featured deals fetch successful. Number of deals:', processedData?.length);
        if (processedData && processedData.length > 0) {
          console.log('First featured deal:', processedData[0]);
        } else {
          console.log('No featured deals found in database');
        }
        
        return processedData as Deal[];
      } catch (error) {
        console.error('Unexpected error in featured deals:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
        }
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <ResponsiveGrid columns="grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" gap="gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 sm:h-48 bg-accent/50 rounded-xl animate-pulse" />
        ))}
      </ResponsiveGrid>
    );
  }

  if (error) {
    console.error('Featured deals error:', error);
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att hämta utvalda erbjudanden. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }

  if (!deals?.length) {
    console.log('No featured deals found');
    return null;
  }

  console.log('Rendering featured deals:', deals);
  return (
    <ResponsiveGrid columns="grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" gap="gap-2">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
          className="h-full"
          compact={true}
        />
      ))}
    </ResponsiveGrid>
  );
}
