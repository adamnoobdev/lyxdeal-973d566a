
import { supabase } from "@/integrations/supabase/client";
import { logIdInfo, normalizeId } from "./types";

type InspectionResult = {
  success: boolean;
  codesCount: number;
  message: string;
  codeType?: string;
  sampleCodes?: any[];
};

/**
 * Inspekterar rabattkoder i databasen för ett specifikt erbjudande-ID
 * För att hjälpa till med felsökning när rabattkoder inte visas korrekt
 */
export const inspectDiscountCodes = async (dealId: number | string): Promise<InspectionResult> => {
  try {
    // Konvertera dealId till nummer för konsekvens
    const numericDealId = typeof dealId === 'string' ? parseInt(dealId, 10) : dealId;
    
    if (isNaN(numericDealId)) {
      throw new Error(`Invalid deal ID format: ${dealId}`);
    }
    
    logIdInfo("inspectDiscountCodes", numericDealId);
    console.log(`[Inspector] Inspecting discount codes for deal ID: ${numericDealId}`);
    
    // Kontrollera om koder finns med exakt matchning av deal_id
    const { data: exactMatchCodes, error: exactMatchError } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', numericDealId)
      .limit(10);
      
    if (exactMatchError) {
      throw new Error(`Error inspecting exact match codes: ${exactMatchError.message}`);
    }
    
    console.log(`[Inspector] Found ${exactMatchCodes?.length || 0} codes with exact match of deal_id`);
    
    // Om vi hittade koder med exakt matchning, returnera resultatet
    if (exactMatchCodes && exactMatchCodes.length > 0) {
      return {
        success: true,
        codesCount: exactMatchCodes.length,
        message: `Hittade ${exactMatchCodes.length} rabattkoder med deal_id = ${numericDealId}`,
        sampleCodes: exactMatchCodes.slice(0, 3)
      };
    }
    
    // Kontrollera om koden finns lagrat som en sträng istället för ett nummer
    const stringId = numericDealId.toString();
    const { data: stringMatchCodes, error: stringMatchError } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', stringId)
      .limit(10);
      
    if (stringMatchError) {
      throw new Error(`Error inspecting string match codes: ${stringMatchError.message}`);
    }
    
    console.log(`[Inspector] Found ${stringMatchCodes?.length || 0} codes with string deal_id match`);
    
    if (stringMatchCodes && stringMatchCodes.length > 0) {
      return {
        success: true,
        codesCount: stringMatchCodes.length,
        message: `Hittade ${stringMatchCodes.length} rabattkoder med deal_id som sträng ('${stringId}')`,
        codeType: 'string',
        sampleCodes: stringMatchCodes.slice(0, 3)
      };
    }
    
    // The error was in this line - we need to ensure numericDealId is treated as a number
    // after our earlier conversion and validation
    const normalizedId = normalizeId(numericDealId);
    
    // Sök efter koder med liknande ID för att hjälpa till med felsökning
    const { data: allCodes, error: allCodesError } = await supabase
      .from('discount_codes')
      .select('*')
      .limit(5)
      .order('created_at', { ascending: false });
      
    if (allCodesError) {
      throw new Error(`Error inspecting all codes: ${allCodesError.message}`);
    }
    
    console.log(`[Inspector] Sample of recent codes:`, allCodes);
    
    return {
      success: false,
      codesCount: 0,
      message: `Inga rabattkoder hittades för erbjudande ${numericDealId}. Senaste koder i systemet har deal_id = ${allCodes?.length ? allCodes.map(c => c.deal_id).join(', ') : 'ingen'}`,
      sampleCodes: allCodes || []
    };
  } catch (error) {
    console.error("[Inspector] Error during inspection:", error);
    return {
      success: false,
      codesCount: 0,
      message: `Fel vid inspektion: ${error instanceof Error ? error.message : 'Okänt fel'}`
    };
  }
};
