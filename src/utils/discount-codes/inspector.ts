
// This file contains utility functions for inspecting discount codes in the database
import { supabase } from "@/integrations/supabase/client";
import { logIdInfo, logSearchAttempt } from "./types";
import { stringSearch } from "./search/stringSearch";
import { multiSearch } from "./search/multiSearch";
import { numericSearch } from "./search/numericSearch";
import { directSearch } from "./search/directSearch";
import { formatCodesResponse, formatErrorResponse } from "./responseFormatters";

/**
 * Normalizes a deal ID to ensure consistent handling of IDs that might be
 * stored in different formats across the database.
 */
export function normalizeId(dealId: number | string): number {
  if (typeof dealId === 'string') {
    return parseInt(dealId, 10);
  }
  return dealId;
}

/**
 * Main function to inspect discount codes for a deal in the database.
 * This is useful for debugging when codes aren't showing up in the UI.
 */
export async function inspectDiscountCodes(dealId: number | string) {
  try {
    console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ${dealId}`);
    logIdInfo("inspectDiscountCodes initial", dealId);

    // First attempt: direct search with the id as-is
    const directResult = await directSearch(dealId);
    if (directResult.success && directResult.codes.length > 0) {
      return formatCodesResponse(directResult.codes, "Direct search found codes.");
    }

    // Second attempt: numeric search (convert to number)
    const normalizedId = normalizeId(dealId);
    logIdInfo("inspectDiscountCodes normalized", normalizedId);
    const numericResult = await numericSearch(normalizedId);
    if (numericResult.success && numericResult.codes.length > 0) {
      return formatCodesResponse(numericResult.codes, "Numeric search found codes.");
    }

    // Third attempt: string search (convert to string)
    const stringResult = await stringSearch(normalizedId.toString());
    if (stringResult.success && stringResult.codes.length > 0) {
      // Detected string ID storage
      return formatCodesResponse(
        stringResult.codes, 
        "String search found codes. The deal_id is stored as a string in the database.",
        "string"
      );
    }

    // Final attempt: multi-search (try different variations)
    const multiResult = await multiSearch(dealId);
    if (multiResult.success && multiResult.codes.length > 0) {
      return formatCodesResponse(
        multiResult.codes, 
        `Multi-search found codes with type ${multiResult.foundType}.`,
        multiResult.foundType
      );
    }

    // No codes found after all attempts
    console.log(`[inspectDiscountCodes] No codes found for deal ${dealId} after all search attempts`);
    return formatErrorResponse("No discount codes found for this deal after trying multiple search methods.");
  } catch (error) {
    console.error(`[inspectDiscountCodes] Error inspecting codes for deal ${dealId}:`, error);
    return formatErrorResponse(
      `Error inspecting discount codes: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
