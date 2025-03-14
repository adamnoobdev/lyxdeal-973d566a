
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
      if (!dealId) {
        console.log('[useDiscountCodes] No dealId provided, returning empty list');
        return [];
      }

      console.log(`[useDiscountCodes] Fetching discount codes for deal ID: ${dealId}`);
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[useDiscountCodes] Error fetching discount codes:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log(`[useDiscountCodes] No discount codes found for deal ID: ${dealId}`);
      } else {
        console.log(`[useDiscountCodes] Retrieved ${data.length} discount codes for deal ID: ${dealId}`);
        console.log('[useDiscountCodes] Sample codes:', 
          data.slice(0, 3).map(c => c.code).join(', '), 
          data.length > 3 ? `... and ${data.length - 3} more` : '');
      }

      return data as DiscountCode[];
    },
    enabled: !!dealId, // Only run query when dealId is provided
    staleTime: 0, // Always consider data stale for fresh calls
    gcTime: 60000, // Keep unused data in cache for 1 minute
    retry: 2, // Increase retry attempts for more reliable data fetching
  });

  return {
    discountCodes,
    isLoading,
    error,
    refetch,
  };
};
