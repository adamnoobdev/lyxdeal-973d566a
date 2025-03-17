
export type ValidDealId = number | string;

/**
 * Customer information type for discount code usage
 */
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Normaliserar ett ID till ett nummer
 */
export function normalizeId(id: string | number): number {
  if (typeof id === 'number') {
    return id;
  }
  
  if (typeof id === 'string') {
    // Ta bort eventuella icke-numeriska tecken och konvertera till nummer
    const numericId = Number(id.replace(/[^0-9]/g, ''));
    
    if (isNaN(numericId)) {
      throw new Error(`Could not convert ID to number: ${id}`);
    }
    
    return numericId;
  }
  
  throw new Error(`Invalid ID type: ${typeof id}`);
}

/**
 * Loggar ID-information för felsökning
 */
export function logIdInfo(context: string, id: any) {
  console.log(`[${context}] ID: ${id} (${typeof id})`);
}

/**
 * Jämför två ID:n för likhet efter normalisering
 */
export function compareIds(id1: ValidDealId, id2: ValidDealId): boolean {
  try {
    const normalizedId1 = normalizeId(id1);
    const normalizedId2 = normalizeId(id2);
    return normalizedId1 === normalizedId2;
  } catch (error) {
    console.error(`[compareIds] Error comparing IDs ${id1} and ${id2}:`, error);
    return false;
  }
}
