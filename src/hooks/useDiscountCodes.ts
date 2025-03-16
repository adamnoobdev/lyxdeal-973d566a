
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { toast } from "sonner";
import { normalizeId, logIdInfo } from "@/utils/discount-codes/types";

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
      if (!dealId) {
        console.log('[useDiscountCodes] No dealId provided, returning empty list');
        return [];
      }

      console.log(`[useDiscountCodes] Fetching discount codes for deal ID: ${dealId}`);
      
      try {
        // Normalisera deal ID för databasförfrågan (säkerställ att det är ett nummer)
        const normalizedId = normalizeId(dealId);
        logIdInfo("useDiscountCodes normalized", normalizedId);
        
        // Försök först med exakt ID-match
        let { data: exactMatches, error: exactError } = await supabase
          .from("discount_codes")
          .select("*")
          .eq("deal_id", normalizedId);

        if (exactError) {
          console.error("[useDiscountCodes] Error fetching discount codes:", exactError);
          toast.error("Kunde inte hämta rabattkoder", {
            description: `Databasfel: ${exactError.message}`
          });
          throw exactError;
        }

        if (exactMatches && exactMatches.length > 0) {
          console.log(`[useDiscountCodes] Retrieved ${exactMatches.length} discount codes for deal ID: ${dealId} with exact match`);
          return exactMatches as DiscountCode[];
        }
        
        // Om inga resultat med normaliserat ID, försök med string-jämförelse som fallback
        console.log(`[useDiscountCodes] No discount codes found with normalized ID ${normalizedId}, trying string comparison`);
        const stringDealId = String(dealId);
        
        // Hämta alla koder och filtrera i klienten som fallback
        const { data: allCodes, error: fallbackError } = await supabase
          .from("discount_codes")
          .select("*")
          .limit(100);  // Öka gränsen för att säkerställa att vi får alla koder
            
        if (fallbackError) {
          console.error("[useDiscountCodes] Error in fallback query:", fallbackError);
          return [];
        }
        
        // Om det finns koder, försök matcha med olika metoder
        if (allCodes && allCodes.length > 0) {
          // Logga befintliga deal_ids för felsökning
          const dealIdsInDb = [...new Set(allCodes.map(c => c.deal_id))];
          console.log(`[useDiscountCodes] Available deal_ids in database:`, dealIdsInDb);
          console.log(`[useDiscountCodes] Types of deal_ids in database:`, 
            [...new Set(allCodes.map(c => typeof c.deal_id))]);
          
          // Visa exempel på koder för mer detaljerad felsökning
          console.log("[useDiscountCodes] Sample codes from database:", allCodes.slice(0, 3));
          
          // Försök med olika jämförelsemetoder
          const stringMatches = allCodes.filter(code => String(code.deal_id) === stringDealId);
          
          if (stringMatches.length > 0) {
            console.log(`[useDiscountCodes] Found ${stringMatches.length} codes with string comparison`);
            return stringMatches as DiscountCode[];
          }
          
          // Försök specifikt leta efter om det finns någon deal_id = null
          const nullDeals = allCodes.filter(code => code.deal_id === null);
          if (nullDeals.length > 0) {
            console.log(`[useDiscountCodes] Found ${nullDeals.length} codes with NULL deal_id`);
          }
          
          // Om vi fortfarande inte hittar något, testa om deal_id är lagrat som string eller number
          // Försök med både string och number konvertering
          const numericIdMatches = allCodes.filter(code => 
            Number(code.deal_id) === Number(dealId)
          );
          
          if (numericIdMatches.length > 0) {
            console.log(`[useDiscountCodes] Found ${numericIdMatches.length} codes with numeric ID conversion`);
            return numericIdMatches as DiscountCode[];
          }
          
          console.log(`[useDiscountCodes] No matching codes found after all attempts`);
        } else {
          console.log(`[useDiscountCodes] No discount codes found in database at all`);
        }
        
        return [];
      } catch (fetchError) {
        console.error("[useDiscountCodes] Critical exception fetching discount codes:", fetchError);
        toast.error("Kunde inte hämta rabattkoder", {
          description: "Ett tekniskt fel uppstod. Försök igen senare."
        });
        throw fetchError;
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
