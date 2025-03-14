
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
export const generateDiscountCodes = async (dealId: number, quantity: number = 10): Promise<boolean> => {
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
    
    // Hämta först eventuella befintliga koder för detta erbjudande för att undvika duplikat
    const { data: existingCodes, error: fetchError } = await supabase
      .from('discount_codes')
      .select('code')
      .eq('deal_id', dealId);
    
    if (fetchError) {
      console.error('[generateDiscountCodes] Error fetching existing codes:', fetchError);
    } else if (existingCodes && existingCodes.length > 0) {
      console.log(`[generateDiscountCodes] Found ${existingCodes.length} existing codes for deal ${dealId}`);
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
      deal_id: dealId,
      code,
      is_used: false
    }));

    console.log(`[generateDiscountCodes] Generated ${codes.length} unique new codes for deal ${dealId}`);
    
    if (codes.length === 0) {
      console.warn(`[generateDiscountCodes] No new codes were generated for deal ${dealId}`);
      return false;
    }
    
    // Insert codes in batches to avoid request size limits
    const BATCH_SIZE = 20;
    let successCount = 0;
    
    for (let i = 0; i < codes.length; i += BATCH_SIZE) {
      const batch = codes.slice(i, i + BATCH_SIZE);
      
      try {
        // Insert the batch
        const { error } = await supabase
          .from('discount_codes')
          .insert(batch);
          
        if (error) {
          console.error(`[generateDiscountCodes] Error inserting batch ${i/BATCH_SIZE + 1}:`, error);
        } else {
          console.log(`[generateDiscountCodes] Successfully inserted batch ${i/BATCH_SIZE + 1} (${batch.length} codes)`);
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
        .select('code')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (verificationError) {
        console.error('[generateDiscountCodes] Error verifying discount codes:', verificationError);
      } else if (!verificationData || verificationData.length === 0) {
        console.error('[generateDiscountCodes] Verification failed: No codes found for deal', dealId);
      } else {
        console.log('[generateDiscountCodes] Verified creation with sample codes:', 
          verificationData.map(c => c.code).join(', '));
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

/**
 * Hämtar en tillgänglig (oanvänd) rabattkod för ett erbjudande
 */
export const getAvailableDiscountCode = async (dealId: number): Promise<string | null> => {
  console.log(`[getAvailableDiscountCode] Fetching unused discount code for deal ${dealId}`);
  
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
    return null;
  }

  console.log(`[getAvailableDiscountCode] Found code: ${data[0].code} for deal ${dealId}`);
  return data[0].code;
};

/**
 * Markerar en rabattkod som använd
 */
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
 * Kontrollerar om rabattkoder existerar för ett specifikt erbjudande
 * Användbart för felsökning av saknade koder
 */
export const inspectDiscountCodes = async (dealId: number) => {
  console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ${dealId}...`);
  
  try {
    // Konvertera dealId till nummer för säkerhets skull
    const numericDealId = Number(dealId);
    console.log(`[inspectDiscountCodes] Using numeric dealId: ${numericDealId} (original type: ${typeof dealId})`);
    
    // Kontrollera först med standardfråga
    const { data: codes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', numericDealId);
      
    if (error) {
      console.error('[inspectDiscountCodes] Error querying codes:', error);
      return { 
        success: false, 
        error, 
        message: 'Ett fel uppstod vid hämtning av rabattkoder'
      };
    }
    
    // Kontrollera om några koder hittades
    if (!codes || codes.length === 0) {
      console.log(`[inspectDiscountCodes] No codes found for deal ${dealId}`);
      
      // Försök med en testfråga för att se vilka tabeller och data som är tillgängliga
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_tables');
        
      if (tablesError) {
        console.error('[inspectDiscountCodes] Error checking tables:', tablesError);
      } else {
        console.log('[inspectDiscountCodes] Available tables:', tablesData);
      }
      
      // Försök med en mer generell fråga för att se om några koder överhuvudtaget existerar
      const { data: allCodes, error: allCodesError } = await supabase
        .from('discount_codes')
        .select('deal_id, code')
        .limit(10);
        
      if (allCodesError) {
        console.error('[inspectDiscountCodes] Error checking all codes:', allCodesError);
        return { 
          success: false, 
          message: 'Ett fel uppstod vid kontroll av rabattkoder',
          dealId
        };
      }
      
      if (!allCodes || allCodes.length === 0) {
        console.log('[inspectDiscountCodes] No discount codes found in the database at all!');
        
        // Kontrollera om det finns några deals i databasen
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('id, title')
          .eq('id', numericDealId)
          .limit(1);
          
        if (dealsError) {
          console.error('[inspectDiscountCodes] Error checking deal:', dealsError);
        } else {
          console.log('[inspectDiscountCodes] Deal check result:', dealsData);
        }
        
        return { 
          success: false, 
          message: 'Inga rabattkoder hittades i databasen', 
          dealId,
          totalCodesInDatabase: 0,
          dealExists: dealsData && dealsData.length > 0
        };
      }
      
      // Visa exempel på koder från andra erbjudanden
      console.log(`[inspectDiscountCodes] Found ${allCodes.length} codes for other deals`);
      
      return { 
        success: false, 
        message: `Inga koder hittades för erbjudande ${dealId}, men hittade koder för andra erbjudanden`, 
        dealId,
        totalCodesInDatabase: allCodes.length,
        codesFoundForDeals: [...new Set(allCodes.map(c => c.deal_id))]
      };
    }
    
    // Koder hittades, returnera detaljer
    console.log(`[inspectDiscountCodes] Found ${codes.length} codes for deal ${dealId}`);
    console.log('[inspectDiscountCodes] Sample codes:', codes.slice(0, 3).map(c => ({ code: c.code, dealId: c.deal_id })));
    
    return { 
      success: true, 
      message: `Hittade ${codes.length} koder för erbjudande ${dealId}`, 
      dealId,
      codesCount: codes.length,
      sampleCodes: codes.slice(0, 5).map(c => ({ 
        code: c.code, 
        isUsed: c.is_used,
        createdAt: c.created_at,
        dealId: c.deal_id // Inkludera deal_id för att bekräfta kopplingen
      }))
    };
  } catch (error) {
    console.error('[inspectDiscountCodes] CRITICAL EXCEPTION when inspecting codes:', error);
    return { 
      success: false, 
      error, 
      message: 'Ett allvarligt fel uppstod vid inspektion av rabattkoder',
      dealId
    };
  }
};
