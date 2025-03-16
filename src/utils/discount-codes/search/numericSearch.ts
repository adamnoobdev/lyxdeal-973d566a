
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { logSearchResults } from "./loggers";

/**
 * Söker efter rabattkoder med exakt nummer-ID
 */
export async function searchWithNumericId(
  numericId: number,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    console.log(`[${methodName}] Trying with numeric ID: ${numericId}`);
    
    const { data: numericMatches, error: numericError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericId);

    if (numericError) {
      console.error(`[${methodName}] Error using numeric ID:`, numericError);
      return [];
    } 
    
    logSearchResults(methodName, numericId, numericMatches);
    
    return (numericMatches || []) as DiscountCode[];
  } catch (error) {
    console.error(`[${methodName}] Exception searching with numeric ID:`, error);
    return [];
  }
}
