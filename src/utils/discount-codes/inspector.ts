
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";
import { getTableInfo } from "./tableManagement";

/**
 * Inspekterar rabattkoder för ett erbjudande och försöker hitta problem
 */
export const inspectDiscountCodes = async (dealId: number | string): Promise<any> => {
  try {
    console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ID: ${dealId}`);
    
    // Normalisera deal ID för konsekvens
    const numericDealId = normalizeId(dealId);
    console.log(`[inspectDiscountCodes] Using normalized deal ID: ${numericDealId} (${typeof numericDealId})`);
    
    // Inspektera tabellstruktur
    const tables = await getTableInfo();
    
    // Sök efter koder med exakt ID-match
    const { data: exactMatches, error: exactError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericDealId)
      .limit(10);
      
    if (exactError) {
      console.error(`[inspectDiscountCodes] Error checking for exact matches:`, exactError);
      return {
        success: false,
        message: "Ett fel uppstod vid inspektion av rabattkoder",
        error: exactError,
        tables
      };
    }
    
    // Om vi hittade exakta träffar, returnera dessa
    if (exactMatches && exactMatches.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${exactMatches.length} exact matches for deal ID ${numericDealId}`);
      return {
        success: true,
        message: `Hittade ${exactMatches.length} rabattkoder med rätt format`,
        codesCount: exactMatches.length,
        sampleCodes: exactMatches.slice(0, 3).map(code => ({
          code: code.code,
          isUsed: code.is_used
        })),
        codeType: typeof exactMatches[0].deal_id,
        tables
      };
    }
    
    // Om inga exakta träffar, försök med string-jämförelse
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
    
    // Om det finns koder, försök identifiera problem
    if (allCodes && allCodes.length > 0) {
      // Samla alla unika deal_ids
      const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
      const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
      
      console.log(`[inspectDiscountCodes] Found ${allCodes.length} total codes with deal_ids: ${dealIds.join(', ')}`);
      console.log(`[inspectDiscountCodes] Deal ID types in database: ${dealIdTypes.join(', ')}`);
      
      // För string-jämförelse
      const stringDealId = String(dealId);
      const stringMatches = allCodes.filter(code => String(code.deal_id) === stringDealId);
      
      if (stringMatches.length > 0) {
        console.log(`[inspectDiscountCodes] Found ${stringMatches.length} string matches for deal ID ${stringDealId}`);
        return {
          success: true,
          message: `Hittade ${stringMatches.length} rabattkoder med string-jämförelse`,
          codesCount: stringMatches.length,
          sampleCodes: stringMatches.slice(0, 3).map(code => ({
            code: code.code,
            isUsed: code.is_used
          })),
          codeType: typeof stringMatches[0].deal_id,
          tables,
          dealIdTypes
        };
      }
      
      // Om vi har koder men inte för detta deal_id
      return {
        success: false,
        message: `Hittade ${allCodes.length} rabattkoder men ingen för erbjudande ${dealId}`,
        codesCount: 0,
        codesFoundForDeals: dealIds,
        sample: allCodes.slice(0, 2),
        tables,
        dealIdTypes
      };
    }
    
    // Om inga koder alls hittades
    console.log(`[inspectDiscountCodes] No discount codes found in database`);
    return {
      success: false,
      message: "Inga rabattkoder hittades i databasen",
      codesCount: 0,
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
