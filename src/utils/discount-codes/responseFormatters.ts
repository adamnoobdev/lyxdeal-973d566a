
/**
 * Format the response for found discount codes
 */
export function formatCodesResponse(codes, message, foundType = null) {
  return {
    success: true,
    codes,
    codesCount: codes.length,
    message,
    foundType
  };
}

/**
 * Format an error response when no codes are found
 */
export function formatErrorResponse(message) {
  return {
    success: false,
    codes: [],
    codesCount: 0,
    message
  };
}

/**
 * Prepare a success response with detailed information
 */
export function prepareSuccessResponse(codes, method, tables) {
  return {
    success: true,
    codes,
    codesCount: codes.length,
    message: `Hittade ${codes.length} rabattkoder med ${method}.`,
    tables,
    foundWith: method
  };
}

/**
 * Prepare a detailed error response for debugging
 */
export function prepareErrorResponse(
  originalDealId,
  numericDealId,
  stringDealId,
  allCodes,
  dealIds,
  dealIdTypes,
  tables,
  exactMatches,
  stringMatches
) {
  return {
    success: false,
    codes: [], // Adding codes property to ensure consistency
    codesCount: 0,
    message: `Kunde inte hitta rabattkoder för erbjudande ID: ${originalDealId}`,
    debug: {
      searchedFor: {
        originalDealId,
        numericDealId,
        stringDealId
      },
      dbInfo: {
        totalCodes: allCodes.length,
        uniqueDealIds: dealIds,
        dealIdTypes: [...dealIdTypes],
        exactMatchesFound: exactMatches?.length || 0,
        stringMatchesFound: stringMatches?.length || 0
      }
    },
    tables
  };
}
