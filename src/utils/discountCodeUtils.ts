
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
  
  if (!dealId) {
    console.error('[generateDiscountCodes] ❌ Invalid dealId provided:', dealId);
    return false;
  }
  
  if (quantity <= 0 || quantity > 100) {
    console.error('[generateDiscountCodes] ❌ Invalid quantity requested:', quantity);
    return false;
  }
  
  try {
    // Generate a batch of unique codes
    const codes = [];
    const uniqueCodes = new Set<string>();
    
    // Hämta först eventuella befintliga koder för detta erbjudande för att undvika duplikat
    const { data: existingCodes, error: fetchError } = await supabase
      .from('discount_codes')
      .select('code')
      .eq('deal_id', dealId);
    
    if (fetchError) {
      console.error('[generateDiscountCodes] ❌ Error fetching existing codes:', fetchError);
      // Fortsätt ändå - det är okej att misslyckas med detta steg
    } else if (existingCodes && existingCodes.length > 0) {
      console.log(`[generateDiscountCodes] Found ${existingCodes.length} existing codes for deal ${dealId}`);
      // Lägg till befintliga koder i vår Set för att undvika duplikat
      existingCodes.forEach(item => uniqueCodes.add(item.code));
    }
    
    const initialSize = uniqueCodes.size;
    let attempts = 0;
    const maxAttempts = quantity * 3; // Sätt en gräns för att undvika oändliga loopar
    
    // Generera nya unika koder tills vi har tillräckligt många
    while (uniqueCodes.size < initialSize + quantity && attempts < maxAttempts) {
      uniqueCodes.add(generateRandomCode(8));
      attempts++;
    }
    
    // Ta bara de nya koderna (hoppa över de som redan fanns)
    const newCodes = Array.from(uniqueCodes).slice(initialSize);
    
    // Skapa code-objekt för insertion
    for (const code of newCodes) {
      codes.push({
        deal_id: dealId,
        code,
        is_used: false
      });
    }

    console.log(`[generateDiscountCodes] Generated ${codes.length} unique new codes for deal ${dealId}`);
    
    if (codes.length === 0) {
      console.warn(`[generateDiscountCodes] ⚠️ No new codes were generated for deal ${dealId}`);
      return false;
    }
    
    // Insert codes in batches to avoid request size limits
    const BATCH_SIZE = 20;
    let successCount = 0;
    
    for (let i = 0; i < codes.length; i += BATCH_SIZE) {
      const batch = codes.slice(i, i + BATCH_SIZE);
      
      try {
        // Insert the batch
        const { data, error } = await supabase
          .from('discount_codes')
          .insert(batch);
          
        if (error) {
          console.error(`[generateDiscountCodes] ❌ Error inserting batch ${i/BATCH_SIZE + 1}:`, error);
          console.error('[generateDiscountCodes] Error details:', error.code, error.message, error.details);
        } else {
          console.log(`[generateDiscountCodes] ✓ Successfully inserted batch ${i/BATCH_SIZE + 1} (${batch.length} codes)`);
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error(`[generateDiscountCodes] ❌❌ Critical exception inserting batch ${i/BATCH_SIZE + 1}:`, batchError);
      }
    }
    
    // Log success summary
    console.log(`[generateDiscountCodes] ✓ Created ${successCount} of ${quantity} discount codes for deal ${dealId}`);
    
    // Verify codes were actually created after a short delay
    const verificationDelay = 2000; // 2 second delay for database consistency
    await new Promise(resolve => setTimeout(resolve, verificationDelay));
    
    try {
      const { data: verificationData, error: verificationError } = await supabase
        .from('discount_codes')
        .select('code')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (verificationError) {
        console.error('[generateDiscountCodes] ❌ Error verifying discount codes:', verificationError);
      } else if (!verificationData || verificationData.length === 0) {
        console.error('[generateDiscountCodes] ❌ Verification failed: No codes found for deal', dealId);
        return successCount > 0; // Returnera ändå true om vi lyckades skapa några koder
      } else {
        // Log sample codes for verification
        console.log('[generateDiscountCodes] ✓ Verified creation with sample codes:', 
          verificationData.map(c => c.code).join(', '));
        
        // Log total count for verification
        const { count, error: countError } = await supabase
          .from('discount_codes')
          .select('id', { count: 'exact', head: true })
          .eq('deal_id', dealId);
          
        if (countError) {
          console.error('[generateDiscountCodes] ❌ Error counting total codes:', countError);
        } else {
          console.log(`[generateDiscountCodes] ✓ Total codes for deal ${dealId}: ${count}`);
        }
      }
    } catch (verifyError) {
      console.error('[generateDiscountCodes] ❌ Exception during verification:', verifyError);
    }
    
    return successCount > 0;
  } catch (error) {
    console.error('[generateDiscountCodes] ❌❌ CRITICAL EXCEPTION when generating discount codes:', error);
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
