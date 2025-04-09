
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Log search attempts for debugging
 */
export function logSearchAttempt(method: string, dealId: any, verbose = false) {
  console.log(`[${method}] Searching for codes with dealId: ${dealId} (${typeof dealId})`);
  
  if (verbose) {
    console.log(`[${method}] dealId stringified: "${String(dealId)}"`);
    console.log(`[${method}] dealId as number: ${Number(dealId)}`);
  }
}

/**
 * Log ID info in a consistent format
 */
export function logIdInfo(context: string, id: any) {
  if (id === undefined || id === null) {
    console.log(`[${context}] ID is undefined or null`);
    return;
  }
  
  console.log(`[${context}] ID: ${id}, Type: ${typeof id}`);
}

/**
 * Normalize ID to numeric format for database queries
 */
export function normalizeId(id: string | number | undefined): number {
  if (id === undefined || id === null) {
    console.error("Attempting to normalize undefined/null ID");
    return 0;
  }
  
  if (typeof id === 'number') {
    return id;
  }
  
  const parsed = Number(id);
  if (isNaN(parsed)) {
    console.error(`Invalid ID format: "${id}" cannot be converted to number`);
    return 0;
  }
  
  return parsed;
}
