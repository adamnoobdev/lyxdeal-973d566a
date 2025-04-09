
import { supabase } from "@/integrations/supabase/client";
import { generateRandomCode } from "@/utils/discount-code-utils";
import { normalizeId } from "./types";
import { toast } from "sonner";

// Import specific functions from debug.ts to avoid name conflicts
import { 
  listAllDiscountCodes,
  testDiscountCodeGeneration,
  countDiscountCodes
} from './debug';

// Re-export functions from debug.ts with explicit imports
export { 
  listAllDiscountCodes,
  testDiscountCodeGeneration,
  countDiscountCodes
};

// Export from removeAllCodes.ts - we don't export removeAllDiscountCodes from here
// to avoid the conflict with the same-named function in debug.ts
export * from './removeAllCodes';

/**
 * Generate a batch of discount codes for a deal
 */
export const generateDiscountCodes = async (dealId: number | string, quantity: number = 10): Promise<boolean> => {
  try {
    // Normalize the deal ID to ensure we always store it as a number in the database
    const numericDealId = normalizeId(dealId);
    
    console.log(`[generateDiscountCodes] Generating ${quantity} codes for deal ID: ${numericDealId} (${typeof numericDealId})`);
    
    if (numericDealId <= 0) {
      console.error('[generateDiscountCodes] Invalid deal ID:', dealId);
      toast.error('Ett fel uppstod vid generering av rabattkoder: Ogiltigt erbjudande-ID');
      return false;
    }

    // First, verify the deal exists and requires discount codes
    const { data: dealData, error: dealError } = await supabase
      .from('deals')
      .select('requires_discount_code, title')
      .eq('id', numericDealId)
      .single();

    if (dealError) {
      console.error('[generateDiscountCodes] Error fetching deal:', dealError);
      toast.error('Kunde inte hämta erbjudandeinformation');
      return false;
    }

    if (!dealData) {
      console.error('[generateDiscountCodes] Deal not found:', numericDealId);
      toast.error('Erbjudandet hittades inte');
      return false;
    }

    if (dealData.requires_discount_code === false) {
      console.warn('[generateDiscountCodes] Deal does not require discount codes:', numericDealId);
      toast.warning('Detta erbjudande använder inte rabattkoder');
      return false;
    }

    // Generate the codes
    const codes = [];
    for (let i = 0; i < quantity; i++) {
      codes.push({
        deal_id: numericDealId,
        code: generateRandomCode(),
        is_used: false,
        created_at: new Date().toISOString()
      });
    }

    // Insert the codes
    const { error: insertError } = await supabase
      .from('discount_codes')
      .insert(codes);

    if (insertError) {
      console.error('[generateDiscountCodes] Error inserting codes:', insertError);
      toast.error('Ett fel uppstod vid generering av rabattkoder');
      return false;
    }

    console.log(`[generateDiscountCodes] Successfully generated ${quantity} codes for deal ID ${numericDealId}`);
    return true;
  } catch (error) {
    console.error('[generateDiscountCodes] Exception:', error);
    toast.error('Ett fel uppstod vid generering av rabattkoder');
    return false;
  }
};

/**
 * Get an available discount code for a deal
 */
export const getAvailableDiscountCode = async (dealId: number | string): Promise<string | null> => {
  try {
    const numericDealId = normalizeId(dealId);
    console.log(`[getAvailableDiscountCode] Looking for available code for deal ${numericDealId}`);
    
    // Use array-result instead of single() to avoid 406-errors
    const { data, error } = await supabase
      .from("discount_codes")
      .select("code")
      .eq("deal_id", numericDealId)
      .eq("is_used", false)
      .limit(1);
      
    if (error) {
      console.error("[getAvailableDiscountCode] Error fetching code:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.warn("[getAvailableDiscountCode] No available codes found");
      return null;
    }
    
    console.log(`[getAvailableDiscountCode] Found code: ${data[0].code}`);
    return data[0].code;
  } catch (error) {
    console.error("[getAvailableDiscountCode] Exception:", error);
    return null;
  }
};

/**
 * Mark a discount code as used
 */
export const markDiscountCodeAsUsed = async (
  code: string, 
  customerInfo: { name: string; email: string; phone: string }
): Promise<boolean> => {
  try {
    console.log(`[markDiscountCodeAsUsed] Marking code ${code} as used by ${customerInfo.email}`);
    
    const { error } = await supabase
      .from("discount_codes")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone
      })
      .eq("code", code);
      
    if (error) {
      console.error("[markDiscountCodeAsUsed] Error updating code:", error);
      return false;
    }
    
    console.log(`[markDiscountCodeAsUsed] Successfully marked code ${code} as used`);
    return true;
  } catch (error) {
    console.error("[markDiscountCodeAsUsed] Exception:", error);
    return false;
  }
};
