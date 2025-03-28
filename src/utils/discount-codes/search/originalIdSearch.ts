
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { logSearchResults } from "./loggers";

/**
 * Söker efter rabattkoder med original-ID
 */
export async function searchWithOriginalId(
  originalId: string | number,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    if (typeof originalId !== 'number' && isNaN(Number(originalId))) {
      console.log(`[${methodName}] Original ID is not a valid number: ${originalId}`);
      return [];
    }
    
    // Convert to number for database query
    const numericDealId = Number(originalId);
      
    console.log(`[${methodName}] Trying with original ID as number: ${numericDealId}`);
    
    const { data: originalMatches, error: originalError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericDealId);
      
    if (originalError) {
      console.error(`[${methodName}] Error using original ID:`, originalError);
      return [];
    } 
    
    logSearchResults(methodName, originalId, originalMatches);
    
    return (originalMatches || []) as DiscountCode[];
  } catch (error) {
    console.error(`[${methodName}] Exception searching with original ID:`, error);
    return [];
  }
}
