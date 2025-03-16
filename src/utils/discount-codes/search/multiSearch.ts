
import { normalizeId, logIdInfo } from "../types";
import { toast } from "sonner";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { searchWithNumericId } from "./numericSearch";
import { searchWithOriginalId } from "./originalIdSearch";
import { searchWithStringId } from "./stringSearch";
import { getAllCodesAndFilter } from "./manualSearch";
import { performDirectSearch } from "./directSearch";
import { logSearchAttempt } from "./loggers";
import { supabase } from "@/integrations/supabase/client";

/**
 * Huvudfunktion som söker rabattkoder med flera olika metoder
 */
export async function searchDiscountCodesWithMultipleMethods(
  dealId: string | number | undefined
): Promise<DiscountCode[]> {
  if (!dealId) {
    console.log('[searchDiscountCodes] No dealId provided, returning empty list');
    return [];
  }

  console.log(`[searchDiscountCodes] Fetching discount codes for deal ID: ${dealId} (${typeof dealId})`);
  
  try {
    // Spara originalt ID för loggning och felsökning
    const originalId = dealId;
    
    // Normalisera ID till olika format för att testa olika sökmetoder
    let numericId: number;
    try {
      numericId = normalizeId(dealId);
    } catch (error) {
      console.error(`[searchDiscountCodes] Failed to normalize ID: ${error}`);
      numericId = typeof dealId === 'number' ? dealId : parseInt(String(dealId), 10);
      if (isNaN(numericId)) {
        numericId = 0; // Fallback till ett default värde
      }
    }
    
    const stringId = String(dealId);
    
    // Logga sökförsök för felsökning
    logSearchAttempt('searchDiscountCodes', originalId, numericId, stringId);
    
    // Hämta även alla rabattkoder för felsökning
    const { data: allCodes } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(10);
      
    if (allCodes && allCodes.length > 0) {
      const uniqueDealIds = [...new Set(allCodes.map(c => c.deal_id))];
      console.log(`[searchDiscountCodes] First 10 codes in database have deal_ids: ${JSON.stringify(uniqueDealIds)}`);
    } else {
      console.log(`[searchDiscountCodes] No codes found in first 10 records`);
    }
    
    // Steg 1: Försök med exakt numerisk match först (mest troligt)
    const numericMatches = await searchWithNumericId(numericId, 'searchDiscountCodes');
    if (numericMatches.length > 0) {
      return numericMatches;
    }
    
    // Steg 2: Försök med originalID (som det är, utan konvertering)
    const originalMatches = await searchWithOriginalId(originalId, 'searchDiscountCodes');
    if (originalMatches.length > 0) {
      return originalMatches;
    }
    
    // Steg 3: Försök med string-ID
    const stringMatches = await searchWithStringId(stringId, 'searchDiscountCodes');
    if (stringMatches.length > 0) {
      return stringMatches;
    }
    
    // Steg 4: Hämta alla koder och filtrera manuellt som absolut sista utväg
    const manualMatches = await getAllCodesAndFilter(originalId, numericId, stringId, 'searchDiscountCodes');
    if (manualMatches.length > 0) {
      return manualMatches;
    }
    
    // Steg 5: Försök med en mer direkt sökning för att dubbelkolla
    const directMatches = await performDirectSearch(numericId, 'searchDiscountCodes');
    if (directMatches.length > 0) {
      return directMatches;
    }
    
    // Logga ett detaljerat meddelande om vi inte hittade några koder
    console.log(`[searchDiscountCodes] Comprehensive search for deal ID ${dealId} returned no results.`);
    console.log(`[searchDiscountCodes] Attempted with types: original(${typeof originalId}), number(${typeof numericId}), string(${typeof stringId})`);
    console.log(`[searchDiscountCodes] Attempted with values: original(${originalId}), number(${numericId}), string(${stringId})`);
    
    return [];
  } catch (fetchError) {
    console.error("[searchDiscountCodes] Critical exception fetching discount codes:", fetchError);
    toast.error("Kunde inte hämta rabattkoder", {
      description: "Ett tekniskt fel uppstod. Försök igen senare."
    });
    throw fetchError;
  }
}
