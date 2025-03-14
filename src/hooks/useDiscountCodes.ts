
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { toast } from "sonner";

export const useDiscountCodes = (dealId: number | undefined) => {
  const queryKey = ["discount-codes", dealId];
  
  console.log(`[useDiscountCodes] Initializing hook for deal ID: ${dealId || 'undefined'}`);
  
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
        // Explicit query för rabattkoder med tydliga parametrar
        const { data, error } = await supabase
          .from("discount_codes")
          .select("*")
          .eq("deal_id", dealId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[useDiscountCodes] Error fetching discount codes:", error);
          toast.error("Kunde inte hämta rabattkoder", {
            description: "Ett fel uppstod vid hämtning av rabattkoder. Försök igen senare."
          });
          throw error;
        }

        // Logga detaljerad information om resultatet för att hjälpa med felsökning
        if (!data || data.length === 0) {
          console.log(`[useDiscountCodes] No discount codes found for deal ID: ${dealId}`);
          
          // Verify query function is working correctly at all
          const { data: testData, error: testError } = await supabase
            .from("discount_codes")
            .select("count");
            
          if (testError) {
            console.error("[useDiscountCodes] Test query error:", testError);
          } else {
            console.log("[useDiscountCodes] Test query result:", testData);
            
            // Try a more general query to find any codes
            const { data: anyCodesData, error: anyCodesError } = await supabase
              .from("discount_codes")
              .select("deal_id, code")
              .limit(10);
              
            if (anyCodesError) {
              console.error("[useDiscountCodes] Any codes query error:", anyCodesError);
            } else {
              console.log("[useDiscountCodes] Any codes found:", anyCodesData);
              if (anyCodesData && anyCodesData.length > 0) {
                console.log("[useDiscountCodes] Deal IDs with codes:", 
                  [...new Set(anyCodesData.map(c => c.deal_id))]);
              }
            }
          }
        } else {
          console.log(`[useDiscountCodes] Retrieved ${data.length} discount codes for deal ID: ${dealId}`);
          console.log('[useDiscountCodes] Sample codes:', 
            data.slice(0, 3).map(c => c.code).join(', '), 
            data.length > 3 ? `... and ${data.length - 3} more` : '');
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
    staleTime: 0, // Alltid hämta färsk data
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
