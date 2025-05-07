
import { directSearch } from "./search/directSearch";
import { numericSearch } from "./search/numericSearch";
import { stringSearch } from "./search/stringSearch";
import { prepareSearchIds } from "./idNormalizer";
import { logIdInfo } from "./types";

/**
 * Söker efter rabattkoder med flera olika metoder
 */
export async function searchDiscountCodesWithMultipleMethods(dealId: string | number) {
  try {
    logIdInfo("searchDiscountCodesWithMultipleMethods", dealId);
    
    // Steg 1: Förbered alla ID-värden
    const { numericDealId, stringDealId } = prepareSearchIds(dealId);
    
    // Steg 2: Försök med direkt sökning (utan konvertering)
    console.log("[searchDiscountCodesWithMultipleMethods] Trying direct search");
    const directResult = await directSearch(dealId);
    
    if (directResult.success && directResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${directResult.codes.length} codes with direct search`);
      return directResult.codes;
    }
    
    // Steg 3: Försök med numerisk sökning
    console.log("[searchDiscountCodesWithMultipleMethods] Trying numeric search");
    const numericResult = await numericSearch(numericDealId);
    
    if (numericResult.success && numericResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${numericResult.codes.length} codes with numeric search`);
      return numericResult.codes;
    }
    
    // Steg 4: Försök med string-baserad sökning
    console.log("[searchDiscountCodesWithMultipleMethods] Trying string search");
    const stringResult = await stringSearch(stringDealId);
    
    if (stringResult.success && stringResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${stringResult.codes.length} codes with string search`);
      return stringResult.codes;
    }
    
    // Steg 5: Om inget funkat, prova mer avancerade metoder eller returnera tom lista
    console.log("[searchDiscountCodesWithMultipleMethods] No codes found with any method");
    
    // Försök med en sista fallback-metod - inspektera koder
    try {
      console.log("[searchDiscountCodesWithMultipleMethods] Trying inspection as last resort");
      const inspectionResult = await import("./inspectionFlow").then(module => 
        module.runInspectionProcess(dealId)
      );
      
      if (inspectionResult.success) {
        // Check if the inspection result has 'codes' property
        if ('codes' in inspectionResult && Array.isArray(inspectionResult.codes) && inspectionResult.codes.length > 0) {
          console.log(`[searchDiscountCodesWithMultipleMethods] Found ${inspectionResult.codes.length} codes with inspection`);
          return inspectionResult.codes;
        }
        
        // If there's no 'codes' property but we have successful result with manualMatches
        if ('manualMatches' in inspectionResult && Array.isArray(inspectionResult.manualMatches) && inspectionResult.manualMatches.length > 0) {
          console.log(`[searchDiscountCodesWithMultipleMethods] Found ${inspectionResult.manualMatches.length} codes with manual matches`);
          return inspectionResult.manualMatches;
        }
      }
    } catch (error) {
      console.error("[searchDiscountCodesWithMultipleMethods] Error during inspection:", error);
    }
    
    // Ingenting funkade, returnera tom lista
    return [];
  } catch (error) {
    console.error("[searchDiscountCodesWithMultipleMethods] Exception:", error);
    return [];
  }
}
