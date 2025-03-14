
import { supabase } from "@/integrations/supabase/client";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a random discount code with the specified length
 */
export const generateRandomCode = (length: number = 8): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return code;
};

/**
 * Generates unique discount codes for a deal and stores them in the database
 * 
 * @param dealId - The ID of the deal to generate codes for
 * @param quantity - The number of discount codes to generate
 * @returns Promise<boolean> - Whether the operation was successful
 */
export const generateDiscountCodes = async (dealId: number, quantity: number = 10): Promise<boolean> => {
  console.log(`[generateDiscountCodes] Starting generation of ${quantity} discount codes for deal ${dealId}`);
  
  try {
    // Create a set to ensure unique codes
    const codeSet = new Set<string>();
    
    // Generate unique codes until we have the required quantity
    while (codeSet.size < quantity) {
      codeSet.add(generateRandomCode());
    }
    
    // Create all codes upfront as an array of objects
    const codes = Array.from(codeSet).map(code => ({
      deal_id: dealId,
      code,
      is_used: false
    }));

    // Log generated codes for debugging
    console.log(`[generateDiscountCodes] Generated ${codes.length} unique codes for deal ${dealId}:`, 
      codes.map(c => c.code).join(', '));

    // Insert all codes in a single database operation
    const { data: insertData, error } = await supabase
      .from('discount_codes')
      .insert(codes);

    if (error) {
      console.error('[generateDiscountCodes] Error inserting codes:', error);
      throw error;
    }
    
    console.log(`[generateDiscountCodes] Successfully inserted ${codes.length} codes into database. Insert result:`, insertData);
    
    // Wait a short moment to ensure the database transaction is complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify that codes were actually created
    console.log('[generateDiscountCodes] Verifying codes were created in database...');
    const { data: verificationData, error: verificationError } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (verificationError) {
      console.error('[generateDiscountCodes] Error verifying discount codes:', verificationError);
      return false;
    }
    
    const count = verificationData?.length || 0;
    console.log(`[generateDiscountCodes] Verification result: ${count} discount codes found for deal ${dealId}`);
    
    // Log each code for verification purposes
    if (count > 0) {
      console.log('[generateDiscountCodes] Sample codes:',
        verificationData.slice(0, 3).map((c: any) => c.code).join(', '), 
        count > 3 ? `... and ${count - 3} more` : '');
    } else {
      console.warn('[generateDiscountCodes] ⚠️ CRITICAL: No codes were found in verification check!');
      console.log('[generateDiscountCodes] Trying again in 3 seconds...');
      
      // Last attempt if no codes were found
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { data: retryData } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', dealId);
        
      const retryCount = retryData?.length || 0;
      console.log(`[generateDiscountCodes] Re-verify attempt: ${retryCount} codes found`);
      
      return retryCount > 0;
    }
    
    return count > 0;
  } catch (error) {
    console.error('[generateDiscountCodes] Exception when generating discount codes:', error);
    // Return false instead of throwing the error further
    // so that calling code can continue even if code generation fails
    return false;
  }
};

/**
 * Gets an available (unused) discount code for a deal
 * 
 * @param dealId - The ID of the deal to get a code for
 * @returns Promise<string | null> - The discount code or null if none available
 */
export const getAvailableDiscountCode = async (dealId: number): Promise<string | null> => {
  console.log(`[getAvailableDiscountCode] Fetching unused discount code for deal ${dealId}`);
  
  // Fetch an unused discount code for a specific deal
  const { data, error } = await supabase
    .from('discount_codes')
    .select('id, code')
    .eq('deal_id', dealId)
    .eq('is_used', false)
    .limit(1);

  if (error) {
    console.error('[getAvailableDiscountCode] Error fetching discount code:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log(`[getAvailableDiscountCode] No available codes found for deal ${dealId}`);
    return null; // No available codes
  }

  console.log(`[getAvailableDiscountCode] Found code: ${data[0].code} for deal ${dealId}`);
  return data[0].code;
};

export const markDiscountCodeAsUsed = async (
  code: string, 
  customerInfo: { name: string; email: string; phone: string }
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
