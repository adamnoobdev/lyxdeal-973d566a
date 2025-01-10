import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Deal } from "@/types/deal";

export const useDeals = (category?: string, city?: string) => {
  return useQuery({
    queryKey: ["deals", category, city],
    queryFn: async () => {
      // Log authentication state
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('Access token:', session?.access_token);

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
        toast.error("Kunde inte hämta erbjudanden");
        throw error;
      }

      if (!data) {
        console.log('No deals found');
        return [];
      }

      console.log('Fetched deals:', data);
      return data as Deal[];
    },
  });
};

export const useFeaturedDeals = () => {
  return useQuery({
    queryKey: ["featured-deals"],
    queryFn: async () => {
      // Log authentication state for featured deals as well
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session (featured deals):', session);

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching featured deals:", error);
        toast.error("Kunde inte hämta utvalda erbjudanden");
        throw error;
      }

      if (!data) {
        return [];
      }

      console.log('Fetched featured deals:', data);
      return data as Deal[];
    },
  });
};