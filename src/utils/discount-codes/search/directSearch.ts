
import { supabase } from "@/integrations/supabase/client";
import { logSearchAttempt } from "../types";

/**
 * Directly search for discount codes without type conversion
 */
export async function directSearch(dealId: string | number) {
  try {
    logSearchAttempt("directSearch", dealId, true);
    
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (error) throw error;
    
    return {
      success: true,
      codes: data || [],
      method: "direct"
    };
  } catch (error) {
    console.error("[directSearch] Error:", error);
    return {
      success: false,
      codes: [],
      method: "direct",
      error
    };
  }
}
