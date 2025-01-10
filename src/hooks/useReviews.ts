import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useReviews = (dealId: string | undefined) => {
  return useQuery({
    queryKey: ["reviews", dealId],
    queryFn: async () => {
      if (!dealId) throw new Error("No deal ID provided");
      
      const parsedDealId = parseInt(dealId);
      if (isNaN(parsedDealId)) {
        toast.error("Ogiltigt erbjudande-ID");
        throw new Error("Invalid deal ID");
      }

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("deal_id", parsedDealId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Kunde inte hämta recensioner");
        throw error;
      }

      return data || [];
    },
    retry: false,
  });
};