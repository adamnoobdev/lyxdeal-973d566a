import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "@/types/deal";

export const useDeals = (category?: string, city?: string) => {
  return useQuery({
    queryKey: ["deals", category, city],
    queryFn: async () => {
      console.log('Fetching deals with category:', category, 'and city:', city);
      
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
          throw error;
        }

        console.log('Fetched deals:', data?.length || 0, 'results');
        return data as Deal[];
      } catch (error) {
        console.error("Unexpected error:", error);
        throw error;
      }
    },
    retry: 1,
  });
};

export const useFeaturedDeals = () => {
  return useQuery({
    queryKey: ["featuredDeals"],
    queryFn: async () => {
      console.log('Fetching featured deals');
      
      try {
        const { data, error } = await supabase
          .from("deals")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching featured deals:", error);
          throw error;
        }

        console.log('Fetched featured deals:', data?.length || 0, 'results');
        return data as Deal[];
      } catch (error) {
        console.error("Unexpected error:", error);
        throw error;
      }
    },
    retry: 1,
  });
};