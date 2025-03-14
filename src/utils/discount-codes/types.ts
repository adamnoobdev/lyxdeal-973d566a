
import { Database } from "@/integrations/supabase/types";

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface DiscountCodeInspectionResult {
  success: boolean;
  message: string;
  dealId: string | number;
  error?: any;
  codesCount?: number;
  sampleCodes?: Array<{
    code: string;
    isUsed?: boolean;
    createdAt?: string;
    dealId?: string | number;
    dealIdType?: string;
  }>;
  totalCodesInDatabase?: number;
  codesFoundForDeals?: (string | number)[];
  dealIdTypes?: string[];
  codeType?: string;
}

/**
 * Safely converts a deal ID to either string or number based on the database schema
 * This helps handle type mismatches between string and number IDs
 */
export function normalizeId(id: string | number): number {
  // If id is already a number, return it
  if (typeof id === 'number') {
    return id;
  }
  
  // If id is a string that can be parsed as a number, return the parsed number
  const parsedId = parseInt(id, 10);
  if (!isNaN(parsedId)) {
    return parsedId;
  }
  
  // If we can't safely convert to a number, log error and return a fallback
  console.error(`[normalizeId] Could not normalize ID: ${id}`);
  return -1; // Fallback invalid ID that won't match anything
}
