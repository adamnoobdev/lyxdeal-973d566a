
import { supabase } from "@/integrations/supabase/client";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Genererar en slumpmässig rabattkod med angiven längd
 */
export const generateRandomCode = (length: number = 8): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return code;
};

/**
 * Genererar unika rabattkoder för ett erbjudande och sparar dem i databasen
 */
export const generateDiscountCodes = async (dealId: number | string, quantity: number = 10): Promise<boolean> => {
  console.log(`[generateDiscountCodes] Generating ${quantity} discount codes for deal ${dealId}`);
  
  if (!dealId) {
    console.error('[generateDiscountCodes] Invalid dealId provided:', dealId);
    return false;
  }
  
  if (quantity <= 0 || quantity > 100) {
    console.error('[generateDiscountCodes] Invalid quantity requested:', quantity);
    return false;
  }
  
  try {
    // Generera en batch med unika koder
    const uniqueCodes = new Set<string>();
    
    // Konvertera deal_id till numeriskt format
    const numericDealId = Number(dealId);
    
    console.log(`[generateDiscountCodes] Using dealId: ${numericDealId} (${typeof numericDealId})`);
    
    // Hämta först eventuella befintliga koder för detta erbjudande för att undvika duplikat
    const { data: existingCodes, error: fetchError } = await supabase
      .from('discount_codes')
      .select('code')
      .eq('deal_id', numericDealId);
    
    if (fetchError) {
      console.error('[generateDiscountCodes] Error fetching existing codes:', fetchError);
    } else if (existingCodes && existingCodes.length > 0) {
      console.log(`[generateDiscountCodes] Found ${existingCodes.length} existing codes for deal ${numericDealId}`);
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
    const codes = newCodes.map(code => ({
      deal_id: numericDealId, // Använd numeriskt värde
      code,
      is_used: false
    }));

    console.log(`[generateDiscountCodes] Generated ${codes.length} unique new codes for deal ${numericDealId}`);
    
    if (codes.length === 0) {
      console.warn(`[generateDiscountCodes] No new codes were generated for deal ${numericDealId}`);
      return false;
    }
    
    // Insert codes in batches to avoid request size limits
    const BATCH_SIZE = 20;
    let successCount = 0;
    
    for (let i = 0; i < codes.length; i += BATCH_SIZE) {
      const batch = codes.slice(i, i + BATCH_SIZE);
      
      try {
        // Insert the batch
        const { error, data } = await supabase
          .from('discount_codes')
          .insert(batch)
          .select();
          
        if (error) {
          console.error(`[generateDiscountCodes] Error inserting batch ${i/BATCH_SIZE + 1}:`, error);
        } else {
          console.log(`[generateDiscountCodes] Successfully inserted batch ${i/BATCH_SIZE + 1} (${batch.length} codes)`, data);
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error(`[generateDiscountCodes] Critical exception inserting batch ${i/BATCH_SIZE + 1}:`, batchError);
      }
    }
    
    // Verify codes were actually created after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const { data: verificationData, error: verificationError } = await supabase
        .from('discount_codes')
        .select('code, deal_id')
        .eq('deal_id', numericDealId)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (verificationError) {
        console.error('[generateDiscountCodes] Error verifying discount codes:', verificationError);
      } else if (!verificationData || verificationData.length === 0) {
        console.error('[generateDiscountCodes] Verification failed: No codes found for deal', numericDealId);
      } else {
        console.log('[generateDiscountCodes] Verified creation with sample codes:', 
          verificationData.map(c => `${c.code} (deal_id: ${c.deal_id}, type: ${typeof c.deal_id})`).join(', '));
      }
    } catch (verifyError) {
      console.error('[generateDiscountCodes] Exception during verification:', verifyError);
    }
    
    return successCount > 0;
  } catch (error) {
    console.error('[generateDiscountCodes] CRITICAL EXCEPTION when generating discount codes:', error);
    return false;
  }
};
