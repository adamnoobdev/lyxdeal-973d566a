
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo, normalizeId } from "./types";

/**
 * Hämtar en tillgänglig (oanvänd) rabattkod för ett erbjudande
 */
export const getAvailableDiscountCode = async (dealId: string | number): Promise<string | null> => {
  console.log(`[getAvailableDiscountCode] Fetching unused discount code for deal ${dealId} (type: ${typeof dealId})`);
  
  // Convert to normalized ID for database query (ensuring it's a number)
  const normalizedId = normalizeId(dealId);
  console.log(`[getAvailableDiscountCode] Using normalized ID: ${normalizedId} (type: ${typeof normalizedId})`);
  
  // Try with the normalized deal ID first (now guaranteed to be a number)
  let { data, error } = await supabase
    .from('discount_codes')
    .select('id, code')
    .eq('deal_id', normalizedId)
    .eq('is_used', false)
    .limit(1);

  if (error) {
    console.error('[getAvailableDiscountCode] Error fetching discount code:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log(`[getAvailableDiscountCode] No codes found with primary ID type, trying string comparison`);
    
    // If no results, try string comparison as fallback
    const originalIdAsString = String(dealId);
    
    // Get all unused codes
    const { data: allCodes, error: allCodesError } = await supabase
      .from('discount_codes')
      .select('id, code, deal_id')
      .eq('is_used', false);
      
    if (allCodesError) {
      console.error('[getAvailableDiscountCode] Error in fallback query:', allCodesError);
      return null;
    }
    
    if (allCodes && allCodes.length > 0) {
      // Filter by string comparison
      const matchingCode = allCodes.find(code => String(code.deal_id) === originalIdAsString);
      
      if (matchingCode) {
        console.log(`[getAvailableDiscountCode] Found code with string comparison: ${matchingCode.code}`);
        return matchingCode.code;
      }
    }
    
    console.log(`[getAvailableDiscountCode] No codes found for deal ${dealId} using either method`);
    return null;
  }

  console.log(`[getAvailableDiscountCode] Found code: ${data[0].code} for deal ${dealId}`);
  return data[0].code;
};

/**
 * Markerar en rabattkod som använd
 */
export const markDiscountCodeAsUsed = async (
  code: string, 
  customerInfo: CustomerInfo
): Promise<boolean> => {
  console.log(`[markDiscountCodeAsUsed] Marking code ${code} as used for customer ${customerInfo.name}`);
  
  const { error } = await supabase
    .from('discount_codes')
    .update({
      is_used: true, 
      used_at: new Date().toISOString(),
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone
    })
    .eq('code', code);

  if (error) {
    console.error('[markDiscountCodeAsUsed] Error marking discount code as used:', error);
    throw error;
  }

  console.log(`[markDiscountCodeAsUsed] Successfully marked code ${code} as used`);
  return true;
};
