
import { supabase } from "@/integrations/supabase/client";

/**
 * Genererar rabattkoder för ett erbjudande
 * Optimerad version för att förhindra prestationsproblem
 */
export async function generateDiscountCodes(dealId: number, quantity: number): Promise<boolean> {
  try {
    console.log(`Generating ${quantity} discount codes for deal ID: ${dealId}`);
    
    // Kontrollera om koder redan finns för att undvika duplicering
    const { count } = await supabase
      .from('discount_codes')
      .select('*', { count: 'exact', head: true })
      .eq('deal_id', dealId);
      
    if (count && count > 0) {
      console.log(`Codes already exist for deal ${dealId}, skipping generation`);
      return true;
    }
    
    // Batcha kodgenereringen i grupper om 50 för bättre prestanda
    const batchSize = 50;
    const batches = Math.ceil(quantity / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const currentBatchSize = Math.min(batchSize, quantity - i * batchSize);
      const codes = Array.from({ length: currentBatchSize }, () => generateRandomCode());
      
      const codesData = codes.map(code => ({
        code,
        deal_id: dealId,
        is_used: false
      }));
      
      const { error } = await supabase
        .from('discount_codes')
        .insert(codesData);
        
      if (error) {
        console.error(`Error generating batch ${i+1}/${batches}:`, error);
        return false;
      }
      
      console.log(`Generated batch ${i+1}/${batches} of codes for deal ${dealId}`);
      
      // Liten paus mellan batchar för att undvika rate limits
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error generating discount codes:', error);
    return false;
  }
}

/**
 * Genererar en slumpmässig rabattkod
 */
function generateRandomCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Undvik förvirrande tecken
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
