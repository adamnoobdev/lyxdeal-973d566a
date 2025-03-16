
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

/**
 * Försöker jämföra två deal IDs med flexibel typhantering
 * Returnerar true om IDs matchar oavsett typ
 */
export function compareIds(id1: string | number | null | undefined, id2: string | number | null | undefined): boolean {
  // Om båda är null/undefined
  if (id1 == null && id2 == null) return true;
  
  // Om bara en är null/undefined
  if (id1 == null || id2 == null) return false;
  
  // Direkt jämförelse
  if (id1 === id2) return true;
  
  // String-jämförelse
  if (String(id1) === String(id2)) return true;
  
  // Numerisk jämförelse
  try {
    if (Number(id1) === Number(id2)) return true;
  } catch (e) {
    // Ignorera fel vid konvertering
  }
  
  return false;
}
