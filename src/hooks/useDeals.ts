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
        .select("*");

      if (category) {
        console.log('Applying category filter:', category);
        query = query.eq("category", category);
      }

      if (city) {
        console.log('Applying city filter:', city);
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching deals:", error);
        throw error;
      }

      console.log('Deals fetched successfully:', {
        totalDeals: data?.length || 0,
        deals: data
      });
      
      return data as Deal[];
    },
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

      console.log('Featured deals fetched:', {
        totalDeals: data?.length || 0,
        deals: data
      });
      
      return data as Deal[];
    },
  });
};