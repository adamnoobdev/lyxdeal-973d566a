
import { supabase } from "@/integrations/supabase/client";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateRandomCode = (length: number = 8): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return code;
};

export const generateDiscountCodes = async (dealId: number, quantity: number = 10) => {
  try {
    // Generera unika rabattkoder baserat på det angivna antalet
    const codes = Array.from({ length: quantity }, () => ({
      deal_id: dealId,
      code: generateRandomCode(),
    }));

    // Spara rabattkoderna i databasen
    const { error } = await supabase
      .from('discount_codes')
      .insert(codes);

    if (error) {
      console.error('Error generating discount codes:', error);
      throw error;
    }
    
    return { success: true, quantity };
  } catch (error) {
    console.error('Failed to generate discount codes:', error);
    return { success: false, error };
  }
};

export const getAvailableCodesCount = async (dealId: number) => {
  try {
    const { count, error } = await supabase
      .from('discount_codes')
      .select('*', { count: 'exact', head: true })
      .eq('deal_id', dealId)
      .is('customer_email', null);
      
    if (error) throw error;
    return { success: true, count };
  } catch (error) {
    console.error('Error counting available codes:', error);
    return { success: false, count: 0, error };
  }
};
