
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { toast } from "sonner";
import { normalizeId } from "@/utils/discount-codes/types";

export const useDiscountCodes = (dealId: number | string | undefined) => {
  const queryKey = ["discount-codes", dealId];
  
  console.log(`[useDiscountCodes] Initializing hook for deal ID: ${dealId || 'undefined'} (type: ${dealId ? typeof dealId : 'undefined'})`);
  
  const {
    data: discountCodes = [],
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!dealId) {
        console.log('[useDiscountCodes] No dealId provided, returning empty list');
        return [];
      }

      console.log(`[useDiscountCodes] Fetching discount codes for deal ID: ${dealId}`);
      
      try {
        // Normalize the deal ID for database query (ensuring it's a number)
        const normalizedId = normalizeId(dealId);
        console.log(`[useDiscountCodes] Using normalized deal ID: ${normalizedId} (type: ${typeof normalizedId})`);
        
        const { data, error } = await supabase
          .from("discount_codes")
          .select("*")
          .eq("deal_id", normalizedId);

        if (error) {
          console.error("[useDiscountCodes] Error fetching discount codes:", error);
          toast.error("Kunde inte hämta rabattkoder", {
            description: "Ett fel uppstod vid hämtning av rabattkoder. Försök igen senare."
          });
          throw error;
        }

        if (!data || data.length === 0) {
          console.log(`[useDiscountCodes] No discount codes found with normalized ID, trying string comparison`);
          
          // Try with string comparison as fallback
          console.log(`[useDiscountCodes] Trying with string comparison fallback`);
          
          const { data: allCodes, error: fallbackError } = await supabase
            .from("discount_codes")
            .select("*");
            
          if (fallbackError) {
            console.error("[useDiscountCodes] Error in fallback query:", fallbackError);
          } else if (allCodes && allCodes.length > 0) {
            // Filter codes by string comparison
            const stringDealId = String(dealId);
            const stringMatches = allCodes.filter(code => String(code.deal_id) === stringDealId);
            
            if (stringMatches.length > 0) {
              console.log(`[useDiscountCodes] Found ${stringMatches.length} codes with string comparison`);
              return stringMatches as DiscountCode[];
            }
            
            // Additional logging for debug help
            if (allCodes.length > 0) {
              const dealIdsInDb = [...new Set(allCodes.map(c => c.deal_id))];
              console.log(`[useDiscountCodes] Available deal_ids in database:`, dealIdsInDb);
              console.log(`[useDiscountCodes] Types of deal_ids in database:`, 
                [...new Set(allCodes.map(c => typeof c.deal_id))]);
              console.log(`[useDiscountCodes] Sample codes:`, allCodes.slice(0, 3));
            }
          }
        } else {
          console.log(`[useDiscountCodes] Retrieved ${data.length} discount codes for deal ID: ${dealId}`);
        }

        return data as DiscountCode[];
      } catch (fetchError) {
        console.error("[useDiscountCodes] Critical exception fetching discount codes:", fetchError);
        toast.error("Kunde inte hämta rabattkoder", {
          description: "Ett tekniskt fel uppstod. Försök igen senare."
        });
        throw fetchError;
      }
    },
    enabled: !!dealId,
    staleTime: 0, // Always fetch fresh data
    gcTime: 30000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  console.log(`[useDiscountCodes] Current state - isLoading: ${isLoading}, isFetching: ${isFetching}, codes count: ${discountCodes.length}, has error: ${!!error}`);

  return {
    discountCodes,
    isLoading,
    error,
    refetch,
    isFetching
  };
};
