
import { supabase } from "@/integrations/supabase/client";

/**
 * Hämtar information om databastabell
 */
export async function getTableAccess() {
  try {
    // Testa först rabattkoder-tabellen specifikt för att verifiera att den är åtkomlig
    const { data: testAccess, error: testError } = await supabase
      .from("discount_codes")
      .select("count(*)")
      .limit(1)
      .single();
      
    if (testError) {
      console.error(`[getTableAccess] Error accessing discount_codes table:`, testError);
      return { success: false, error: testError };
    }
    
    console.log(`[getTableAccess] Successfully accessed discount_codes table`);
    return { success: true, data: testAccess };
  } catch (error) {
    console.error(`[getTableAccess] Exception during table access test:`, error);
    return { success: false, error };
  }
}

/**
 * Kontrollerar om det finns rabattkoder i databasen
 */
export async function countAllCodesInDatabase() {
  try {
    const { data: allCodesCheck, error: allCheckError } = await supabase
      .from("discount_codes")
      .select("count(*)")
      .single();
      
    if (allCheckError) {
      console.error(`[countAllCodesInDatabase] Error checking all codes:`, allCheckError);
      return { success: false, error: allCheckError };
    } 
    
    // Fix TypeScript error by properly checking for null
    const count = allCodesCheck && allCodesCheck.count !== null 
      ? Number(allCodesCheck.count) 
      : 0;
      
    console.log(`[countAllCodesInDatabase] Total codes in database: ${count}`);
    return { success: true, count };
  } catch (error) {
    console.error(`[countAllCodesInDatabase] Exception while counting codes:`, error);
    return { success: false, error };
  }
}

/**
 * Söker efter rabattkoder med en specifik deal_id
 */
export async function searchExactMatches(dealId: number) {
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", dealId)
      .limit(10);
      
    if (error) {
      console.error(`[searchExactMatches] Error searching exact matches:`, error);
      return { success: false, error };
    }
    
    console.log(`[searchExactMatches] Found ${data?.length || 0} exact matches`);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error(`[searchExactMatches] Exception during search:`, error);
    return { success: false, error };
  }
}

/**
 * Söker efter rabattkoder med en specifik deal_id som string
 */
export async function searchStringMatches(stringDealId: string) {
  try {
    // Konvertera string till number för att undvika TypeScript-fel
    const numericId = Number(stringDealId);
    
    if (isNaN(numericId)) {
      console.error(`[searchStringMatches] Invalid numeric conversion for: ${stringDealId}`);
      return { success: false, error: new Error("Invalid numeric ID") };
    }
    
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericId)
      .limit(10);
      
    if (error) {
      console.error(`[searchStringMatches] Error searching string matches:`, error);
      return { success: false, error };
    }
    
    console.log(`[searchStringMatches] Found ${data?.length || 0} string matches`);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error(`[searchStringMatches] Exception during search:`, error);
    return { success: false, error };
  }
}

/**
 * Hämtar alla rabattkoder för manuell inspektion
 */
export async function getAllCodesForInspection(limit = 50) {
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(limit);
      
    if (error) {
      console.error(`[getAllCodesForInspection] Error fetching all codes:`, error);
      return { success: false, error };
    }
    
    console.log(`[getAllCodesForInspection] Found ${data?.length || 0} total codes in database`);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error(`[getAllCodesForInspection] Exception during fetch:`, error);
    return { success: false, error };
  }
}
