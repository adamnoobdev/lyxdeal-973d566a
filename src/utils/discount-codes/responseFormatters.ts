
/**
 * Formaterar ett framgångsrikt svar efter kodinspektionen
 */
export function prepareSuccessResponse(
  codes: any[], 
  method: string,
  tables: any[]
) {
  // Skapa exempel på koder att visa i gränssnittet (max 5)
  const sampleCodes = codes.slice(0, 5).map(code => ({
    code: code.code,
    dealId: code.deal_id,
    dealIdType: typeof code.deal_id,
    isUsed: code.is_used
  }));

  return {
    success: true,
    codesCount: codes.length,
    message: `Hittade ${codes.length} rabattkoder med ${method}`,
    sampleCodes,
    tables
  };
}

/**
 * Formaterar ett detaljerat felmeddelande när inga koder hittas
 */
export function prepareErrorResponse(
  originalDealId: string | number,
  numericDealId: number,
  stringDealId: string,
  allCodes: any[],
  dealIds: any[],
  dealIdTypes: string[],
  tables: any[],
  exactMatches: any[],
  stringMatches: any[]
) {
  // Hitta vilka deal_ids som faktiskt har koder i databasen
  const codesFoundForDeals = [...new Set(allCodes.map(c => c.deal_id))].filter(id => id !== null);
  
  // Skapa exempel på koder att visa i gränssnittet (max 5)
  const sample = allCodes.slice(0, 5).map(code => ({
    code: code.code,
    dealId: code.deal_id,
    dealIdType: typeof code.deal_id
  }));

  // Skapa anpassat meddelande baserat på vad vi hittade
  let message = 'Hittade 0 rabattkoder';
  if (codesFoundForDeals.length > 0) {
    message += ` men ingen för erbjudande ${originalDealId}`;
  } else {
    message += ' i databasen';
  }
  
  // Sammanfatta sökförsöken för debug-information
  const searchAttempts = {
    originalId: {
      id: originalDealId,
      type: typeof originalDealId,
      matches: 0
    },
    numericId: {
      id: numericDealId,
      type: typeof numericDealId,
      matches: exactMatches ? exactMatches.length : 0
    },
    stringId: {
      id: stringDealId,
      type: typeof stringDealId,
      matches: stringMatches ? stringMatches.length : 0
    }
  };

  return {
    success: false,
    message,
    codesCount: 0,
    dealIdsInDatabase: codesFoundForDeals,
    dealIdTypes,
    searchAttempts,
    codesFoundForDeals,
    sample,
    tables
  };
}
