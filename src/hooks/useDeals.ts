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
        // First, check if we can connect to Supabase
        const { data: connectionTest, error: connectionError } = await supabase
          .from('deals')
          .select('count')
          .single();
          
        if (connectionError) {
          console.error('Supabase connection error:', {
            error: connectionError,
            errorCode: connectionError.code,
            details: connectionError.details,
            hint: connectionError.hint
          });
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
        const { data, error, status, statusText } = await query
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching deals:", {
            error,
            errorCode: error.code,
            details: error.details,
            hint: error.hint,
            status,
            statusText
          });
          throw error;
        }

        // Log successful response
        console.log('Deals fetch successful:', {
          totalDeals: data?.length || 0,
          firstDeal: data?.[0],
          status,
          statusText,
          filters: { category, city }
        });

        return data as Deal[];
      } catch (error) {
        console.error('Unexpected error in useDeals:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        toast.error("Kunde inte hämta erbjudanden. Försök igen senare.");
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return !message.includes('auth') && failureCount < 3;
      }
      return failureCount < 3;
    },
  });
};

export const useFeaturedDeals = () => {
  return useQuery({
    queryKey: ["featured-deals"],
    queryFn: async () => {
      console.log('Starting featured deals fetch');
      
      try {
        const { data, error, status, statusText } = await supabase
          .from("deals")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching featured deals:", {
            error,
            errorCode: error.code,
            details: error.details,
            hint: error.hint,
            status,
            statusText
          });
          throw error;
        }

        console.log('Featured deals fetch successful:', {
          totalDeals: data?.length || 0,
          firstDeal: data?.[0],
          status,
          statusText
        });

        return data as Deal[];
      } catch (error) {
        console.error('Unexpected error in useFeaturedDeals:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        toast.error("Kunde inte hämta utvalda erbjudanden");
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return !message.includes('auth') && failureCount < 3;
      }
      return failureCount < 3;
    },
  });
};