
/**
 * Förbereder svaret för lyckad sökning
 */
export function prepareSuccessResponse(matchedCodes: any[], searchMethod: string, tables: any) {
  return {
    success: true,
    message: `Hittade ${matchedCodes.length} rabattkoder med ${searchMethod}`,
    codesCount: matchedCodes.length,
    sampleCodes: matchedCodes.slice(0, 3).map(code => ({
      code: code.code,
      isUsed: code.is_used,
      dealId: code.deal_id,
      dealIdType: typeof code.deal_id
    })),
    searchMethod,
    tables
  };
}

/**
 * Förbereder svaret för misslyckad sökning
 */
export function prepareErrorResponse(dealId: string | number, numericDealId: number, stringDealId: string, allCodes: any[], dealIds: any[], dealIdTypes: string[], tables: any, exactMatches?: any[], stringMatches?: any[]) {
  return {
    success: false,
    message: `Hittade ${allCodes.length} rabattkoder men ingen för erbjudande ${dealId}`,
    codesCount: 0,
    codesFoundForDeals: dealIds,
    dealIdTypes,
    searchAttempts: {
      originalId: {
        id: dealId,
        type: typeof dealId,
        matches: 0 // originalMatches saknas här, hanteras i inspector.ts
      },
      numericId: {
        id: numericDealId,
        type: typeof numericDealId,
        matches: exactMatches?.length || 0
      },
      stringId: {
        id: stringDealId,
        type: typeof stringDealId,
        matches: stringMatches?.length || 0
      }
    },
    sample: allCodes.slice(0, 5).map(code => ({
      id: code.id,
      code: code.code,
      dealId: code.deal_id,
      dealIdType: typeof code.deal_id,
      isUsed: code.is_used
    })),
    tables
  };
}
