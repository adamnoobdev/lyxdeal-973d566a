
import { normalizeId } from "./types";

/**
 * Förbereder och normaliserar IDs för sökning efter rabattkoder
 */
export function prepareSearchIds(dealId: number | string) {
  // Spara originalt ID för loggning och felsökning
  const originalDealId = dealId;
  
  // Normalisera deal ID för konsekvens (men håll reda på original för jämförelse)
  let numericDealId: number;
  try {
    numericDealId = normalizeId(dealId);
  } catch (error) {
    console.error(`[prepareSearchIds] Failed to normalize ID: ${error}`);
    numericDealId = typeof dealId === 'number' ? dealId : parseInt(String(dealId), 10);
    if (isNaN(numericDealId)) {
      numericDealId = 0; // Fallback till ett default värde
    }
  }
  
  const stringDealId = String(dealId);
  
  console.log(`[prepareSearchIds] Original deal ID: ${originalDealId} (${typeof originalDealId})`);
  console.log(`[prepareSearchIds] Normalized deal ID: ${numericDealId} (${typeof numericDealId})`);
  console.log(`[prepareSearchIds] String deal ID: ${stringDealId} (${typeof stringDealId})`);
  
  return {
    originalDealId,
    numericDealId,
    stringDealId
  };
}
