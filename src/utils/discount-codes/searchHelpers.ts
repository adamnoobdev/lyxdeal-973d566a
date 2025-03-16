
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";
import { normalizeId } from "./types";
import { toast } from "sonner";

/**
 * Loggar detaljerad information om försök att hitta rabattkoder
 */
export function logSearchAttempt(
  methodName: string, 
  originalId: string | number, 
  numericId: number, 
  stringId: string
): void {
  console.log(`[${methodName}] Original ID: ${originalId} (${typeof originalId})`);
  console.log(`[${methodName}] Normalized numeric ID: ${numericId} (${typeof numericId})`);
  console.log(`[${methodName}] String ID: ${stringId} (${typeof stringId})`);
}

/**
 * Söker efter rabattkoder med exakt nummer-ID
 */
export async function searchWithNumericId(
  numericId: number,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    console.log(`[${methodName}] Trying with numeric ID: ${numericId}`);
    
    const { data: numericMatches, error: numericError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericId);

    if (numericError) {
      console.error(`[${methodName}] Error using numeric ID:`, numericError);
      return [];
    } 
    
    if (numericMatches && numericMatches.length > 0) {
      console.log(`[${methodName}] Found ${numericMatches.length} codes using numeric ID ${numericId}`);
      return numericMatches as DiscountCode[];
    }
    
    console.log(`[${methodName}] No codes found using numeric ID ${numericId}`);
    return [];
  } catch (error) {
    console.error(`[${methodName}] Exception searching with numeric ID:`, error);
    return [];
  }
}

/**
 * Söker efter rabattkoder med original-ID
 */
export async function searchWithOriginalId(
  originalId: string | number,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    if (typeof originalId !== 'number' && isNaN(Number(originalId))) {
      console.log(`[${methodName}] Original ID is not a valid number: ${originalId}`);
      return [];
    }
    
    // Konvertera originalId till number för databasförfrågan
    const originalIdAsNumber = typeof originalId === 'number' 
      ? originalId 
      : Number(originalId);
      
    console.log(`[${methodName}] Trying with original ID as number: ${originalIdAsNumber}`);
    
    const { data: originalMatches, error: originalError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", originalIdAsNumber);
      
    if (originalError) {
      console.error(`[${methodName}] Error using original ID:`, originalError);
      return [];
    } 
    
    if (originalMatches && originalMatches.length > 0) {
      console.log(`[${methodName}] Found ${originalMatches.length} codes using original ID ${originalId}`);
      return originalMatches as DiscountCode[];
    }
    
    console.log(`[${methodName}] No codes found using original ID ${originalId}`);
    return [];
  } catch (error) {
    console.error(`[${methodName}] Exception searching with original ID:`, error);
    return [];
  }
}

/**
 * Söker efter rabattkoder med string-ID konverterat till nummer
 */
export async function searchWithStringId(
  stringId: string,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    const stringIdAsNumber = Number(stringId);
    
    if (isNaN(stringIdAsNumber)) {
      console.log(`[${methodName}] String ID cannot be converted to a valid number: ${stringId}`);
      return [];
    }
    
    console.log(`[${methodName}] Trying with string ID as number: ${stringIdAsNumber}`);
    
    const { data: stringMatches, error: stringError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", stringIdAsNumber);
      
    if (stringError) {
      console.error(`[${methodName}] Error using string ID as number:`, stringError);
      return [];
    }
    
    if (stringMatches && stringMatches.length > 0) {
      console.log(`[${methodName}] Found ${stringMatches.length} codes using string ID ${stringId} as number`);
      return stringMatches as DiscountCode[];
    }
    
    console.log(`[${methodName}] No codes found using string ID ${stringId} as number`);
    return [];
  } catch (error) {
    console.error(`[${methodName}] Exception searching with string ID:`, error);
    return [];
  }
}

/**
 * Hämtar alla rabattkoder för manuell filtrering
 */
export async function getAllCodesAndFilter(
  originalId: string | number,
  numericId: number,
  stringId: string,
  methodName: string
): Promise<DiscountCode[]> {
  try {
    console.log(`[${methodName}] No codes found with direct queries, trying with manual filtering`);
    
    const { data: allCodes, error: allCodesError } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(100);
        
    if (allCodesError) {
      console.error(`[${methodName}] Error fetching all codes:`, allCodesError);
      return [];
    }
    
    if (!allCodes || allCodes.length === 0) {
      console.log(`[${methodName}] No discount codes found in database at all`);
      return [];
    }
    
    // Logga typer och värden på deal_ids i databasen för felsökning
    const dealIdsInDb = [...new Set(allCodes.map(c => c.deal_id))].filter(id => id !== null);
    const dealIdTypesInDb = [...new Set(allCodes.map(c => typeof c.deal_id))];
    
    console.log(`[${methodName}] All deal_ids in database:`, dealIdsInDb);
    console.log(`[${methodName}] Deal ID types in database:`, dealIdTypesInDb);
    console.log(`[${methodName}] Sample codes:`, allCodes.slice(0, 3));
    
    // Manuell filtrering med olika jämförelsemetoder
    const manualMatches = allCodes.filter(code => {
      const codeId = code.deal_id;
      
      // Försök att matcha med olika metoder
      if (codeId === null) return false;
      
      // 1. Direkt jämförelse
      if (codeId === originalId) return true;
      
      // 2. String-jämförelse
      if (String(codeId) === stringId) return true;
      
      // 3. Numerisk jämförelse
      try {
        if (Number(codeId) === numericId) return true;
      } catch (e) {
        // Ignorera fel vid numerisk konvertering
      }
      
      return false;
    });
    
    if (manualMatches.length > 0) {
      console.log(`[${methodName}] Found ${manualMatches.length} codes with manual filtering`);
      return manualMatches as DiscountCode[];
    }
    
    console.log(`[${methodName}] No matching codes found after all attempts`);
    return [];
  } catch (error) {
    console.error(`[${methodName}] Exception during manual filtering:`, error);
    return [];
  }
}

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
    
    // Försök med en mer direkt sökning för att dubbelkolla
    console.log(`[searchDiscountCodes] Trying one last direct query with numeric ID ${numericId}`);
    const { data: directMatches, error: directError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("deal_id", numericId);
      
    if (directError) {
      console.error(`[searchDiscountCodes] Error in direct query:`, directError);
    } else if (directMatches && directMatches.length > 0) {
      console.log(`[searchDiscountCodes] Found ${directMatches.length} matches in direct query`);
      return directMatches as DiscountCode[];
    } else {
      console.log(`[searchDiscountCodes] No matches found in direct query either`);
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
