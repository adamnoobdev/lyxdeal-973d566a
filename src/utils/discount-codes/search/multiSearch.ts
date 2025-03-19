
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
      dealId,
      String(dealId),
      typeof dealId === 'string' ? parseInt(dealId, 10) : dealId,
      `${dealId}`
    ];
    
    let foundCodes = [];
    let foundType = '';
    
    // Try each variation
    for (const variation of variations) {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', variation);
        
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
      foundType
    };
  } catch (error) {
    console.error("[multiSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "multi",
      error
    };
  }
}
