
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Konverterar ett ID-värde till rätt numeriskt format för databasoperationer.
 * Hanterar både string och number, returnerar alltid ett number-värde.
 */
export function normalizeId(id: string | number): number {
  if (typeof id === 'number') {
    return id;
  }
  
  // För strings, använd parseInt och kontrollera att resultatet är ett giltigt nummer
  const parsed = parseInt(id, 10);
  
  if (isNaN(parsed)) {
    console.error(`[normalizeId] Ogiltigt ID-format: "${id}"`);
    throw new Error(`Ogiltigt ID-format: ${id}`);
  }
  
  return parsed;
}
