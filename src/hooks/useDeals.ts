import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "@/types/deal";

export const useDeals = (category?: string, city?: string) => {
  return useQuery({
    queryKey: ["deals", category, city],
    queryFn: async () => {
      console.log('Starting deals fetch with filters:', { category, city });
      try {
        let query = supabase
          .from("deals")
          .select("*")
          .order("created_at", { ascending: false });

        if (category && category !== "Alla Erbjudanden") {
          console.log('Applying category filter:', category);
          query = query.eq("category", category);
        }

        if (city && city !== "Alla Städer") {
          console.log('Applying city filter:', city);
          query = query.eq("city", city);
        }

        console.log('Executing query...');
        const { data, error } = await query;

        if (error) {
          console.error("Error fetching deals:", error);
          console.error("Error details:", error.message, error.details, error.hint);
          toast.error("Kunde inte hämta erbjudanden. Försök igen senare.");
          throw error;
        }

        console.log('Raw response:', data);
        console.log('Deals fetch successful. Number of deals:', data?.length);
        if (data && data.length > 0) {
          console.log('First deal:', data[0]);
          console.log('All deals:', data);
        } else {
          console.log('No deals found in database');
        }

        return data as Deal[];
      } catch (error) {
        console.error("Unexpected error in useDeals:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message, error.stack);
        }
        toast.error("Ett oväntat fel uppstod. Försök igen senare.");
        throw error;
      }
    },
    retry: 1,
  });
};