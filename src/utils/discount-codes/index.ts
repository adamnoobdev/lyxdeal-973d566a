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
      const codeCreated = await createNewDiscountCodeAndReturn(dealId, newCode);
      return codeCreated ? newCode : null;
    }
    
    console.log(`[getAvailableDiscountCode] Found code: ${codes[0].code}`);
    return codes[0].code;
  } catch (error) {
    console.error("[getAvailableDiscountCode] Exception fetching available discount code:", error);
    return null;
  }
};

// Ny hjälpfunktion för att skapa en kod och omedelbart returnera den
const createNewDiscountCodeAndReturn = async (dealId: number, code: string): Promise<boolean> => {
  try {
    console.log(`[createNewDiscountCodeAndReturn] Creating new code ${code} for deal ${dealId}`);
    
    const { error } = await supabase
      .from("discount_codes")
      .insert({
        deal_id: dealId,
        code: code,
        is_used: false,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("[createNewDiscountCodeAndReturn] Error creating discount code:", error);
      return false;
    }
    
    console.log(`[createNewDiscountCodeAndReturn] Successfully created code ${code} for deal ${dealId}`);
    return true;
  } catch (error) {
    console.error("[createNewDiscountCodeAndReturn] Exception:", error);
    return false;
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
    
    // Check if the code exists first
    const { data: existingCode, error: checkError } = await supabase
      .from("discount_codes")
      .select("code, is_used")
      .eq("code", code)
      .maybeSingle();
    
    if (checkError) {
      console.error("[markDiscountCodeAsUsed] Error checking discount code:", checkError);
      return false;
    }
    
    if (!existingCode) {
      console.error("[markDiscountCodeAsUsed] Code not found:", code);
      return false;
    }
    
    if (existingCode.is_used) {
      console.error("[markDiscountCodeAsUsed] Code already used:", code);
      return false;
    }
    
    // Mark the code as used
    const { error } = await supabase
      .from("discount_codes")
      .update({ 
        is_used: true,
        used_by_name: customerData.name,
        used_by_email: customerData.email,
        used_by_phone: customerData.phone,
        used_at: new Date().toISOString()
      })
      .eq("code", code);
      
    if (error) {
      console.error("[markDiscountCodeAsUsed] Error marking discount code as used:", error);
      return false;
    }
    
    console.log(`[markDiscountCodeAsUsed] Successfully marked code ${code} as used`);
    return true;
  } catch (error) {
    console.error("[markDiscountCodeAsUsed] Exception marking discount code as used:", error);
    return false;
  }
};
