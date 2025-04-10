
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Tar bort alla rabattkoder från databasen
 * Används främst för debugging och testning
 */
export const removeAllDiscountCodes = async (dealId?: string | number): Promise<boolean> => {
  if (dealId) {
    console.log(`[removeAllDiscountCodes] Removing all discount codes for deal ${dealId}`);
  } else {
    console.log('[removeAllDiscountCodes] Removing all discount codes');
  }
  
  try {
    let query = supabase.from('discount_codes').delete();
    
    if (dealId) {
      // Convert the dealId to a number if it's a string
      const numericDealId = normalizeId(dealId);
      query = query.eq('deal_id', numericDealId);
    } else {
      query = query.neq('id', 0); // Ta bort alla rader (ett villkor som är sant för alla rader)
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('[removeAllDiscountCodes] Error removing discount codes:', error);
      return false;
    }
    
    console.log('[removeAllDiscountCodes] Successfully removed all discount codes');
    
    return true;
  } catch (error) {
    console.error('[removeAllDiscountCodes] Exception removing discount codes:', error);
    return false;
  }
};
