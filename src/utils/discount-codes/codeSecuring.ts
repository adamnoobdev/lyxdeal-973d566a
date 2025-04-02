
import { supabase } from "@/integrations/supabase/client";
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discount-codes";
import { createNewDiscountCode, generateRandomCode } from "@/utils/discount-code-utils";

/**
 * Secures a discount code for a user
 */
export const secureDiscountCode = async (
  dealId: number, 
  customerData: { 
    name: string; 
    email: string; 
    phone: string 
  }
): Promise<{ success: boolean; code?: string; message?: string }> => {
  try {
    // 1. Try to fetch an available discount code
    let code = await getAvailableDiscountCode(dealId);
    
    // 2. If no code is available, generate a new one
    if (!code) {
      console.log("No discount code available, generating a new one");
      const newCode = generateRandomCode();
      const codeCreated = await createNewDiscountCode(dealId, newCode);
      
      if (!codeCreated) {
        return { 
          success: false, 
          message: "Ett fel uppstod när en ny rabattkod skulle skapas." 
        };
      }
      
      code = newCode;
    }
    
    // 3. Mark the code as used and associate with customer
    const codeUpdated = await markDiscountCodeAsUsed(code, {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone
    });
    
    if (!codeUpdated) {
      return { 
        success: false, 
        message: "Ett fel uppstod när rabattkoden skulle kopplas till din profil." 
      };
    }
    
    return {
      success: true,
      code
    };
  } catch (error) {
    console.error("Error securing discount code:", error);
    return {
      success: false,
      message: "Ett fel uppstod vid säkring av rabattkod."
    };
  }
};

/**
 * Creates a purchase record for tracking and analytics
 */
export const createPurchaseRecord = async (
  email: string,
  dealId: number,
  code: string
): Promise<boolean> => {
  try {
    const { error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        customer_email: email,
        deal_id: Number(dealId),
        discount_code: code,
      });
      
    if (purchaseError) {
      console.error("Error creating purchase record:", purchaseError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception creating purchase record:", error);
    return false;
  }
};
