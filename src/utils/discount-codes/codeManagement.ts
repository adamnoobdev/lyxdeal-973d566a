
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo, normalizeId } from "./types";

/**
 * Hämtar en tillgänglig rabattkod för ett erbjudande
 */
export const getAvailableDiscountCode = async (dealId: number | string): Promise<string | null> => {
  try {
    const numericDealId = normalizeId(dealId);
    console.log(`[getAvailableDiscountCode] Looking for available code for deal ${numericDealId}`);
    
    const { data, error } = await supabase
      .from("discount_codes")
      .select("code")
      .eq("deal_id", numericDealId)
      .eq("is_used", false)
      .limit(1)
      .single();
      
    if (error) {
      console.error("[getAvailableDiscountCode] Error fetching code:", error);
      
      if (error.code === "PGRST116") {
        console.warn("[getAvailableDiscountCode] No available codes found");
        return null;
      }
      
      throw error;
    }
    
    console.log(`[getAvailableDiscountCode] Found code: ${data.code}`);
    return data.code;
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
    console.log(`[markDiscountCodeAsUsed] Marking code ${code} as used`);
    
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
