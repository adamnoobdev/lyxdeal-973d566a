
import { directSearch } from "./search/directSearch";
import { numericSearch } from "./search/numericSearch";
import { stringSearch } from "./search/stringSearch";
import { multiSearch } from "./search/multiSearch";
import { normalizeId } from "./types";

/**
 * Comprehensive search for discount codes using multiple methods
 */
export async function searchDiscountCodesWithMultipleMethods(dealId: string | number | undefined) {
  if (!dealId) {
    console.log("[searchDiscountCodesWithMultipleMethods] No dealId provided");
    return [];
  }
  
  try {
    console.log(`[searchDiscountCodesWithMultipleMethods] Searching for codes with dealId: ${dealId} (type: ${typeof dealId})`);
    
    // Try direct search first (should handle most cases)
    const directResult = await directSearch(dealId);
    if (directResult.success && directResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${directResult.codes.length} codes with direct search`);
      return directResult.codes;
    }
    
    // Try with normalized numeric ID next
    const numericDealId = normalizeId(dealId);
    const numericResult = await numericSearch(numericDealId);
    if (numericResult.success && numericResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${numericResult.codes.length} codes with numeric search`);
      return numericResult.codes;
    }
    
    // Try with string conversion
    const stringResult = await stringSearch(String(dealId));
    if (stringResult.success && stringResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${stringResult.codes.length} codes with string search`);
      return stringResult.codes;
    }
    
    // As a last resort, try multi-search with different variations
    const multiResult = await multiSearch(dealId);
    if (multiResult.success && multiResult.codes.length > 0) {
      console.log(`[searchDiscountCodesWithMultipleMethods] Found ${multiResult.codes.length} codes with multi search`);
      return multiResult.codes;
    }
    
    console.log("[searchDiscountCodesWithMultipleMethods] No codes found after trying all search methods");
    return [];
  } catch (error) {
    console.error("[searchDiscountCodesWithMultipleMethods] Error:", error);
    return [];
  }
}

/**
 * Search with logging for discount codes
 */
export async function searchWithLogging(dealId: any, methodName: string): Promise<any[]> {
  console.log(`[${methodName}] Searching for codes with dealId: ${dealId} (${typeof dealId})`);
  
  // Normalize the ID for consistent database queries
  const numericDealId = normalizeId(dealId);
  
  const result = await directSearch(numericDealId);
  return result.success ? result.codes : [];
}
