
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
        // VIKTIGT: Kontrollera både numeriskt och string-id
        console.log(`[useDiscountCodes] Running query with dealId=${dealId} (${typeof dealId})`);
        
        // Först försök med exakt matchning av antingen nummer eller sträng
        const { data, error } = await supabase
          .from("discount_codes")
          .select("*")
          .or(`deal_id.eq.${dealId},deal_id.eq."${dealId}"`)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[useDiscountCodes] Error fetching discount codes:", error);
          toast.error("Kunde inte hämta rabattkoder", {
            description: "Ett fel uppstod vid hämtning av rabattkoder. Försök igen senare."
          });
          throw error;
        }

        // Log detailed information about the result for debugging
        if (!data || data.length === 0) {
          console.log(`[useDiscountCodes] No discount codes found for deal ID: ${dealId}`);
          
          // Försök med en ytterligare sökning utan filter för att se alla rabattkoder
          const { data: allCodes, error: allCodesError } = await supabase
            .from("discount_codes")
            .select("id, code, deal_id")
            .limit(10);
            
          if (allCodesError) {
            console.error("[useDiscountCodes] Error querying all codes:", allCodesError);
          } else if (allCodes && allCodes.length > 0) {
            console.log("[useDiscountCodes] Found codes in database, but none for this deal. Sample codes:", allCodes);
            console.log("[useDiscountCodes] Deal ID types in database:", 
              [...new Set(allCodes.map(c => `${c.deal_id} (${typeof c.deal_id})`))]
            );
            
            // Kontrollera om det finns koder där deal_id är en sträng men innehåller samma värde
            const matchingStringCodes = allCodes.filter(c => 
              (typeof c.deal_id === 'string' && c.deal_id === String(dealId)) || 
              (typeof c.deal_id === 'number' && c.deal_id === dealId)
            );
            
            if (matchingStringCodes.length > 0) {
              console.log("[useDiscountCodes] Found codes with matching deal_id but different type:", matchingStringCodes);
            }
          }
        } else {
          console.log(`[useDiscountCodes] Retrieved ${data.length} discount codes for deal ID: ${dealId}`);
          console.log('[useDiscountCodes] Sample codes:', 
            data.slice(0, 3).map(c => ({ code: c.code, deal_id: c.deal_id, type: typeof c.deal_id }))
          );
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
