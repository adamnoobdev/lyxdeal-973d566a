
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Ta bort alla rabattkoder eller alla för ett specifikt erbjudande
 */
export const removeAllDiscountCodes = async (dealId?: string | number): Promise<boolean> => {
  try {
    console.log(`[removeAllDiscountCodes] ${dealId ? `Removing codes for deal ID: ${dealId}` : 'Removing all codes'}`);
    
    let query = supabase.from('discount_codes').delete();
    
    // Om ett deal ID är angivet, filtrera borttagningen till bara det erbjudandet
    if (dealId) {
      const numericDealId = normalizeId(dealId);
      query = query.eq('deal_id', numericDealId);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error("[removeAllDiscountCodes] Error:", error);
      return false;
    }
    
    console.log(`[removeAllDiscountCodes] Successfully removed ${dealId ? `codes for deal ID: ${dealId}` : 'all codes'}`);
    return true;
  } catch (error) {
    console.error("[removeAllDiscountCodes] Exception:", error);
    return false;
  }
};
