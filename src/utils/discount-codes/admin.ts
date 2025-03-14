
import { supabase } from "@/integrations/supabase/client";

/**
 * Tar bort alla rabattkoder
 */
export const removeAllDiscountCodes = async (): Promise<boolean> => {
  console.log(`[removeAllDiscountCodes] Removing all discount codes from the database`);
  
  try {
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .neq('id', 0); // This will match all rows since id is always > 0
      
    if (error) {
      console.error('[removeAllDiscountCodes] Error removing discount codes:', error);
      return false;
    }

    console.log(`[removeAllDiscountCodes] Successfully removed all discount codes`);
    return true;
  } catch (error) {
    console.error('[removeAllDiscountCodes] Critical exception removing discount codes:', error);
    return false;
  }
};
