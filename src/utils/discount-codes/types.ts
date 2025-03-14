
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

// Add a utility function to help with type handling
export function normalizeId(id: string | number): string | number {
  return id;
}
