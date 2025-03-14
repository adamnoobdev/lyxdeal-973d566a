
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
  console.log(`[generateDiscountCodes] 🟢 STARTING generation of ${quantity} discount codes for deal ${dealId}`);
  
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

    console.log(`[generateDiscountCodes] Generated ${codes.length} unique codes for deal ${dealId}:`, 
      codes.map(c => c.code).join(', '));

    // Insert all codes in a single database operation
    const { data: insertData, error } = await supabase
      .from('discount_codes')
      .insert(codes);

    if (error) {
      console.error('[generateDiscountCodes] ❌ Error inserting codes:', error);
      throw error;
    }
    
    console.log(`[generateDiscountCodes] ✓ Successfully inserted ${codes.length} codes into database.`);
    
    // Wait a longer time to ensure the database transaction is complete
    console.log('[generateDiscountCodes] Waiting 3 seconds for database synchronization...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify that codes were actually created
    console.log('[generateDiscountCodes] Verifying codes were created in database...');
    const { data: verificationData, error: verificationError } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (verificationError) {
      console.error('[generateDiscountCodes] ❌ Error verifying discount codes:', verificationError);
      return false;
    }
    
    const count = verificationData?.length || 0;
    console.log(`[generateDiscountCodes] Verification result: ${count} discount codes found for deal ${dealId}`);
    
    // Log each code for verification purposes
    if (count > 0) {
      console.log('[generateDiscountCodes] Sample codes:',
        verificationData.slice(0, 3).map((c: any) => c.code).join(', '), 
        count > 3 ? `... and ${count - 3} more` : '');
      return true;
    } else {
      console.warn('[generateDiscountCodes] ⚠️ CRITICAL: No codes were found in verification check!');
      
      // Try one more time with an even longer delay
      console.log('[generateDiscountCodes] Trying final verification in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const { data: retryData, error: retryError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', dealId);
        
      if (retryError) {
        console.error('[generateDiscountCodes] ❌ Error in final verification:', retryError);
        return false;
      }
      
      const retryCount = retryData?.length || 0;
      console.log(`[generateDiscountCodes] Final verification: ${retryCount} codes found`);
      
      if (retryCount > 0) {
        console.log('[generateDiscountCodes] ✓ Codes appeared after additional delay');
        return true;
      } else {
        console.error('[generateDiscountCodes] ❌ CRITICAL: No codes found after multiple verification attempts!');
        return false;
      }
    }
  } catch (error) {
    console.error('[generateDiscountCodes] ❌❌ CRITICAL EXCEPTION when generating discount codes:', error);
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

/**
 * Checks if discount codes exist for a specific deal
 * This is useful for troubleshooting missing codes
 * 
 * @param dealId - The ID of the deal to check
 * @returns Promise with information about codes for this deal
 */
export const inspectDiscountCodes = async (dealId: number) => {
  console.log(`[inspectDiscountCodes] 🔍 Inspecting discount codes for deal ${dealId}...`);
  
  try {
    // First try a standard select
    console.log(`[inspectDiscountCodes] Querying discount_codes table for deal_id=${dealId}`);
    const { data: codes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (error) {
      console.error('[inspectDiscountCodes] ❌ Error querying codes:', error);
      return { success: false, error, message: 'Error querying discount codes' };
    }
    
    // Check if any codes were found
    if (!codes || codes.length === 0) {
      console.log(`[inspectDiscountCodes] ℹ️ No codes found for deal ${dealId} with standard query`);
      
      // Try a more general query to see if any codes exist at all
      console.log('[inspectDiscountCodes] Checking if any discount codes exist in the database...');
      const { data: allCodes, error: allCodesError } = await supabase
        .from('discount_codes')
        .select('deal_id, code')
        .limit(10);
        
      if (allCodesError) {
        console.error('[inspectDiscountCodes] ❌ Error checking all codes:', allCodesError);
        return { 
          success: false, 
          error: allCodesError, 
          message: 'Error checking all discount codes',
          dealId
        };
      }
      
      if (!allCodes || allCodes.length === 0) {
        console.log('[inspectDiscountCodes] ⚠️ No discount codes found in the database at all!');
        return { 
          success: false, 
          message: 'No discount codes found in the database at all', 
          dealId,
          totalCodesInDatabase: 0 
        };
      }
      
      // Show some example codes from other deals
      console.log(`[inspectDiscountCodes] Found ${allCodes.length} codes for other deals:`, 
        allCodes.map(c => `deal_id=${c.deal_id}, code=${c.code}`).join('; '));
      
      return { 
        success: false, 
        message: `No codes found for deal ${dealId}, but found codes for other deals`, 
        dealId,
        totalCodesInDatabase: allCodes.length,
        codesFoundForDeals: [...new Set(allCodes.map(c => c.deal_id))]
      };
    }
    
    // Codes were found, return details
    console.log(`[inspectDiscountCodes] ✓ Found ${codes.length} codes for deal ${dealId}`);
    console.log('[inspectDiscountCodes] Sample codes:', 
      codes.slice(0, 3).map(c => c.code).join(', '), 
      codes.length > 3 ? `... and ${codes.length - 3} more` : '');
    
    return { 
      success: true, 
      message: `Found ${codes.length} codes for deal ${dealId}`, 
      dealId,
      codesCount: codes.length,
      sampleCodes: codes.slice(0, 5).map(c => ({ 
        code: c.code, 
        isUsed: c.is_used,
        createdAt: c.created_at
      }))
    };
  } catch (error) {
    console.error('[inspectDiscountCodes] ❌❌ CRITICAL EXCEPTION when inspecting codes:', error);
    return { 
      success: false, 
      error, 
      message: 'Critical exception when inspecting discount codes',
      dealId
    };
  }
};

