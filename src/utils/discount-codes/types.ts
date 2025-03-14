
/**
 * Common types for discount code functionality
 */

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface DiscountCodeInspectionResult {
  success: boolean;
  message: string;
  dealId?: number | string;
  codesCount?: number;
  totalCodesInDatabase?: number;
  codesFoundForDeals?: (number | string)[];
  dealIdTypes?: string[];
  sampleCodes?: Array<{
    code: string;
    isUsed?: boolean;
    createdAt?: string;
    dealId?: number | string;
    dealIdType?: string;
  }>;
  codeType?: string;
  error?: any;
}
