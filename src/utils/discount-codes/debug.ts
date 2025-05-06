import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Lista alla rabattkoder i systemet
 */
export const listAllDiscountCodes = async (): Promise<any[]> => {
  try {
    console.log("[listAllDiscountCodes] Fetching all discount codes");
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("[listAllDiscountCodes] Error:", error);
      return [];
    }
    
    console.log(`[listAllDiscountCodes] Found ${data?.length || 0} codes`);
    return data || [];
  } catch (error) {
    console.error("[listAllDiscountCodes] Exception:", error);
    return [];
  }
};

/**
 * Räkna rabattkoder för ett erbjudande
 */
export const countDiscountCodes = async (dealId: string | number): Promise<number> => {
  try {
    const numericDealId = normalizeId(dealId);
    console.log(`[countDiscountCodes] Counting codes for deal ID: ${numericDealId}`);
    
    const { count, error } = await supabase
      .from('discount_codes')
      .select('*', { count: 'exact', head: true })
      .eq('deal_id', numericDealId);
      
    if (error) {
      console.error("[countDiscountCodes] Error:", error);
      return 0;
    }
    
    console.log(`[countDiscountCodes] Found ${count || 0} codes for deal ID ${numericDealId}`);
    return count || 0;
  } catch (error) {
    console.error("[countDiscountCodes] Exception:", error);
    return 0;
  }
};

/**
 * Testa rabattkodsgenerering (för utvecklingsändamål)
 */
export const testDiscountCodeGeneration = async (dealId: number): Promise<boolean> => {
  try {
    console.log(`[testDiscountCodeGeneration] Testing generation for deal ID: ${dealId}`);
    // Implementera testkodgenerering här
    return true;
  } catch (error) {
    console.error("[testDiscountCodeGeneration] Exception:", error);
    return false;
  }
};
