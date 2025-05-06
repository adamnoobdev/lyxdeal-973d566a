
import { supabase } from "@/integrations/supabase/client";
// Uppdatera import från utils/discount-codes med korrekta exportnamn
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discount-codes";
import { createNewDiscountCode, generateRandomCode } from "@/utils/discount-code-utils";

// Resten av filen behålls som den är
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
    
    // 1. Först försök garantera att det finns rabattkoder för erbjudandet
    await ensureDiscountCodesExist(dealId);
    
    // 2. Kontrollera om det redan finns rabattkoder direkt från databasen
    let code: string | null = null;
    const { data: existingCodes, error: codesError } = await supabase
      .from("discount_codes")
      .select("code")
      .eq("deal_id", dealId)
      .eq("is_used", false)
      .limit(1);
      
    if (codesError) {
      console.error("[secureDiscountCode] Error fetching discount codes directly:", codesError);
    } else if (existingCodes && existingCodes.length > 0) {
      code = existingCodes[0].code;
      console.log(`[secureDiscountCode] Found existing code directly from DB: ${code}`);
    } else {
      console.log("[secureDiscountCode] No existing codes found directly, will create new");
    }
    
    // 3. Om ingen kod hittades direkt, prova via getAvailableDiscountCode
    if (!code) {
      code = await getAvailableDiscountCode(dealId);
      console.log(`[secureDiscountCode] Result from getAvailableDiscountCode: ${code || 'no code found'}`);
    }
    
    // 4. Om fortfarande ingen kod, skapa en ny med retry-logik
    if (!code) {
      console.log("[secureDiscountCode] No discount code available, generating a new one");
      
      // Försök upp till 3 gånger att skapa en ny kod
      for (let attempt = 1; attempt <= 3; attempt++) {
        const newCode = generateRandomCode();
        console.log(`[secureDiscountCode] Attempt ${attempt}: Generating code ${newCode}`);
        
        const { data: insertResult, error: insertError } = await supabase
          .from("discount_codes")
          .insert({
            deal_id: dealId,
            code: newCode,
            is_used: false,
            created_at: new Date().toISOString()
          })
          .select();
          
        if (insertError) {
          console.error(`[secureDiscountCode] Failed to create code on attempt ${attempt}:`, insertError);
          
          // Om vi är på sista försöket och fortfarande har fel, returnera fel
          if (attempt === 3) {
            return { 
              success: false, 
              message: "Ett fel uppstod när en ny rabattkod skulle skapas. Vänligen försök igen." 
            };
          }
          
          // Annars fortsätt till nästa försök
          continue;
        }
        
        code = newCode;
        console.log(`[secureDiscountCode] Successfully created and confirmed new code in DB: ${code}`);
        break;
      }
    }
    
    // Kontrollera att vi faktiskt har en kod nu
    if (!code) {
      console.error("[secureDiscountCode] Failed to secure a discount code after all attempts");
      return { 
        success: false, 
        message: "Ett tekniskt fel uppstod. Vänligen försök igen senare." 
      };
    }
    
    // 5. Verifiera att koden verkligen finns i databasen innan vi fortsätter
    const { data: verifyCode, error: verifyError } = await supabase
      .from("discount_codes")
      .select("code, is_used")
      .eq("code", code)
      .maybeSingle();
      
    if (verifyError || !verifyCode) {
      console.error(`[secureDiscountCode] Failed to verify code ${code} in database:`, verifyError);
      
      // Försök skapa en ny kod som en nödlösning
      const fallbackCode = generateRandomCode();
      console.log(`[secureDiscountCode] Creating fallback code: ${fallbackCode}`);
      
      const { error: fallbackError } = await supabase
        .from("discount_codes")
        .insert({
          deal_id: dealId,
          code: fallbackCode,
          is_used: false,
          created_at: new Date().toISOString()
        });
      
      if (fallbackError) {
        console.error("[secureDiscountCode] Failed to create fallback code:", fallbackError);
        return { 
          success: false, 
          message: "Ett tekniskt fel uppstod. Vänligen försök igen senare."
        };
      }
      
      code = fallbackCode;
      console.log(`[secureDiscountCode] Created fallback code ${code} after verification failed`);
    } else if (verifyCode.is_used) {
      console.error(`[secureDiscountCode] Code ${code} already marked as used in database`);
      
      // Skapa en ny kod om den befintliga redan är använd
      const newCode = generateRandomCode();
      console.log(`[secureDiscountCode] Creating replacement code: ${newCode}`);
      
      const { error: newCodeError } = await supabase
        .from("discount_codes")
        .insert({
          deal_id: dealId,
          code: newCode,
          is_used: false,
          created_at: new Date().toISOString()
        });
      
      if (newCodeError) {
        console.error("[secureDiscountCode] Failed to create replacement code:", newCodeError);
        return { 
          success: false, 
          message: "Ett tekniskt fel uppstod. Vänligen försök igen senare."
        };
      }
      
      code = newCode;
      console.log(`[secureDiscountCode] Created replacement code ${code} for already used code`);
    }
    
    // 6. Markera koden som använd och associera med kunden
    // Försök up till 2 gånger om det misslyckas första gången
    let codeUpdated = false;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const { data: updateResult, error: updateError } = await supabase
        .from("discount_codes")
        .update({ 
          is_used: true,
          used_by_name: customerData.name,
          used_by_email: customerData.email,
          used_by_phone: customerData.phone,
          used_at: new Date().toISOString(),
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone
        })
        .eq("code", code)
        .select();
        
      if (updateError) {
        console.error(`[secureDiscountCode] Update attempt ${attempt} failed:`, updateError);
        
        if (attempt < 2) {
          console.log(`[secureDiscountCode] Retry ${attempt} to mark code as used`);
          // Kort fördröjning innan återförsök
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        codeUpdated = true;
        console.log(`[secureDiscountCode] Successfully marked code ${code} as used on attempt ${attempt}`);
        break;
      }
    }
    
    if (!codeUpdated) {
      console.error("[secureDiscountCode] Failed to mark code as used after retries");
      
      // Försök med en ny kod som en sista utväg
      const emergencyCode = generateRandomCode();
      console.log(`[secureDiscountCode] Creating and marking emergency code: ${emergencyCode}`);
      
      const { error: emergencyInsertError } = await supabase
        .from("discount_codes")
        .insert({
          deal_id: dealId,
          code: emergencyCode,
          is_used: true,
          used_by_name: customerData.name,
          used_by_email: customerData.email,
          used_by_phone: customerData.phone,
          used_at: new Date().toISOString(),
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone,
          created_at: new Date().toISOString()
        });
      
      if (emergencyInsertError) {
        console.error("[secureDiscountCode] Failed to create emergency code:", emergencyInsertError);
        return { 
          success: false, 
          message: "Ett fel uppstod när rabattkoden skulle kopplas till din profil." 
        };
      }
      
      code = emergencyCode;
      console.log(`[secureDiscountCode] Successfully created pre-used emergency code ${code}`);
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
 * Ensure that there are discount codes for a deal
 */
const ensureDiscountCodesExist = async (dealId: number): Promise<void> => {
  try {
    console.log(`[ensureDiscountCodesExist] Checking codes for deal ${dealId}`);
    
    // Kontrollera om det finns några koder för erbjudandet
    const { count, error } = await supabase
      .from("discount_codes")
      .select("*", { count: "exact", head: true })
      .eq("deal_id", dealId);
      
    if (error) {
      console.error("[ensureDiscountCodesExist] Error checking codes:", error);
      return;
    }
    
    // Om det inte finns några koder, skapa några
    if (count === 0 || !count) {
      console.log("[ensureDiscountCodesExist] No codes found, generating 5 new codes");
      
      const codes = [];
      for (let i = 0; i < 5; i++) {
        const newCode = generateRandomCode();
        codes.push({
          deal_id: dealId,
          code: newCode,
          is_used: false,
          created_at: new Date().toISOString()
        });
      }
      
      const { error: insertError } = await supabase
        .from("discount_codes")
        .insert(codes);
        
      if (insertError) {
        console.error("[ensureDiscountCodesExist] Error creating backup codes:", insertError);
      } else {
        console.log(`[ensureDiscountCodesExist] Successfully created 5 backup codes for deal ${dealId}`);
      }
    } else {
      console.log(`[ensureDiscountCodesExist] Found ${count} existing codes for deal ${dealId}`);
    }
  } catch (error) {
    console.error("[ensureDiscountCodesExist] Exception:", error);
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
    
    if (code === 'DIRECT_BOOKING') {
      // För direktbokning skapar vi ett annat slags inköpspost
      console.log(`[createPurchaseRecord] Creating direct booking purchase record`);
      const { error: directBookingError } = await supabase
        .from("purchases")
        .insert({
          customer_email: email,
          deal_id: Number(dealId),
          discount_code: 'DIRECT_BOOKING',
          status: 'direct_booking'
        });
        
      if (directBookingError) {
        console.error("Error creating direct booking purchase record:", directBookingError);
        return false;
      }
      
      return true;
    }
    
    // Kontrollera först att rabattkoden finns och är markerad som använd
    const { data: codeData, error: codeError } = await supabase
      .from("discount_codes")
      .select("is_used")
      .eq("code", code)
      .maybeSingle();
      
    if (codeError || !codeData) {
      console.error("Error verifying discount code for purchase record:", codeError);
      return false;
    }
    
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
