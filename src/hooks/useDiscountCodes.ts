
import { useQuery } from "@tanstack/react-query";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { toast } from "sonner";
import { logIdInfo } from "@/utils/discount-codes/types";
import { searchDiscountCodesWithMultipleMethods } from "@/utils/discount-codes/searchHelpers";

/**
 * Hook för att hantera hämtning av rabattkoder för ett erbjudande
 */
export const useDiscountCodes = (dealId: number | string | undefined) => {
  const queryKey = ["discount-codes", dealId];
  
  logIdInfo("useDiscountCodes", dealId);
  
  const {
    data: discountCodes = [],
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        return await searchDiscountCodesWithMultipleMethods(dealId);
      } catch (error) {
        console.error("[useDiscountCodes] Error in query function:", error);
        throw error;
      }
    },
    enabled: !!dealId,
    staleTime: 0, // Hämta alltid färsk data
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
