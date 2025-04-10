
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
    
    // Enhanced validation to ensure all parameters are correctly formatted
    if (!email || !email.includes('@')) {
      console.error("[sendDiscountCodeEmail] Invalid email format:", email);
      return { success: false, error: "Invalid email format" };
    }
    
    if (!name || name.trim().length === 0) {
      console.warn("[sendDiscountCodeEmail] Empty name provided, using 'Kund' as default");
      name = "Kund";
    }
    
    if (!code || code.trim().length === 0) {
      console.error("[sendDiscountCodeEmail] Empty discount code provided");
      return { success: false, error: "Empty discount code" };
    }

    // Create a properly structured request body matching the edge function's expected structure
    const requestBody = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      phone: phone?.trim() || "",
      code: code.trim().toUpperCase(),
      dealTitle: dealTitle.trim(),
      subscribedToNewsletter: !!subscribedToNewsletter,
      bookingUrl: bookingUrl?.trim() || null
    };

    // Log the request body for debugging
    console.log(`[sendDiscountCodeEmail] Sending request with body:`, JSON.stringify(requestBody));
    
    // First, explicitly stringify the request body to ensure it's not empty
    const stringifiedBody = JSON.stringify(requestBody);
    
    // Additional check to ensure the body is not empty after stringification
    if (!stringifiedBody || stringifiedBody === '{}' || stringifiedBody.length <= 2) {
      console.error("[sendDiscountCodeEmail] Generated empty request body after stringification");
      return { success: false, error: "Failed to generate request body" };
    }
    
    // Call the edge function with explicit Content-Type and properly structured body
    const { data, error } = await supabase.functions.invoke("send-discount-email", {
      body: stringifiedBody,
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (error) {
      console.error("[sendDiscountCodeEmail] Error invoking edge function:", error);
      console.error("[sendDiscountCodeEmail] Error details:", JSON.stringify(error));
      return { success: false, error: error.message || "Failed to invoke email service" };
    }
    
    console.log("[sendDiscountCodeEmail] Edge function response:", data);
    
    if (!data) {
      console.error("[sendDiscountCodeEmail] Empty response from edge function");
      return { 
        success: false, 
        error: "Empty response from email service",
        data: null
      };
    }
    
    if (data.error) {
      console.error("[sendDiscountCodeEmail] Error returned from edge function:", data.error);
      return { 
        success: false, 
        error: data.error || "Unknown error from email service",
        data 
      };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("[sendDiscountCodeEmail] Exception sending email:", error);
    console.error("[sendDiscountCodeEmail] Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown exception in email sending" 
    };
  }
};
