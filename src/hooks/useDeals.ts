import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Deal } from "@/types/deal";

export const useDeals = (category?: string, city?: string) => {
  return useQuery({
    queryKey: ["deals", category, city],
    queryFn: async () => {
      console.log('Starting deals fetch with filters:', { category, city });
      
      try {
        // Test connection to Supabase
        console.log('Testing Supabase connection...');
        const { data: connectionTest, error: connectionError } = await supabase
          .from('deals')
          .select('count')
          .single();
          
        if (connectionError) {
          console.error('Supabase connection test failed:', connectionError);
          toast.error(`Det gick inte att ansluta till databasen: ${connectionError.message}`);
          throw new Error(`Database connection failed: ${connectionError.message}`);
        }
        
        console.log('Connection test successful:', connectionTest);

        // Build the query
        let query = supabase
          .from("deals")
          .select("*");

        if (category && category !== "Alla Erbjudanden") {
          console.log('Applying category filter:', category);
          query = query.eq("category", category);
        }

        if (city && city !== "Alla Städer") {
          console.log('Applying city filter:', city);
          query = query.eq("city", city);
        }

        // Execute the query
        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching deals:", error);
          toast.error("Det gick inte att hämta erbjudanden. Försök igen senare.");
          throw error;
        }

        console.log('Deals fetch successful:', {
          totalDeals: data?.length || 0,
          firstDeal: data?.[0],
          filters: { category, city }
        });

        return data || [];
      } catch (error) {
        console.error('Unexpected error in useDeals:', error);
        toast.error("Det gick inte att hämta erbjudanden. Försök igen senare.");
        throw error;
      }
    },
  });
};

export const useFeaturedDeals = () => {
  return useQuery({
    queryKey: ["featured-deals"],
    queryFn: async () => {
      console.log('Starting featured deals fetch');
      
      try {
        const { data, error } = await supabase
          .from("deals")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching featured deals:", error);
          toast.error("Det gick inte att hämta utvalda erbjudanden");
          throw error;
        }

        console.log('Featured deals fetch successful:', {
          totalDeals: data?.length || 0,
          firstDeal: data?.[0]
        });

        return data || [];
      } catch (error) {
        console.error('Unexpected error in useFeaturedDeals:', error);
        toast.error("Det gick inte att hämta utvalda erbjudanden");
        throw error;
      }
    },
  });
};