
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";
import { getTableInfo } from "./tableManagement";

/**
 * Inspekterar rabattkoder för ett erbjudande och försöker hitta problem
 */
export const inspectDiscountCodes = async (dealId: number | string): Promise<any> => {
  try {
    console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ID: ${dealId}`);
    
    // Normalisera deal ID för konsekvens (men håll reda på original för jämförelse)
    const originalDealId = dealId;
    const numericDealId = normalizeId(dealId);
    const stringDealId = String(dealId);
    
    console.log(`[inspectDiscountCodes] Original deal ID: ${originalDealId} (${typeof originalDealId})`);
    console.log(`[inspectDiscountCodes] Normalized deal ID: ${numericDealId} (${typeof numericDealId})`);
    console.log(`[inspectDiscountCodes] String deal ID: ${stringDealId} (${typeof stringDealId})`);
    
    // Inspektera tabellstruktur
    const tables = await getTableInfo();
    
    // Testa först rabattkoder-tabellen specifikt för att verifiera att den är åtkomlig
    const { data: testAccess, error: testError } = await supabase
      .from("discount_codes")
      .select("count(*)")
      .limit(1)
      .single();
      
    if (testError) {
      console.error(`[inspectDiscountCodes] Error accessing discount_codes table:`, testError);
      return {
        success: false,
        message: "Problem med åtkomst till rabattkodstabellen",
        error: testError,
        tables
      };
    }
    
    console.log(`[inspectDiscountCodes] Successfully accessed discount_codes table`);
    
    // DIREKT VERIFIERING: Sök efter ALLA koder först för att se om tabellen innehåller data
    const { data: allCodesCheck, error: allCheckError } = await supabase
      .from("discount_codes")
      .select("count(*)")
      .single();
      
    if (allCheckError) {
      console.error(`[inspectDiscountCodes] Error checking all codes:`, allCheckError);
    } else {
      console.log(`[inspectDiscountCodes] Total codes in database: ${allCodesCheck.count || 0}`);
    }
    
    // Försök med olika metoder att hitta rabattkoder
    
    // 1. Exakt match på normaliserad ID
    const { data: exactMatches, error: exactError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericDealId)
      .limit(10);
      
    if (exactError) {
      console.error(`[inspectDiscountCodes] Error checking for exact matches:`, exactError);
    } else {
      console.log(`[inspectDiscountCodes] Found ${exactMatches?.length || 0} exact matches`);
    }
    
    // 2. Exakt match på original-ID
    const { data: originalMatches, error: originalError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", originalDealId)
      .limit(10);
      
    if (originalError) {
      console.error(`[inspectDiscountCodes] Error checking for original ID matches:`, originalError);
    } else {
      console.log(`[inspectDiscountCodes] Found ${originalMatches?.length || 0} original matches`);
    }
    
    // 3. Exakt match på string-ID
    const { data: stringMatches, error: stringError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", stringDealId)
      .limit(10);
      
    if (stringError) {
      console.error(`[inspectDiscountCodes] Error checking for string matches:`, stringError);
    } else {
      console.log(`[inspectDiscountCodes] Found ${stringMatches?.length || 0} string matches`);
    }
    
    // Om vi hittade något med någon av metoderna, använd den
    const foundCodes = exactMatches?.length ? exactMatches : 
                      originalMatches?.length ? originalMatches : 
                      stringMatches?.length ? stringMatches : [];
    
    if (foundCodes.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${foundCodes.length} codes with standard search methods`);
      return {
        success: true,
        message: `Hittade ${foundCodes.length} rabattkoder med standardsökningsmetoder`,
        codesCount: foundCodes.length,
        sampleCodes: foundCodes.slice(0, 3).map(code => ({
          code: code.code,
          isUsed: code.is_used,
          dealId: code.deal_id,
          dealIdType: typeof code.deal_id
        })),
        tables
      };
    }
    
    // Hämta alla koder för att inspektera och analysera manuellt
    const { data: allCodes, error: allCodesError } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(50);
      
    if (allCodesError) {
      console.error(`[inspectDiscountCodes] Error fetching all codes:`, allCodesError);
      return { 
        success: false, 
        message: "Ett fel uppstod vid hämtning av alla rabattkoder",
        error: allCodesError,
        tables
      };
    }
    
    // Om inga koder alls hittades i databasen
    if (!allCodes || allCodes.length === 0) {
      console.log(`[inspectDiscountCodes] No discount codes found in database`);
      return {
        success: false,
        message: "Inga rabattkoder hittades i databasen",
        codesCount: 0,
        tables
      };
    }
    
    console.log(`[inspectDiscountCodes] Found ${allCodes.length} total codes in database`);
    
    // Detaljerad analys av alla deal_ids i databasen
    const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
    const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
    
    console.log(`[inspectDiscountCodes] Found the following deal_ids:`, dealIds);
    console.log(`[inspectDiscountCodes] Deal ID types in database: ${dealIdTypes.join(', ')}`);
    
    // Försök via manuell jämförelse (javascript sida) som absolut fallback
    const manualMatches = allCodes.filter(code => {
      const codeId = code.deal_id;
      return  String(codeId) === stringDealId || 
              Number(codeId) === numericDealId || 
              codeId === originalDealId;
    });
    
    if (manualMatches.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${manualMatches.length} codes with manual comparison`);
      return {
        success: true,
        message: `Hittade ${manualMatches.length} rabattkoder genom manuell jämförelse`,
        codesCount: manualMatches.length,
        sampleCodes: manualMatches.slice(0, 3).map(code => ({
          code: code.code,
          isUsed: code.is_used,
          dealId: code.deal_id,
          dealIdType: typeof code.deal_id
        })),
        searchMethod: "manual",
        tables
      };
    }
    
    // Visa detaljerad felrapport om vi inte hittade några matchande koder
    return {
      success: false,
      message: `Hittade ${allCodes.length} rabattkoder men ingen för erbjudande ${dealId}`,
      codesCount: 0,
      codesFoundForDeals: dealIds,
      dealIdTypes,
      searchAttempts: {
        originalId: {
          id: originalDealId,
          type: typeof originalDealId,
          matches: originalMatches?.length || 0
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
  } catch (error) {
    console.error(`[inspectDiscountCodes] Exception during inspection:`, error);
    return {
      success: false,
      message: "Ett oväntat fel uppstod vid inspektion",
      error
    };
  }
};
