
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Tar bort alla rabattkoder för ett specifikt erbjudande eller alla erbjudanden
 * @param dealId - Erbjudande-ID (valfritt, om inget anges tas alla koder bort)
 * @returns - True om operationen lyckades, annars False
 */
export const removeAllDiscountCodes = async (dealId?: string | number): Promise<boolean> => {
  try {
    // Om dealId är definierat, normalisera och konvertera till nummer
    let query = supabase.from('discount_codes').delete();
    
    if (dealId) {
      const numericDealId = normalizeId(dealId);
      console.log(`[removeAllDiscountCodes] Removing codes for deal ID: ${numericDealId} (${typeof numericDealId})`);
      query = query.eq('deal_id', numericDealId);
    } else {
      console.log('[removeAllDiscountCodes] Removing ALL discount codes from database');
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('[removeAllDiscountCodes] Error:', error);
      return false;
    }
    
    if (dealId) {
      console.log(`[removeAllDiscountCodes] Successfully removed all codes for deal ID: ${dealId}`);
    } else {
      console.log('[removeAllDiscountCodes] Successfully removed all codes from database');
    }
    
    return true;
  } catch (error) {
    console.error('[removeAllDiscountCodes] Exception:', error);
    return false;
  }
};
