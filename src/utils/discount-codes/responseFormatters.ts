
/**
 * Format a successful response with discount codes
 */
export function formatCodesResponse(codes: any[], message: string, foundType?: string) {
  return {
    success: true,
    codes,
    message,
    foundType,
    codesCount: codes.length
  };
}

/**
 * Format an error response
 */
export function formatErrorResponse(errorMessage: string) {
  return {
    success: false,
    codes: [],
    message: errorMessage,
    codesCount: 0
  };
}

/**
 * Prepare a success response with detailed information
 */
export function prepareSuccessResponse(codes: any[], method: string, tables?: any) {
  return {
    success: true,
    codes,
    message: `Hittade ${codes.length} rabattkoder med ${method}`,
    codesCount: codes.length,
    method,
    tables,
    sampleCodes: codes.slice(0, 3)
  };
}

/**
 * Prepare a detailed error response
 */
export function prepareErrorResponse(
  dealId: string | number,
  numericDealId: number,
  stringDealId: string,
  allCodes: any[],
  dealIds?: any[],
  dealIdTypes?: Set<string>,
  tables?: any,
  exactMatches?: any[],
  stringMatches?: any[]
) {
  return {
    success: false,
    codes: [],
    codesCount: 0,
    message: `Kunde inte hitta rabattkoder för erbjudande ${dealId}`,
    searchedIds: {
      originalId: dealId,
      numericId: numericDealId,
      stringId: stringDealId
    },
    totalCodesInDatabase: allCodes.length,
    dealIds,
    dealIdTypes: dealIdTypes ? Array.from(dealIdTypes) : [],
    tables,
    exactMatches,
    stringMatches,
    sampleCodes: allCodes.slice(0, 3)
  };
}
