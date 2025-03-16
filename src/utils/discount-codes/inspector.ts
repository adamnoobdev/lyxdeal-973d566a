import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";
import { getTableInfo } from "./tableManagement";
import {
  getTableAccess,
  countAllCodesInDatabase,
  searchExactMatches,
  searchStringMatches,
  getAllCodesForInspection,
  analyzeCodesAndFindMatches,
  prepareSuccessResponse,
  prepareErrorResponse
} from "./inspectorHelpers";

/**
 * Inspekterar rabattkoder för ett erbjudande och försöker hitta problem
 */
export const inspectDiscountCodes = async (dealId: number | string): Promise<any> => {
  try {
    console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ID: ${dealId}`);
    
    // Normalisera deal ID för konsekvens (men håll reda på original för jämförelse)
    const originalDealId = dealId;
    
    // Använd try-catch för att hantera normaliseringsproblem
    let numericDealId: number;
    try {
      numericDealId = normalizeId(dealId);
    } catch (error) {
      console.error(`[inspectDiscountCodes] Failed to normalize ID: ${error}`);
      numericDealId = typeof dealId === 'number' ? dealId : parseInt(String(dealId), 10);
      if (isNaN(numericDealId)) {
        numericDealId = 0; // Fallback till ett default värde
      }
    }
    
    const stringDealId = String(dealId);
    
    console.log(`[inspectDiscountCodes] Original deal ID: ${originalDealId} (${typeof originalDealId})`);
    console.log(`[inspectDiscountCodes] Normalized deal ID: ${numericDealId} (${typeof numericDealId})`);
    console.log(`[inspectDiscountCodes] String deal ID: ${stringDealId} (${typeof stringDealId})`);
    
    // Inspektera tabellstruktur
    const tables = await getTableInfo();
    
    // Testa åtkomst till rabattkoder-tabellen
    const tableAccessResult = await getTableAccess();
    if (!tableAccessResult.success) {
      return {
        success: false,
        message: "Problem med åtkomst till rabattkodstabellen",
        error: tableAccessResult.error,
        tables
      };
    }
    
    // Kontrollera total antal rabattkoder i databasen
    const countResult = await countAllCodesInDatabase();
    if (!countResult.success) {
      return {
        success: false,
        message: "Problem med att räkna rabattkoder",
        error: countResult.error,
        tables
      };
    }
    
    // Försök med olika metoder att hitta rabattkoder
    const tables = await getTableInfo();
    
    // 1. Exakt match på normaliserad ID
    const exactMatchesResult = await searchExactMatches(numericDealId);
    const exactMatches = exactMatchesResult.success ? exactMatchesResult.data : [];
    
    // 2. Exakt match på original-ID (säkerställ att det är jämförbart)
    let originalMatches: any[] = [];
    if (typeof originalDealId === 'number' || !isNaN(Number(originalDealId))) {
      // Vi måste använda originalDealId direkt här eftersom searchExactMatches förväntar sig ett number
      // och vi har inget sätt att veta om originalDealId redan är ett number eller inte
      try {
        // Om det är ett number eller kan konverteras till ett number utan problem, använd searchExactMatches
        const originalIdAsNumber = typeof originalDealId === 'number' 
          ? originalDealId 
          : Number(originalDealId);
          
        if (!isNaN(originalIdAsNumber)) {
          const originalMatchesResult = await searchExactMatches(originalIdAsNumber);
          originalMatches = originalMatchesResult.success ? originalMatchesResult.data : [];
        }
      } catch (error) {
        console.error(`[inspectDiscountCodes] Error searching with original ID:`, error);
        originalMatches = [];
      }
    }
    
    // 3. Exakt match på string-ID
    const stringMatchesResult = await searchStringMatches(stringDealId);
    const stringMatches = stringMatchesResult.success ? stringMatchesResult.data : [];
    
    // Om vi hittade något med någon av metoderna, använd den
    const foundCodes = exactMatches?.length ? exactMatches : 
                      originalMatches?.length ? originalMatches : 
                      stringMatches?.length ? stringMatches : [];
    
    if (foundCodes.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${foundCodes.length} codes with standard search methods`);
      return prepareSuccessResponse(foundCodes, "standardsökningsmetoder", tables);
    }
    
    // Hämta alla koder för att inspektera och analysera manuellt
    const allCodesResult = await getAllCodesForInspection();
    if (!allCodesResult.success) {
      return { 
        success: false, 
        message: "Ett fel uppstod vid hämtning av alla rabattkoder",
        error: allCodesResult.error,
        tables
      };
    }
    
    const allCodes = allCodesResult.data;
    
    // Analysera alla koder och försök hitta matchningar manuellt
    const analysisResult = analyzeCodesAndFindMatches(allCodes, originalDealId, numericDealId, stringDealId);
    
    if (analysisResult.success) {
      return prepareSuccessResponse(
        analysisResult.manualMatches, 
        "manuell jämförelse", 
        tables
      );
    }
    
    // Visa detaljerad felrapport om vi inte hittade några matchande koder
    return prepareErrorResponse(
      dealId,
      numericDealId,
      stringDealId,
      allCodes,
      analysisResult.dealIds,
      analysisResult.dealIdTypes,
      tables,
      exactMatches,
      stringMatches
    );
  } catch (error) {
    console.error(`[inspectDiscountCodes] Exception during inspection:`, error);
    return {
      success: false,
      message: "Ett oväntat fel uppstod vid inspektion",
      error
    };
  }
};
