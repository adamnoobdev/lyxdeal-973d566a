
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";

export const useDiscountCodes = (dealId: number | undefined) => {
  const {
    data: discountCodes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["discount-codes", dealId],
    queryFn: async () => {
      if (!dealId) return [];

      console.log(`Fetching discount codes for deal ID: ${dealId}`);
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching discount codes:", error);
        throw error;
      }

      console.log(`Retrieved ${data?.length || 0} discount codes`);
      return data as DiscountCode[];
    },
    enabled: !!dealId, // Only run query when dealId is provided
    staleTime: 0, // Always consider data stale for fresh calls
    gcTime: 60000, // Keep unused data in cache for 1 minute
    retry: 1, // Reduce retry attempts to prevent excessive API calls
  });

  return {
    discountCodes,
    isLoading,
    error,
    refetch,
  };
};
