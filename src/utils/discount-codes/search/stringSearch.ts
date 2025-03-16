
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { logSearchResults } from "./loggers";

/**
 * Söker efter rabattkoder med string-ID konverterat till nummer
 */
export async function searchWithStringId(
  stringId: string,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    const stringIdAsNumber = Number(stringId);
    
    if (isNaN(stringIdAsNumber)) {
      console.log(`[${methodName}] String ID cannot be converted to a valid number: ${stringId}`);
      return [];
    }
    
    console.log(`[${methodName}] Trying with string ID as number: ${stringIdAsNumber}`);
    
    const { data: stringMatches, error: stringError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", stringIdAsNumber);
      
    if (stringError) {
      console.error(`[${methodName}] Error using string ID as number:`, stringError);
      return [];
    }
    
    logSearchResults(methodName, stringId, stringMatches);
    
    return (stringMatches || []) as DiscountCode[];
  } catch (error) {
    console.error(`[${methodName}] Exception searching with string ID:`, error);
    return [];
  }
}
