
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Perform a thorough inspection of discount codes in the database
 * This is used to diagnose issues when normal queries fail
 */
export async function inspectDiscountCodes(dealId: string | number) {
  try {
    console.log(`[inspectDiscountCodes] Starting inspection for deal ID: ${dealId} (${typeof dealId})`);
    const numericDealId = normalizeId(dealId);
    
    // Get all codes from the database (limited to 100 for performance)
    const { data: allCodes, error: allCodesError } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(100);
      
    if (allCodesError) {
      console.error("[inspectDiscountCodes] Error fetching all codes:", allCodesError);
      return {
        success: false,
        message: "Ett fel uppstod vid hämtning av rabattkoder från databasen",
        error: allCodesError
      };
    }
    
    if (!allCodes || allCodes.length === 0) {
      return {
        success: false,
        message: "Inga rabattkoder hittades i databasen",
        codesCount: 0
      };
    }
    
    // Look for codes that match our deal ID
    const matchingCodes = allCodes.filter(code => {
      // Try different comparison methods - ensure proper type comparisons with String conversion
      return (
        code.deal_id === numericDealId ||
        String(code.deal_id) === String(numericDealId)
      );
    });
    
    // Get sample codes for debugging
    const sampleCodes = matchingCodes.slice(0, 3);
    
    // Determine the type of deal_id stored in the database
    let codeType = null;
    if (matchingCodes.length > 0) {
      codeType = typeof matchingCodes[0].deal_id;
    }
    
    // Check for type mismatch
    const typeMismatch = typeof dealId !== codeType && matchingCodes.length > 0;
    
    // Get all unique deal_ids in the database for diagnostics
    const uniqueDealIds = [...new Set(allCodes.map(code => code.deal_id))];
    
    return {
      success: true,
      codesCount: matchingCodes.length,
      totalCodesInDb: allCodes.length,
      sampleCodes: sampleCodes,
      codeType: codeType,
      typeMismatch: typeMismatch,
      message: matchingCodes.length > 0 
        ? `Hittade ${matchingCodes.length} rabattkoder för erbjudandet i databasen` 
        : "Inga matchande rabattkoder hittades för detta erbjudande",
      uniqueDealIds: uniqueDealIds.slice(0, 10)
    };
  } catch (error) {
    console.error("[inspectDiscountCodes] Error inspecting codes:", error);
    return {
      success: false,
      message: "Ett fel uppstod vid inspektion av rabattkoder",
      error
    };
  }
}
