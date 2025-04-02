
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends a discount code email to the customer
 */
export const sendDiscountCodeEmail = async (
  email: string,
  name: string,
  phone: string,
  code: string,
  dealTitle: string,
  subscribedToNewsletter: boolean
): Promise<{ success: boolean; data?: any }> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-discount-email", {
      body: {
        email,
        name,
        phone,
        code,
        dealTitle,
        subscribedToNewsletter
      },
    });
    
    if (error) {
      console.error("Error sending email:", error);
      return { success: false };
    }
    
    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending email:", error);
    return { success: false };
  }
};
