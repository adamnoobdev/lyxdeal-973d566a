
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";

/**
 * Hämtar alla rabattkoder för manuell filtrering
 */
export async function getAllCodesAndFilter(
  originalId: string | number,
  numericId: number,
  stringId: string,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    console.log(`[${methodName}] No codes found with direct queries, trying with manual filtering`);
    
    const { data: allCodes, error: allCodesError } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(100);
        
    if (allCodesError) {
      console.error(`[${methodName}] Error fetching all codes:`, allCodesError);
      return [];
    }
    
    if (!allCodes || allCodes.length === 0) {
      console.log(`[${methodName}] No discount codes found in database at all`);
      return [];
    }
    
    // Logga typer och värden på deal_ids i databasen för felsökning
    const dealIdsInDb = [...new Set(allCodes.map(c => c.deal_id))].filter(id => id !== null);
    const dealIdTypesInDb = [...new Set(allCodes.map(c => typeof c.deal_id))];
    
    console.log(`[${methodName}] All deal_ids in database:`, dealIdsInDb);
    console.log(`[${methodName}] Deal ID types in database:`, dealIdTypesInDb);
    console.log(`[${methodName}] Sample codes:`, allCodes.slice(0, 3));
    
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
      console.log(`[${methodName}] Found ${manualMatches.length} codes with manual filtering`);
      return manualMatches as DiscountCode[];
    }
    
    console.log(`[${methodName}] No matching codes found after all attempts`);
    return [];
  } catch (error) {
    console.error(`[${methodName}] Exception during manual filtering:`, error);
    return [];
  }
}
