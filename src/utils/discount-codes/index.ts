import { supabase } from "@/integrations/supabase/client";
import { generateRandomCode } from "@/utils/discount-code-utils";
import { normalizeId } from "./types";
import { toast } from "sonner";

// Re-export functions from debug.ts
export { listAllDiscountCodes, countDiscountCodes, testDiscountCodeGeneration } from './debug';

// Re-export from removeAllCodes.ts
export { removeAllDiscountCodes } from './removeAllCodes';

/**
 * Generate a batch of discount codes for a deal
 */
export const generateDiscountCodes = async (
  dealId: number | string, 
  quantity: number = 10
): Promise<boolean> => {
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
export const getAvailableDiscountCode = async (dealId: number): Promise<string | null> => {
  try {
    console.log(`[getAvailableDiscountCode] Looking for code for deal ID: ${dealId}`);
    
    // Kontrollera att deal_id är ett giltigt nummer
    if (isNaN(dealId) || dealId <= 0) {
      console.error(`[getAvailableDiscountCode] Invalid dealId: ${dealId}`);
      return null;
    }

    // Säkerställ att erbjudandet kräver rabattkoder
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('requires_discount_code')
      .eq('id', dealId)
      .single();

    if (dealError || !deal) {
      console.error(`[getAvailableDiscountCode] Error fetching deal or deal not found:`, dealError);
      return null;
    }

    if (deal.requires_discount_code === false) {
      console.log(`[getAvailableDiscountCode] Deal ${dealId} does not require discount codes`);
      return null;
    }
    
    // Hämta alla oanvända koder för erbjudandet
    const { data: codes, error } = await supabase
      .from("discount_codes")
      .select("code")
      .eq("deal_id", dealId)
      .eq("is_used", false)
      .limit(1);
      
    if (error) {
      console.error("[getAvailableDiscountCode] Error fetching available discount code:", error);
      return null;
    }
    
    if (!codes || codes.length === 0) {
      console.log("[getAvailableDiscountCode] No available discount codes found for deal:", dealId);
      
      // Generera en ny kod om det inte finns några tillgängliga
      console.log("[getAvailableDiscountCode] Generating a new code for deal:", dealId);
      const newCode = generateRandomCode();
      
      // Skapa den nya koden i databasen
      const { error: createError } = await supabase
        .from("discount_codes")
        .insert({
          deal_id: dealId,
          code: newCode,
          is_used: false,
          created_at: new Date().toISOString()
        });
        
      if (createError) {
        console.error("[getAvailableDiscountCode] Error creating new discount code:", createError);
        return null;
      }
      
      console.log(`[getAvailableDiscountCode] Successfully created new code: ${newCode}`);
      return newCode;
    }
    
    console.log(`[getAvailableDiscountCode] Found code: ${codes[0].code}`);
    return codes[0].code;
  } catch (error) {
    console.error("[getAvailableDiscountCode] Exception fetching available discount code:", error);
    return null;
  }
};

/**
 * Mark a discount code as used
 */
export const markDiscountCodeAsUsed = async (
  code: string,
  customerData: { name: string; email: string; phone: string }
): Promise<boolean> => {
  try {
    console.log(`[markDiscountCodeAsUsed] Marking code ${code} as used for ${customerData.email}`);
    
    if (!code || code === 'DIRECT_BOOKING') {
      console.log('[markDiscountCodeAsUsed] Direct booking flow, no code to mark as used');
      return true; // Direkt bokning kräver ingen rabattkod att markera
    }
    
    const normalizedCode = code.trim().toUpperCase();
    console.log(`[markDiscountCodeAsUsed] Using normalized code: ${normalizedCode}`);
    
    // Hämta detaljer om koden för att säkerställa att den existerar och inte redan är använd
    let { data: existingCode, error: checkError } = await supabase
      .from("discount_codes")
      .select("code, is_used, deal_id")
      .eq("code", normalizedCode)
      .maybeSingle();
      
    // Om koden inte hittades med exakt matchning, prova en case-insensitive sökning
    if (!existingCode && !checkError) {
      console.log(`[markDiscountCodeAsUsed] Code not found with exact match, trying case-insensitive search`);
      
      // Utför en bredare sökning med ILIKE för att hitta koden oavsett skiftläge
      const { data: similarCodes, error: searchError } = await supabase
        .from("discount_codes")
        .select("code, is_used, deal_id")
        .ilike("code", normalizedCode)
        .limit(1);
        
      if (!searchError && similarCodes && similarCodes.length > 0) {
        existingCode = similarCodes[0];
        console.log(`[markDiscountCodeAsUsed] Found similar code: ${existingCode.code}`);
      } else if (searchError) {
        console.error("[markDiscountCodeAsUsed] Error in case-insensitive search:", searchError);
      }
    }
    
    if (checkError) {
      console.error("[markDiscountCodeAsUsed] Error checking discount code:", checkError);
      return false;
    }
    
    if (!existingCode) {
      console.error("[markDiscountCodeAsUsed] Code not found:", normalizedCode);
      
      // Försök skapa en ny kod med samma kod som användaren angett
      console.log(`[markDiscountCodeAsUsed] Attempting to create the missing code: ${normalizedCode}`);
      
      // Hämta först deal_id från URL:en eller någon annan källa
      const currentUrl = window.location.href;
      const dealIdMatch = currentUrl.match(/\/deal\/(\d+)/);
      const dealId = dealIdMatch ? parseInt(dealIdMatch[1]) : null;
      
      if (!dealId) {
        console.error("[markDiscountCodeAsUsed] Could not determine deal ID from URL");
        return false;
      }
      
      // Skapa koden och markera den som använd direkt
      const { error: createError } = await supabase
        .from("discount_codes")
        .insert({
          deal_id: dealId,
          code: normalizedCode,
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
        
      if (createError) {
        console.error("[markDiscountCodeAsUsed] Error creating missing code:", createError);
        return false;
      }
      
      console.log(`[markDiscountCodeAsUsed] Successfully created and marked code ${normalizedCode} as used`);
      return true;
    }
    
    if (existingCode.is_used) {
      console.error("[markDiscountCodeAsUsed] Code already used:", existingCode.code);
      return false;
    }
    
    // Använd den faktiska koden från databasen (inte den normaliserade)
    const actualCode = existingCode.code;
    console.log(`[markDiscountCodeAsUsed] Using actual code from DB: ${actualCode}`);
    
    // Markera koden som använd
    const { error } = await supabase
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
      .eq("code", actualCode);
      
    if (error) {
      console.error("[markDiscountCodeAsUsed] Error marking discount code as used:", error);
      return false;
    }
    
    console.log(`[markDiscountCodeAsUsed] Successfully marked code ${actualCode} as used`);
    return true;
  } catch (error) {
    console.error("[markDiscountCodeAsUsed] Exception marking discount code as used:", error);
    return false;
  }
};
