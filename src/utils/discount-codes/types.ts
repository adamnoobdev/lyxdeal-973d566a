
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
  
  console.log(`[normalizeId] Konverterade ${id} (${typeof id}) till ${parsed} (number)`);
  return parsed;
}

/**
 * Debug-hjälpfunktion för att kontrollera status på ID-värden
 */
export function logIdInfo(prefix: string, id: string | number | undefined): void {
  if (id === undefined) {
    console.log(`[${prefix}] ID är undefined`);
    return;
  }
  
  console.log(`[${prefix}] ID: ${id} (${typeof id})`);
  
  if (typeof id === 'string') {
    const numericValue = parseInt(id, 10);
    console.log(`[${prefix}] ID som nummer: ${numericValue} (${isNaN(numericValue) ? 'Ogiltig konvertering' : 'Giltig konvertering'})`);
  }
}
