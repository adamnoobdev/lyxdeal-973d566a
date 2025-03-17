export type ValidDealId = number | string;

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
