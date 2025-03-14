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
      console.log('Starting featured deals fetch...');
      try {
        console.log('Executing featured deals query...');
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching featured deals:', error);
          console.error('Error details:', error.message, error.details, error.hint);
          throw error;
        }

        console.log('Raw featured deals response:', data);
        console.log('Featured deals fetch successful. Number of deals:', data?.length);
        if (data && data.length > 0) {
          console.log('First featured deal:', data[0]);
          console.log('All featured deals:', data);
        } else {
          console.log('No featured deals found in database');
        }
        
        return data as Deal[];
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
        ))}
      </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
        />
      ))}
    </div>
  );
}