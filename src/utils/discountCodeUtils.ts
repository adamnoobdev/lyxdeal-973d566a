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