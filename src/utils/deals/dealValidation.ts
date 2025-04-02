
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateEmail } from "@/utils/validation";

/**
 * Validates user input for securing a deal
 */
export const validateDealInput = async (
  dealId: number,
  email: string,
  phone: string
): Promise<{ isValid: boolean; message?: string; formattedPhone?: string }> => {
  // Validate email format
  if (!validateEmail(email)) {
    return { isValid: false, message: "Vänligen ange en giltig e-postadress" };
  }

  // Check if email has already been used for this deal
  const { data: existingEmail } = await supabase
    .from("discount_codes")
    .select("id")
    .eq("deal_id", dealId)
    .eq("customer_email", email)
    .limit(1);

  if (existingEmail && existingEmail.length > 0) {
    return { 
      isValid: false, 
      message: "Denna e-postadress har redan använts för detta erbjudande" 
    };
  }

  // Validate phone number format
  const phonePattern = /^(?:\+46|0)7[0-9]{8}$/;
  const formattedPhone = phone.replace(/\s+/g, "");
  
  if (!phonePattern.test(formattedPhone)) {
    return { 
      isValid: false, 
      message: "Vänligen ange ett giltigt svenskt mobilnummer (07XXXXXXXX)" 
    };
  }

  // Check if phone has already been used for this deal
  const { data: existingPhone } = await supabase
    .from("discount_codes")
    .select("id")
    .eq("deal_id", dealId)
    .eq("customer_phone", formattedPhone)
    .limit(1);

  if (existingPhone && existingPhone.length > 0) {
    return { 
      isValid: false, 
      message: "Detta telefonnummer har redan använts för detta erbjudande" 
    };
  }

  return { 
    isValid: true,
    formattedPhone
  };
};
