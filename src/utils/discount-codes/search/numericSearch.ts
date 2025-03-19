
import { supabase } from "@/integrations/supabase/client";
import { logSearchAttempt } from "../types";

/**
 * Search for discount codes using a numeric ID approach
 */
export async function numericSearch(dealId: number) {
  try {
    logSearchAttempt("numericSearch", dealId, true);
    
    // Convert to string for consistency with other search methods
    const stringDealId = String(dealId);
    
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', stringDealId);
      
    if (error) throw error;
    
    return {
      success: true,
      codes: data || [],
      method: "numeric",
      codesCount: data?.length || 0
    };
  } catch (error) {
    console.error("[numericSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "numeric",
      error,
      codesCount: 0
    };
  }
}

/**
 * Search with numeric ID (exported for backwards compatibility)
 */
export async function searchWithNumericId(dealId: number, methodName = "searchWithNumericId"): Promise<any[]> {
  try {
    console.log(`[${methodName}] Searching with numeric ID: ${dealId}`);
    const result = await numericSearch(dealId);
    return result.success ? result.codes : [];
  } catch (error) {
    console.error(`[${methodName}] Error:`, error);
    return [];
  }
}
