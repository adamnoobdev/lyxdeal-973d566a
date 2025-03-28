
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

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
  console.log(`[generateDiscountCodes] 🟢 Generating ${quantity} discount codes for deal ${dealId}`);
  
  if (!dealId) {
    console.error('[generateDiscountCodes] Invalid dealId provided:', dealId);
    return false;
  }
  
  if (quantity <= 0 || quantity > 100) {
    console.error('[generateDiscountCodes] Invalid quantity requested:', quantity);
    return false;
  }
  
  try {
    // Konvertera deal_id till korrekt numeriskt format
    const numericDealId = normalizeId(dealId);
    
    console.log(`[generateDiscountCodes] Using dealId: ${numericDealId} (${typeof numericDealId})`);
    
    // Generera en batch med unika koder
    const codes = [];
    const generatedCodes = new Set<string>();
    
    // Generera unika koder
    for (let i = 0; i < quantity; i++) {
      let code = generateRandomCode(8);
      while (generatedCodes.has(code)) {
        code = generateRandomCode(8);
      }
      generatedCodes.add(code);
      
      codes.push({
        deal_id: numericDealId,
        code,
        is_used: false
      });
    }
    
    console.log(`[generateDiscountCodes] Successfully generated ${codes.length} unique codes for deal ${numericDealId}`);
    
    // Kontrollera att tabellen finns och är tillgänglig innan vi fortsätter
    const { error: tableCheckError } = await supabase
      .from('discount_codes')
      .select('id')
      .limit(1);
      
    if (tableCheckError) {
      console.error('[generateDiscountCodes] Error accessing discount_codes table:', tableCheckError);
      console.error('[generateDiscountCodes] This might indicate permission issues or table does not exist.');
      return false;
    }
    
    // Batchvis spara koder för att undvika begränsningar i förfrågningsstorlek
    const BATCH_SIZE = 20;
    let successCount = 0;
    
    for (let i = 0; i < codes.length; i += BATCH_SIZE) {
      const batch = codes.slice(i, i + BATCH_SIZE);
      
      // Först, verifiera strukturen på det första objektet för felsökning
      if (i === 0) {
        console.log('[generateDiscountCodes] First batch sample:', JSON.stringify(batch[0], null, 2));
      }
      
      try {
        // Spara batchen
        const { error, data } = await supabase
          .from('discount_codes')
          .insert(batch)
          .select();
          
        if (error) {
          console.error(`[generateDiscountCodes] Error inserting batch ${i/BATCH_SIZE + 1}:`, error);
          console.error('[generateDiscountCodes] Error details:', error.details, error.hint, error.message);
        } else {
          console.log(`[generateDiscountCodes] Successfully inserted batch ${i/BATCH_SIZE + 1} with ${data?.length || 0} codes`);
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error(`[generateDiscountCodes] Critical exception inserting batch ${i/BATCH_SIZE + 1}:`, batchError);
      }
    }
    
    // Verifiera att koderna faktiskt skapades genom att göra en separat kontroll
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const { data: verificationData, error: verificationError } = await supabase
        .from('discount_codes')
        .select('code, deal_id')
        .eq('deal_id', numericDealId)
        .limit(10);
        
      if (verificationError) {
        console.error('[generateDiscountCodes] Error verifying discount codes:', verificationError);
      } else if (!verificationData || verificationData.length === 0) {
        console.error('[generateDiscountCodes] Verification failed: No codes found for deal', numericDealId);
        
        // Försök med en alternativ metod för att verifiera koderna i databasen
        try {
          // Använd filter istället för eq för att se om det ger andra resultat
          const { data: altVerificationData, error: altVerificationError } = await supabase
            .from('discount_codes')
            .select('code, deal_id')
            .filter('deal_id', 'eq', numericDealId)
            .limit(10);
            
          if (altVerificationError) {
            console.error('[generateDiscountCodes] Error in alternative verification:', altVerificationError);
          } else if (altVerificationData && altVerificationData.length > 0) {
            console.log('[generateDiscountCodes] Found codes with alternative query:', altVerificationData);
          }
        } catch (altVerifyError) {
          console.error('[generateDiscountCodes] Exception during alternative verification:', altVerifyError);
        }
        
        // Försök ytterligare ett sätt - hämta alla koder och filtrera manuellt
        try {
          const { data: allCodes, error: allCodesError } = await supabase
            .from('discount_codes')
            .select('*')
            .limit(50);
            
          console.log('[generateDiscountCodes] All codes in database:', allCodes?.length || 0);
          
          if (allCodes && allCodes.length > 0) {
            const matchingCodes = allCodes.filter(code => 
              Number(code.deal_id) === numericDealId || 
              String(code.deal_id) === String(numericDealId)
            );
            console.log('[generateDiscountCodes] Manually filtered matching codes:', matchingCodes.length);
          }
        } catch (allCodesError) {
          console.error('[generateDiscountCodes] Error getting all codes:', allCodesError);
        }
      } else {
        console.log('[generateDiscountCodes] Verified creation with sample codes:', verificationData);
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
