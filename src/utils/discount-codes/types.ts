
import { supabase } from "@/integrations/supabase/client";

/**
 * Customer information interface used when marking discount codes as used
 */
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Normaliserar ett ID till ett nummer för konsekvens
 * Hanterar både heltal och strängvärden av ID
 */
export const normalizeId = (id: number | string): number => {
  // Om id redan är ett nummer, returnera det direkt
  if (typeof id === 'number') {
    return id;
  }
  
  // Annars konvertera till nummer
  const numId = parseInt(id, 10);
  return isNaN(numId) ? 0 : numId;
};

/**
 * Jämför två ID-värden för equality efter normalisering
 */
export const compareIds = (id1: number | string, id2: number | string): boolean => {
  return normalizeId(id1) === normalizeId(id2);
};

/**
 * Loggar information om ID-värdet för felsökning
 */
export const logIdInfo = (contextName: string, id: number | string): void => {
  console.log(`[${contextName}] ID info:`, {
    value: id,
    type: typeof id,
    isNumber: typeof id === 'number',
    asNumber: typeof id === 'string' ? parseInt(id, 10) : id,
    isNaN: typeof id === 'string' ? isNaN(parseInt(id, 10)) : isNaN(id as number)
  });
};
