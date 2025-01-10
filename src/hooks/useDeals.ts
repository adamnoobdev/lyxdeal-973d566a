import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";

export const useDeals = (category?: string, city?: string) => {
  return useQuery({
    queryKey: ["deals", category, city],
    queryFn: async () => {
      console.log('Starting deals fetch with filters:', { category, city });
      
      let query = supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      // Only apply category filter if it's not "Alla Erbjudanden"
      if (category && category !== "Alla Erbjudanden") {
        console.log('Applying category filter:', category);
        query = query.eq("category", category);
      }

      // Only apply city filter if it's not "Alla Städer"
      if (city && city !== "Alla Städer") {
        console.log('Applying city filter:', city);
        query = query.eq("city", city);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching deals:", error);
        throw error;
      }

      console.log('Deals fetched successfully:', data?.length || 0, 'results');
      return data as Deal[];
    },
    retry: 1,
  });
};

export const useFeaturedDeals = () => {
  return useQuery({
    queryKey: ["featuredDeals"],
    queryFn: async () => {
      console.log('Fetching featured deals');
      
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching featured deals:", error);
        throw error;
      }

      console.log('Featured deals fetched:', data?.length || 0, 'results');
      return data as Deal[];
    },
    retry: 1,
  });
};