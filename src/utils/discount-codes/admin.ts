
import { supabase } from "@/integrations/supabase/client";
import { removeAllDiscountCodes } from "./removeAllCodes";

/**
 * Exportera removeAllDiscountCodes funktionen
 */
export { removeAllDiscountCodes };

/**
 * Uppdaterar en rabattkod med ny information
 */
export const updateDiscountCode = async (
  id: number,
  updates: {
    is_used?: boolean;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  }
): Promise<boolean> => {
  console.log(`[updateDiscountCode] Updating discount code with ID ${id}`, updates);
  
  try {
    const { error } = await supabase
      .from('discount_codes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error('[updateDiscountCode] Error updating discount code:', error);
      return false;
    }
    
    console.log('[updateDiscountCode] Discount code updated successfully');
    return true;
  } catch (error) {
    console.error('[updateDiscountCode] Exception updating discount code:', error);
    return false;
  }
};

/**
 * Tar bort en specifik rabattkod
 */
export const deleteDiscountCode = async (id: number): Promise<boolean> => {
  console.log(`[deleteDiscountCode] Deleting discount code with ID ${id}`);
  
  try {
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('[deleteDiscountCode] Error deleting discount code:', error);
      return false;
    }
    
    console.log('[deleteDiscountCode] Discount code deleted successfully');
    return true;
  } catch (error) {
    console.error('[deleteDiscountCode] Exception deleting discount code:', error);
    return false;
  }
};
