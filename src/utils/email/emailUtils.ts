
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
  subscribedToNewsletter: boolean = false,
  bookingUrl?: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log(`[sendDiscountCodeEmail] Sending email to ${email} with code ${code} for deal "${dealTitle}"`);
    console.log(`[sendDiscountCodeEmail] Additional parameters: subscribedToNewsletter=${subscribedToNewsletter}, bookingUrl=${bookingUrl || 'none'}`);
    
    const { data, error } = await supabase.functions.invoke("send-discount-email", {
      body: {
        email,
        name,
        phone,
        code,
        dealTitle,
        subscribedToNewsletter,
        bookingUrl
      },
    });
    
    if (error) {
      console.error("[sendDiscountCodeEmail] Error invoking edge function:", error);
      return { success: false, error: error.message || "Failed to invoke email service" };
    }
    
    console.log("[sendDiscountCodeEmail] Edge function response:", data);
    
    if (!data || data.error) {
      console.error("[sendDiscountCodeEmail] Error returned from edge function:", data?.error);
      return { 
        success: false, 
        error: data?.error || "Unknown error from email service",
        data 
      };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("[sendDiscountCodeEmail] Exception sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown exception in email sending" 
    };
  }
};
