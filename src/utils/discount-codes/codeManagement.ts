
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "./types";

/**
 * Hämtar en tillgänglig (oanvänd) rabattkod för ett erbjudande
 */
export const getAvailableDiscountCode = async (dealId: number | string): Promise<string | null> => {
  console.log(`[getAvailableDiscountCode] Fetching unused discount code for deal ${dealId}`);
  
  // Konvertera till numeriskt för konsekvens
  const numericDealId = Number(dealId);
  
  const { data, error } = await supabase
    .from('discount_codes')
    .select('id, code')
    .eq('deal_id', numericDealId)
    .eq('is_used', false)
    .limit(1);

  if (error) {
    console.error('[getAvailableDiscountCode] Error fetching discount code:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    // Försök med dealId som string om inget hittades
    const dealIdStr = String(dealId);
    console.log(`[getAvailableDiscountCode] No codes found with numeric ID, trying with string ID: "${dealIdStr}"`);
    
    const { data: strData, error: strError } = await supabase
      .from('discount_codes')
      .select('id, code')
      .eq('deal_id', dealIdStr)
      .eq('is_used', false)
      .limit(1);
      
    if (strError) {
      console.error('[getAvailableDiscountCode] Error fetching with string ID:', strError);
      return null;
    }
    
    if (!strData || strData.length === 0) {
      console.log(`[getAvailableDiscountCode] No available codes found for deal ${dealId} (tried both number and string)`);
      return null;
    }
    
    console.log(`[getAvailableDiscountCode] Found code with string ID: ${strData[0].code}`);
    return strData[0].code;
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
