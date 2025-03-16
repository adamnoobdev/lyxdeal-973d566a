
/**
 * Analyserar kod-resultat för manuell matchning
 */
export function analyzeCodesAndFindMatches(allCodes: any[], originalDealId: string | number, numericDealId: number, stringDealId: string) {
  // Om inga koder alls hittades i databasen
  if (!allCodes || allCodes.length === 0) {
    console.log(`[analyzeCodesAndFindMatches] No discount codes found in database`);
    return { success: false, codesCount: 0 };
  }
  
  // Detaljerad analys av alla deal_ids i databasen
  const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
  const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
  
  console.log(`[analyzeCodesAndFindMatches] Found the following deal_ids:`, dealIds);
  console.log(`[analyzeCodesAndFindMatches] Deal ID types in database: ${dealIdTypes.join(', ')}`);
  
  // Försök via manuell jämförelse (javascript sida) som absolut fallback
  const manualMatches = allCodes.filter(code => {
    const codeId = code.deal_id;
    return String(codeId) === stringDealId || 
           Number(codeId) === numericDealId || 
           codeId === originalDealId;
  });
  
  if (manualMatches.length > 0) {
    console.log(`[analyzeCodesAndFindMatches] Found ${manualMatches.length} codes with manual comparison`);
    return { 
      success: true, 
      codesCount: manualMatches.length, 
      manualMatches,
      dealIds,
      dealIdTypes 
    };
  }
  
  return { 
    success: false, 
    codesCount: 0,
    dealIds,
    dealIdTypes 
  };
}
