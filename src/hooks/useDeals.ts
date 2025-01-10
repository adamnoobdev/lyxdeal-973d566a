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

        if (!data || data.length === 0) {
          toast.info("Inga erbjudanden hittades");
          return [];
        }

        return data.map((deal) => ({
          id: deal.id,
          title: deal.title,
          description: deal.description,
          imageUrl: deal.image_url,
          originalPrice: deal.original_price,
          discountedPrice: deal.discounted_price,
          timeRemaining: deal.time_remaining,
          category: deal.category,
          city: deal.city,
          created_at: deal.created_at,
          quantityLeft: deal.quantity_left,
        }));
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Ett oväntat fel uppstod. Försök igen senare.");
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
      try {
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

        if (!data || data.length === 0) {
          return [];
        }

        return data.map((deal) => ({
          id: deal.id,
          title: deal.title,
          description: deal.description,
          imageUrl: deal.image_url,
          originalPrice: deal.original_price,
          discountedPrice: deal.discounted_price,
          timeRemaining: deal.time_remaining,
          category: deal.category,
          city: deal.city,
          created_at: deal.created_at,
          quantityLeft: deal.quantity_left,
        }));
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Ett oväntat fel uppstod vid hämtning av utvalda erbjudanden");
        throw error;
      }
    },
    retry: 1,
  });
};