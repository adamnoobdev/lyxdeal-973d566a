
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "@/types/deal";

export const useDeals = (category?: string, city?: string) => {
  return useQuery({
    queryKey: ["deals", category, city],
    queryFn: async () => {
      try {
        let query = supabase
          .from("deals")
          .select("*")
          .order("created_at", { ascending: false });

        if (category && category !== "Alla Erbjudanden") {
          query = query.eq("category", category);
        }

        if (city && city !== "Alla Städer") {
          query = query.eq("city", city);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching deals:", error);
          toast.error("Kunde inte hämta erbjudanden. Försök igen senare.");
          throw error;
        }

        return data as Deal[];
      } catch (error) {
        console.error("Unexpected error in useDeals:", error);
        toast.error("Ett oväntat fel uppstod. Försök igen senare.");
        throw error;
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minuter cache
    refetchOnWindowFocus: false,
  });
};
