
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
        const { data, error } = await supabase
          .from("discount_codes")
          .select("*")
          .eq("deal_id", normalizedId);

        if (error) {
          console.error("[useDiscountCodes] Error fetching discount codes:", error);
          toast.error("Kunde inte hämta rabattkoder", {
            description: `Databasfel: ${error.message}`
          });
          throw error;
        }

        if (data && data.length > 0) {
          console.log(`[useDiscountCodes] Retrieved ${data.length} discount codes for deal ID: ${dealId}`);
          return data as DiscountCode[];
        }
        
        // Om inga resultat, försök med string-jämförelse som fallback
        console.log(`[useDiscountCodes] No discount codes found with numeric ID ${normalizedId}, trying string comparison`);
        
        // Hämta alla koder och filtrera
        const { data: allCodes, error: fallbackError } = await supabase
          .from("discount_codes")
          .select("*");
            
        if (fallbackError) {
          console.error("[useDiscountCodes] Error in fallback query:", fallbackError);
          return [];
        }
        
        // Om det finns koder, försök matcha med string-jämförelse
        if (allCodes && allCodes.length > 0) {
          // Logga befintliga deal_ids för felsökning
          const dealIdsInDb = [...new Set(allCodes.map(c => c.deal_id))];
          console.log(`[useDiscountCodes] Available deal_ids in database:`, dealIdsInDb);
          console.log(`[useDiscountCodes] Types of deal_ids in database:`, 
            [...new Set(allCodes.map(c => typeof c.deal_id))]);
          
          // Testa olika jämförelsemetoder
          const stringDealId = String(dealId);
          const numericDealId = Number(dealId);
          
          // Försöka hitta exakta matchningar eller string-matchningar
          const directMatches = allCodes.filter(code => code.deal_id === normalizedId);
          const stringMatches = allCodes.filter(code => String(code.deal_id) === stringDealId);
          
          console.log(`[useDiscountCodes] Matching results: direct matches: ${directMatches.length}, string matches: ${stringMatches.length}`);
          
          if (directMatches.length > 0) {
            return directMatches as DiscountCode[];
          }
          
          if (stringMatches.length > 0) {
            return stringMatches as DiscountCode[];
          }
          
          // Visa exempel på koder för felsökning
          if (allCodes.length > 0) {
            console.log(`[useDiscountCodes] Sample codes from database:`, allCodes.slice(0, 3));
          }
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
