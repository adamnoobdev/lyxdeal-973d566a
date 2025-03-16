
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

      console.log(`[useDiscountCodes] Fetching discount codes for deal ID: ${dealId} (${typeof dealId})`);
      
      try {
        // Spara originalt ID för loggning och felsökning
        const originalId = dealId;
        
        // Normalisera ID till olika format för att testa olika sökmetoder
        // Använd try-catch för att fånga eventuella fel vid normalisering
        let numericId: number;
        try {
          numericId = normalizeId(dealId);
        } catch (error) {
          console.error(`[useDiscountCodes] Failed to normalize ID: ${error}`);
          numericId = typeof dealId === 'number' ? dealId : parseInt(String(dealId), 10);
          if (isNaN(numericId)) {
            numericId = 0; // Fallback till ett default värde
          }
        }
        
        const stringId = String(dealId);
        
        console.log(`[useDiscountCodes] Original ID: ${originalId} (${typeof originalId})`);
        console.log(`[useDiscountCodes] Normalized numeric ID: ${numericId} (${typeof numericId})`);
        console.log(`[useDiscountCodes] String ID: ${stringId} (${typeof stringId})`);
        
        // Steg 1: Försök med exakt numerisk match först (mest troligt)
        let { data: numericMatches, error: numericError } = await supabase
          .from("discount_codes")
          .select("*")
          .eq("deal_id", numericId);

        if (numericError) {
          console.error("[useDiscountCodes] Error using numeric ID:", numericError);
          // Fortsätt till nästa försök
        } else if (numericMatches && numericMatches.length > 0) {
          console.log(`[useDiscountCodes] Found ${numericMatches.length} codes using numeric ID ${numericId}`);
          return numericMatches as DiscountCode[];
        } else {
          console.log(`[useDiscountCodes] No codes found using numeric ID ${numericId}`);
        }
        
        // Steg 2: Försök med originalID (som det är, utan konvertering)
        // Här kontrollerar vi typ av originalId för att undvika typfel
        if (typeof originalId === 'number' || !isNaN(Number(originalId))) {
          // Vi behöver konvertera originalId till number om det inte redan är det
          // för att undvika TypeScript-fel
          const originalIdAsNumber = typeof originalId === 'number' 
            ? originalId 
            : Number(originalId);
            
          if (!isNaN(originalIdAsNumber)) {
            let { data: originalMatches, error: originalError } = await supabase
              .from("discount_codes")
              .select("*")
              .eq("deal_id", originalIdAsNumber);
              
            if (originalError) {
              console.error("[useDiscountCodes] Error using original ID:", originalError);
              // Fortsätt till nästa försök
            } else if (originalMatches && originalMatches.length > 0) {
              console.log(`[useDiscountCodes] Found ${originalMatches.length} codes using original ID ${originalId}`);
              return originalMatches as DiscountCode[];
            } else {
              console.log(`[useDiscountCodes] No codes found using original ID ${originalId}`);
            }
          }
        }
        
        // Steg 3: Försök med string-ID
        let { data: stringMatches, error: stringError } = await supabase
          .from("discount_codes")
          .select("*")
          .eq("deal_id", stringId);
          
        if (stringError) {
          console.error("[useDiscountCodes] Error using string ID:", stringError);
        } else if (stringMatches && stringMatches.length > 0) {
          console.log(`[useDiscountCodes] Found ${stringMatches.length} codes using string ID ${stringId}`);
          return stringMatches as DiscountCode[];
        } else {
          console.log(`[useDiscountCodes] No codes found using string ID ${stringId}`);
        }
        
        // Steg 4: Hämta alla koder och filtrera manuellt som absolut sista utväg
        console.log(`[useDiscountCodes] No codes found with direct queries, trying with manual filtering`);
        
        const { data: allCodes, error: allCodesError } = await supabase
          .from("discount_codes")
          .select("*")
          .limit(100);
            
        if (allCodesError) {
          console.error("[useDiscountCodes] Error fetching all codes:", allCodesError);
          throw allCodesError;
        }
        
        if (allCodes && allCodes.length > 0) {
          // Logga typer och värden på deal_ids i databasen för felsökning
          const dealIdsInDb = [...new Set(allCodes.map(c => c.deal_id))].filter(id => id !== null);
          const dealIdTypesInDb = [...new Set(allCodes.map(c => typeof c.deal_id))];
          
          console.log(`[useDiscountCodes] All deal_ids in database:`, dealIdsInDb);
          console.log(`[useDiscountCodes] Deal ID types in database:`, dealIdTypesInDb);
          console.log(`[useDiscountCodes] Sample codes:`, allCodes.slice(0, 3));
          
          // Manuell filtrering med olika jämförelsemetoder
          const manualMatches = allCodes.filter(code => {
            const codeId = code.deal_id;
            
            // Försök att matcha med olika metoder
            if (codeId === null) return false;
            
            // 1. Direkt jämförelse
            if (codeId === originalId) return true;
            
            // 2. String-jämförelse
            if (String(codeId) === stringId) return true;
            
            // 3. Numerisk jämförelse
            try {
              if (Number(codeId) === numericId) return true;
            } catch (e) {
              // Ignorera fel vid numerisk konvertering
            }
            
            return false;
          });
          
          if (manualMatches.length > 0) {
            console.log(`[useDiscountCodes] Found ${manualMatches.length} codes with manual filtering`);
            return manualMatches as DiscountCode[];
          }
          
          console.log(`[useDiscountCodes] No matching codes found after all attempts`);
        } else {
          console.log(`[useDiscountCodes] No discount codes found in database at all`);
        }
        
        // Logga ett detaljerat meddelande om vi inte hittade några koder
        console.log(`[useDiscountCodes] Comprehensive search for deal ID ${dealId} returned no results.`);
        console.log(`[useDiscountCodes] Attempted with types: original(${typeof originalId}), number(${typeof numericId}), string(${typeof stringId})`);
        console.log(`[useDiscountCodes] Attempted with values: original(${originalId}), number(${numericId}), string(${stringId})`);
        
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
