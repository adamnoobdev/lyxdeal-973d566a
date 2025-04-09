
/**
 * Log search results in a consistent format
 */
export function logSearchResults(methodName: string, dealId: any, results: any[] | null) {
  if (!results || results.length === 0) {
    console.log(`[${methodName}] No matching codes found for ID: ${dealId}`);
    return;
  }
  
  console.log(`[${methodName}] Found ${results.length} codes for ID: ${dealId}`);
  
  // Log a sample of the first code for debugging
  if (results.length > 0) {
    const sample = results[0];
    console.log(`[${methodName}] Sample code:`, {
      id: sample.id,
      code: sample.code,
      deal_id: sample.deal_id,
      deal_id_type: typeof sample.deal_id,
      is_used: sample.is_used
    });
  }
}
