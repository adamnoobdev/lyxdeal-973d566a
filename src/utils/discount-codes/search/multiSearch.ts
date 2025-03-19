
import { supabase } from "@/integrations/supabase/client";
import { logSearchAttempt } from "../types";

/**
 * Attempt multiple different methods to search for discount codes
 */
export async function multiSearch(dealId: string | number) {
  try {
    logSearchAttempt("multiSearch", dealId, true);
    
    // Try multiple variations of the ID
    const variations = [
      String(dealId), // String conversion
      `${dealId}`,    // Template literal conversion
      dealId.toString() // Explicit toString conversion
    ];
    
    let foundCodes = [];
    let foundType = '';
    
    // Try each variation but convert to number for the query
    for (const variation of variations) {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', Number(variation));
        
      if (!error && data && data.length > 0) {
        foundCodes = data;
        foundType = typeof variation;
        break;
      }
    }
    
    return {
      success: true,
      codes: foundCodes,
      method: "multi",
      foundType,
      codesCount: foundCodes.length
    };
  } catch (error) {
    console.error("[multiSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "multi",
      error,
      codesCount: 0
    };
  }
}

/**
 * Search discount codes with multiple methods and return the first successful result
 */
export async function searchDiscountCodesWithMultipleMethods(dealId: string | number | undefined) {
  if (!dealId) {
    console.log("[searchDiscountCodesWithMultipleMethods] No dealId provided");
    return [];
  }
  
  try {
    console.log(`[searchDiscountCodesWithMultipleMethods] Searching for codes with dealId: ${dealId} (type: ${typeof dealId})`);
    
    const result = await multiSearch(dealId);
    return result.success ? result.codes : [];
  } catch (error) {
    console.error("[searchDiscountCodesWithMultipleMethods] Error:", error);
    return [];
  }
}
