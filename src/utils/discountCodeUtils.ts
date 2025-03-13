
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
  const codes = Array.from({ length: quantity }, () => ({
    deal_id: dealId,
    code: generateRandomCode(),
  }));

  const { error } = await supabase
    .from('discount_codes')
    .insert(codes);

  if (error) {
    console.error('Error generating discount codes:', error);
    throw error;
  }
};

export const getAvailableDiscountCode = async (dealId: number): Promise<string | null> => {
  // Hämta en oanvänd rabattkod för ett specifikt erbjudande
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
    return null; // Inga tillgängliga koder
  }

  return data[0].code;
};

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
