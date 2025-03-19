
import { supabase } from "@/integrations/supabase/client";
import { logSearchAttempt } from "../types";

/**
 * Search for discount codes using a string ID approach
 */
export async function stringSearch(dealId: string) {
  try {
    logSearchAttempt("stringSearch", dealId, true);
    
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (error) throw error;
    
    return {
      success: true,
      codes: data || [],
      method: "string"
    };
  } catch (error) {
    console.error("[stringSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "string",
      error
    };
  }
}
