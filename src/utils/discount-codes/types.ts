
// CustomerInfo interface for consistent customer data handling
export interface CustomerInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
}

/**
 * Normalize deal ID to ensure consistent comparison
 * Can handle string or number input and return a number
 */
export function normalizeId(id: string | number): number {
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) {
      console.warn(`[normalizeId] Could not parse ID: ${id}, defaulting to 0`);
      return 0;
    }
    return parsed;
  }
  return id;
}

/**
 * Compare two IDs (string or number) for equality
 */
export function compareIds(id1: string | number | undefined, id2: string | number | undefined): boolean {
  if (id1 === undefined || id2 === undefined) return false;
  
  // Convert both to strings for comparison to handle different types
  return String(id1) === String(id2);
}

/**
 * Log information about an ID for debugging
 */
export function logIdInfo(context: string, id: string | number): void {
  console.log(`[${context}] ID: ${id}, Type: ${typeof id}`);
}

/**
 * Log search attempt information for debugging
 */
export function logSearchAttempt(method: string, id: string | number, result: boolean): void {
  console.log(`[Search] Method: ${method}, ID: ${id}, Success: ${result}`);
}
