
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";

/**
 * Genomför en sista direkt sökning som fallback
 */
export async function performDirectSearch(
  numericId: number,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    console.log(`[${methodName}] Trying one last direct query with numeric ID ${numericId}`);
    
    const { data: directMatches, error: directError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericId);
      
    if (directError) {
      console.error(`[${methodName}] Error in direct query:`, directError);
      return [];
    } 
    
    if (directMatches && directMatches.length > 0) {
      console.log(`[${methodName}] Found ${directMatches.length} matches in direct query`);
      return directMatches as DiscountCode[];
    }
    
    console.log(`[${methodName}] No matches found in direct query either`);
    return [];
  } catch (error) {
    console.error(`[${methodName}] Exception in direct query:`, error);
    return [];
  }
}
