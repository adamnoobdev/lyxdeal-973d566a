
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
  tables?: any[]; // Adding the missing property for database tables info
}

/**
 * Safely normalizes a deal ID to ensure it works with database queries
 * Handles string/number type conversions based on database requirements
 */
export function normalizeId(id: string | number): number {
  // If id is already a number, return it as is
  if (typeof id === 'number') {
    return id;
  }
  
  // If id is a string, try to parse it as a number
  const parsedId = Number(id);
  if (!isNaN(parsedId)) {
    console.log(`[normalizeId] Converted string ID "${id}" to number: ${parsedId}`);
    return parsedId;
  }
  
  // If conversion fails, we return 0 as a fallback (should never happen with proper IDs)
  console.warn(`[normalizeId] WARNING: Could not convert ID "${id}" to a number, using 0 as fallback`);
  return 0;
}
