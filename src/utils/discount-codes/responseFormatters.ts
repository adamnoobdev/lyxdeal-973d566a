
/**
 * Format a successful response with discount codes
 */
export function formatCodesResponse(codes: any[], message: string, foundType?: string) {
  return {
    success: true,
    codes,
    message,
    foundType
  };
}

/**
 * Format an error response
 */
export function formatErrorResponse(errorMessage: string) {
  return {
    success: false,
    codes: [],
    message: errorMessage
  };
}
