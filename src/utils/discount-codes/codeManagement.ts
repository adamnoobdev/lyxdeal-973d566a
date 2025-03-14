
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo, normalizeId } from "./types";

/**
 * Hämtar en tillgänglig (oanvänd) rabattkod för ett erbjudande
 */
export const getAvailableDiscountCode = async (dealId: string | number): Promise<string | null> => {
  console.log(`[getAvailableDiscountCode] Fetching unused discount code for deal ${dealId}`);
  
  // Try with the deal ID as-is first
  const { data, error } = await supabase
    .from('discount_codes')
    .select('id, code')
    .eq('deal_id', normalizeId(dealId))
    .eq('is_used', false)
    .limit(1);

  if (error) {
    console.error('[getAvailableDiscountCode] Error fetching discount code:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    // If no results with original ID type, try with the opposite type (string->number or number->string)
    const altDealId = typeof dealId === 'string' ? Number(dealId) : String(dealId);
    console.log(`[getAvailableDiscountCode] No codes found with original ID type, trying with: ${altDealId}`);
    
    const { data: altData, error: altError } = await supabase
      .from('discount_codes')
      .select('id, code')
      .eq('deal_id', normalizeId(altDealId))
      .eq('is_used', false)
      .limit(1);
      
    if (altError) {
      console.error('[getAvailableDiscountCode] Error fetching with alternative ID type:', altError);
      return null;
    }
    
    if (!altData || altData.length === 0) {
      console.log(`[getAvailableDiscountCode] No available codes found for deal ${dealId} (tried both types)`);
      return null;
    }
    
    console.log(`[getAvailableDiscountCode] Found code with alternative ID type: ${altData[0].code}`);
    return altData[0].code;
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
