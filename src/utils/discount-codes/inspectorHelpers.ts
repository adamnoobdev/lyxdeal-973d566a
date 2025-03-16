
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

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
    
    // Säkra åtkomst till count-egenskapen med typchecking
    const count = allCodesCheck && typeof allCodesCheck === 'object' && 'count' in allCodesCheck 
      ? allCodesCheck.count 
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
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", stringDealId)
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

/**
 * Analyserar kod-resultat för manuell matchning
 */
export function analyzeCodesAndFindMatches(allCodes: any[], originalDealId: string | number, numericDealId: number, stringDealId: string) {
  // Om inga koder alls hittades i databasen
  if (!allCodes || allCodes.length === 0) {
    console.log(`[analyzeCodesAndFindMatches] No discount codes found in database`);
    return { success: false, codesCount: 0 };
  }
  
  // Detaljerad analys av alla deal_ids i databasen
  const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
  const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
  
  console.log(`[analyzeCodesAndFindMatches] Found the following deal_ids:`, dealIds);
  console.log(`[analyzeCodesAndFindMatches] Deal ID types in database: ${dealIdTypes.join(', ')}`);
  
  // Försök via manuell jämförelse (javascript sida) som absolut fallback
  const manualMatches = allCodes.filter(code => {
    const codeId = code.deal_id;
    return String(codeId) === stringDealId || 
           Number(codeId) === numericDealId || 
           codeId === originalDealId;
  });
  
  if (manualMatches.length > 0) {
    console.log(`[analyzeCodesAndFindMatches] Found ${manualMatches.length} codes with manual comparison`);
    return { 
      success: true, 
      codesCount: manualMatches.length, 
      manualMatches,
      dealIds,
      dealIdTypes 
    };
  }
  
  return { 
    success: false, 
    codesCount: 0,
    dealIds,
    dealIdTypes 
  };
}

/**
 * Förbereder svaret för lyckad sökning
 */
export function prepareSuccessResponse(matchedCodes: any[], searchMethod: string, tables: any) {
  return {
    success: true,
    message: `Hittade ${matchedCodes.length} rabattkoder med ${searchMethod}`,
    codesCount: matchedCodes.length,
    sampleCodes: matchedCodes.slice(0, 3).map(code => ({
      code: code.code,
      isUsed: code.is_used,
      dealId: code.deal_id,
      dealIdType: typeof code.deal_id
    })),
    searchMethod,
    tables
  };
}

/**
 * Förbereder svaret för misslyckad sökning
 */
export function prepareErrorResponse(dealId: string | number, numericDealId: number, stringDealId: string, allCodes: any[], dealIds: any[], dealIdTypes: string[], tables: any, exactMatches?: any[], stringMatches?: any[]) {
  return {
    success: false,
    message: `Hittade ${allCodes.length} rabattkoder men ingen för erbjudande ${dealId}`,
    codesCount: 0,
    codesFoundForDeals: dealIds,
    dealIdTypes,
    searchAttempts: {
      originalId: {
        id: dealId,
        type: typeof dealId,
        matches: 0 // originalMatches saknas här, hanteras i inspector.ts
      },
      numericId: {
        id: numericDealId,
        type: typeof numericDealId,
        matches: exactMatches?.length || 0
      },
      stringId: {
        id: stringDealId,
        type: typeof stringDealId,
        matches: stringMatches?.length || 0
      }
    },
    sample: allCodes.slice(0, 5).map(code => ({
      id: code.id,
      code: code.code,
      dealId: code.deal_id,
      dealIdType: typeof code.deal_id,
      isUsed: code.is_used
    })),
    tables
  };
}
