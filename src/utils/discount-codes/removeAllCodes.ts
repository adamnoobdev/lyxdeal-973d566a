
import { supabase } from "@/integrations/supabase/client";

/**
 * Tar bort alla rabattkoder från databasen
 * Används främst för debugging och testning
 */
export const removeAllDiscountCodes = async (): Promise<boolean> => {
  console.log('[removeAllDiscountCodes] Removing all discount codes');
  
  try {
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .neq('id', 0); // Ta bort alla rader (ett villkor som är sant för alla rader)
    
    if (error) {
      console.error('[removeAllDiscountCodes] Error removing discount codes:', error);
      return false;
    }
    
    console.log('[removeAllDiscountCodes] Successfully removed all discount codes');
    
    // Verifiera att alla koder verkligen togs bort
    const { data, error: verifyError } = await supabase
      .from('discount_codes')
      .select('count', { count: 'exact', head: true });
      
    if (verifyError) {
      console.error('[removeAllDiscountCodes] Error verifying removal:', verifyError);
    } else {
      console.log('[removeAllDiscountCodes] Verification complete, remaining codes:', data);
    }
    
    return true;
  } catch (error) {
    console.error('[removeAllDiscountCodes] Exception removing discount codes:', error);
    return false;
  }
};
