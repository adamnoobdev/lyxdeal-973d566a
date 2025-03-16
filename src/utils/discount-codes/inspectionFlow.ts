
import { getTableInfo } from "./tableManagement";
import { 
  getTableAccess, 
  countAllCodesInDatabase, 
  searchExactMatches, 
  searchStringMatches, 
  getAllCodesForInspection 
} from "./databaseAccess";
import { analyzeCodesAndFindMatches } from "./analysisUtils";
import { prepareSuccessResponse, prepareErrorResponse } from "./responseFormatters";
import { prepareSearchIds } from "./idNormalizer";

/**
 * Kör sökningen efter rabattkoder med standardmetoder
 */
export async function performStandardSearch(numericDealId: number, originalDealId: string | number, stringDealId: string) {
  // 1. Exakt match på normaliserad ID
  const exactMatchesResult = await searchExactMatches(numericDealId);
  const exactMatches = exactMatchesResult.success ? exactMatchesResult.data : [];
  
  // 2. Exakt match på original-ID (säkerställ att det är jämförbart)
  let originalMatches: any[] = [];
  if (typeof originalDealId === 'number' || !isNaN(Number(originalDealId))) {
    try {
      const originalIdAsNumber = typeof originalDealId === 'number' 
        ? originalDealId 
        : Number(originalDealId);
        
      if (!isNaN(originalIdAsNumber)) {
        const originalMatchesResult = await searchExactMatches(originalIdAsNumber);
        originalMatches = originalMatchesResult.success ? originalMatchesResult.data : [];
      }
    } catch (error) {
      console.error(`[performStandardSearch] Error searching with original ID:`, error);
      originalMatches = [];
    }
  }
  
  // 3. Exakt match på string-ID
  const stringMatchesResult = await searchStringMatches(stringDealId);
  const stringMatches = stringMatchesResult.success ? stringMatchesResult.data : [];
  
  // Kombinera resultaten 
  const foundCodes = exactMatches?.length ? exactMatches : 
                     originalMatches?.length ? originalMatches : 
                     stringMatches?.length ? stringMatches : [];
  
  return {
    foundCodes,
    exactMatches,
    originalMatches,
    stringMatches
  };
}

/**
 * Utför stegen för att inspektera rabattkoder
 */
export async function runInspectionProcess(dealId: number | string) {
  try {
    console.log(`[runInspectionProcess] Starting inspection for deal ID: ${dealId}`);
    
    // Steg 1: Förbered IDs för sökning
    const { originalDealId, numericDealId, stringDealId } = prepareSearchIds(dealId);
    
    // Steg 2: Inspektera tabellstruktur
    const tables = await getTableInfo();
    
    // Steg 3: Testa åtkomst till rabattkoder-tabellen
    const tableAccessResult = await getTableAccess();
    if (!tableAccessResult.success) {
      return {
        success: false,
        message: "Problem med åtkomst till rabattkodstabellen",
        error: tableAccessResult.error,
        tables
      };
    }
    
    // Steg 4: Kontrollera total antal rabattkoder i databasen
    const countResult = await countAllCodesInDatabase();
    if (!countResult.success) {
      return {
        success: false,
        message: "Problem med att räkna rabattkoder",
        error: countResult.error,
        tables
      };
    }
    
    // Steg 5: Försök med olika standardmetoder att hitta rabattkoder
    const { foundCodes, exactMatches, stringMatches } = await performStandardSearch(
      numericDealId, 
      originalDealId, 
      stringDealId
    );
    
    // Om vi hittade koder med standardmetoderna, returnera dem
    if (foundCodes.length > 0) {
      console.log(`[runInspectionProcess] Found ${foundCodes.length} codes with standard search methods`);
      return prepareSuccessResponse(foundCodes, "standardsökningsmetoder", tables);
    }
    
    // Steg 6: Hämta alla koder för att inspektera och analysera manuellt
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
    
    // Steg 7: Analysera alla koder och försök hitta matchningar manuellt
    const analysisResult = analyzeCodesAndFindMatches(allCodes, originalDealId, numericDealId, stringDealId);
    
    if (analysisResult.success) {
      return prepareSuccessResponse(
        analysisResult.manualMatches, 
        "manuell jämförelse", 
        tables
      );
    }
    
    // Steg 8: Visa detaljerad felrapport om vi inte hittade några matchande koder
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
    console.error(`[runInspectionProcess] Exception during inspection:`, error);
    return {
      success: false,
      message: "Ett oväntat fel uppstod vid inspektion",
      error
    };
  }
}
