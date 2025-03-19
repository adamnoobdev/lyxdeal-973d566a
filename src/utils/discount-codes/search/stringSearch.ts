
import { supabase } from "@/integrations/supabase/client";
import { logSearchAttempt } from "../types";

/**
 * Search for discount codes using a string ID approach
 */
export async function stringSearch(dealId: string) {
  try {
    logSearchAttempt("stringSearch", dealId, true);
    
    // Convert string to number for database query
    const numericDealId = Number(dealId);
    
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', numericDealId);
      
    if (error) throw error;
    
    return {
      success: true,
      codes: data || [],
      method: "string",
      codesCount: data?.length || 0
    };
  } catch (error) {
    console.error("[stringSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "string",
      error,
      codesCount: 0
    };
  }
}

/**
 * Search with string ID (exported for backwards compatibility)
 */
export async function searchWithStringId(dealId: string, methodName = "searchWithStringId"): Promise<any[]> {
  try {
    console.log(`[${methodName}] Searching with string ID: ${dealId}`);
    const result = await stringSearch(dealId);
    return result.success ? result.codes : [];
  } catch (error) {
    console.error(`[${methodName}] Error:`, error);
    return [];
  }
}
