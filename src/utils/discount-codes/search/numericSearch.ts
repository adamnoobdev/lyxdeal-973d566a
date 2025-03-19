
import { supabase } from "@/integrations/supabase/client";
import { logSearchAttempt } from "../types";

/**
 * Search for discount codes using a numeric ID approach
 */
export async function numericSearch(dealId: number) {
  try {
    logSearchAttempt("numericSearch", dealId, true);
    
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (error) throw error;
    
    return {
      success: true,
      codes: data || [],
      method: "numeric"
    };
  } catch (error) {
    console.error("[numericSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "numeric",
      error
    };
  }
}
