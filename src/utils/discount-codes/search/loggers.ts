
import { normalizeId } from "../types";

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
 * Loggar resultat av en databassökning
 */
export function logSearchResults(
  methodName: string,
  dealId: string | number,
  results: any[] | null
): void {
  if (results && results.length > 0) {
    console.log(`[${methodName}] Found ${results.length} codes for deal ID ${dealId}`);
  } else {
    console.log(`[${methodName}] No codes found for deal ID ${dealId}`);
  }
}
