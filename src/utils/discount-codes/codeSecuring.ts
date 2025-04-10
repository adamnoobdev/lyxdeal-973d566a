
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
    console.log(`[secureDiscountCode] Attempting to secure code for deal ${dealId}`);
    
    // Validera kunddata
    if (!customerData.name || !customerData.email || !customerData.phone) {
      console.error('[secureDiscountCode] Invalid customer data:', customerData);
      return {
        success: false,
        message: 'Vänligen fyll i alla fält korrekt'
      };
    }

    // Kontrollera att erbjudandet använder rabattkoder
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('requires_discount_code, booking_url')
      .eq('id', dealId)
      .maybeSingle();

    if (dealError) {
      console.error('[secureDiscountCode] Error fetching deal:', dealError);
      return {
        success: false,
        message: 'Kunde inte hämta erbjudandeinformation'
      };
    }

    if (!deal) {
      console.error('[secureDiscountCode] Deal not found:', dealId);
      return {
        success: false,
        message: 'Erbjudandet hittades inte'
      };
    }

    if (deal.requires_discount_code === false) {
      console.log(`[secureDiscountCode] Deal ${dealId} does not require discount codes, using direct booking`);
      return {
        success: true,
        code: 'DIRECT_BOOKING',
        message: 'Detta erbjudande använder direkt bokning'
      };
    }
    
    // 1. Try to fetch an available discount code
    let code = await getAvailableDiscountCode(dealId);
    
    // 2. If no code is available, generate a new one
    if (!code) {
      console.log("[secureDiscountCode] No discount code available, generating a new one");
      const newCode = generateRandomCode();
      const codeCreated = await createNewDiscountCode(dealId, newCode);
      
      if (!codeCreated) {
        console.error("[secureDiscountCode] Failed to create new discount code");
        return { 
          success: false, 
          message: "Ett fel uppstod när en ny rabattkod skulle skapas." 
        };
      }
      
      code = newCode;
      console.log(`[secureDiscountCode] New code generated: ${code}`);
    } else {
      console.log(`[secureDiscountCode] Found available code: ${code}`);
    }
    
    // 3. Mark the code as used and associate with customer
    const codeUpdated = await markDiscountCodeAsUsed(code, {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone
    });
    
    if (!codeUpdated) {
      console.error("[secureDiscountCode] Failed to mark code as used");
      return { 
        success: false, 
        message: "Ett fel uppstod när rabattkoden skulle kopplas till din profil." 
      };
    }
    
    console.log(`[secureDiscountCode] Successfully secured code ${code} for ${customerData.email}`);
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
    console.log(`[createPurchaseRecord] Creating record for ${email}, deal ${dealId}, code ${code}`);
    
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
    
    console.log(`[createPurchaseRecord] Successfully created purchase record`);
    return true;
  } catch (error) {
    console.error("Exception creating purchase record:", error);
    return false;
  }
};
