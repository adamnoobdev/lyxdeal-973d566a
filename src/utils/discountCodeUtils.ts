
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
  console.log(`Generating ${quantity} discount codes for deal ${dealId}`);
  
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

    // Insert all codes in a single database operation
    const { error } = await supabase
      .from('discount_codes')
      .insert(codes);

    if (error) {
      console.error('Error generating discount codes:', error);
      throw error;
    }
    
    console.log(`Successfully generated ${quantity} discount codes for deal ${dealId}`);
    return true;
  } catch (error) {
    console.error('Exception when generating discount codes:', error);
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
  // Fetch an unused discount code for a specific deal
  const { data, error } = await supabase
    .from('discount_codes')
    .select('id, code')
    .eq('deal_id', dealId)
    .eq('is_used', false)
    .limit(1);

  if (error) {
    console.error('Error fetching discount code:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null; // No available codes
  }

  return data[0].code;
};

/**
 * Marks a discount code as used and records customer information
 * 
 * @param code - The discount code to mark as used
 * @param customerInfo - Information about the customer who used the code
 * @returns Promise<boolean> - Whether the operation was successful
 */
export const markDiscountCodeAsUsed = async (
  code: string, 
  customerInfo: { name: string; email: string; phone: string }
): Promise<boolean> => {
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
    console.error('Error marking discount code as used:', error);
    throw error;
  }

  return true;
};
