
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo, normalizeId } from "./types";

/**
 * Hämtar en tillgänglig rabattkod för ett erbjudande
 */
export const getAvailableDiscountCode = async (dealId: number | string): Promise<string | null> => {
  try {
    const numericDealId = normalizeId(dealId);
    console.log(`[getAvailableDiscountCode] Looking for available code for deal ${numericDealId}`);
    
    // Använd array-resultat istället för single() för att undvika 406-fel
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
 * Markerar en rabattkod som använd och kopplar till kundinformation
 */
export const markDiscountCodeAsUsed = async (
  code: string, 
  customerInfo: CustomerInfo
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

/**
 * Genererar en ny rabattkod för ett erbjudande
 */
export const generateDiscountCode = async (dealId: number | string): Promise<string | null> => {
  try {
    const numericDealId = normalizeId(dealId);
    const code = generateRandomCode();
    
    console.log(`[generateDiscountCode] Creating new code ${code} for deal ${numericDealId}`);
    
    const { error, data } = await supabase
      .from("discount_codes")
      .insert({
        deal_id: numericDealId,
        code: code,
        is_used: false
      })
      .select();
      
    if (error) {
      console.error("[generateDiscountCode] Error creating code:", error);
      console.error("[generateDiscountCode] Error details:", error.details, error.message);
      return null;
    }
    
    console.log(`[generateDiscountCode] Successfully created code ${code} for deal ${numericDealId}`, data);
    return code;
  } catch (error) {
    console.error("[generateDiscountCode] Exception:", error);
    return null;
  }
};

// Hjälpfunktion för att generera slumpmässig rabattkod
const generateRandomCode = (length = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
