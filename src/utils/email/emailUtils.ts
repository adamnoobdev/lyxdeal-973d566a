
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
      code: code.trim().toUpperCase(), // Ensure code is standardized
      dealTitle: dealTitle.trim(),
      subscribedToNewsletter: !!subscribedToNewsletter,
      bookingUrl: bookingUrl?.trim() || null
    };

    // Validate that the request body is not empty
    if (!Object.keys(requestBody).length) {
      console.error("[sendDiscountCodeEmail] Request body is empty");
      return { success: false, error: "Empty request body" };
    }

    // Add detailed logging of request body for debugging
    console.log(`[sendDiscountCodeEmail] Preparing to call edge function with data:`, {
      email: email.substring(0, 3) + '***', // Mask full email in logs
      name: name,
      phoneLength: phone?.length || 0,
      codeLength: code?.length || 0,
      dealTitlePreview: dealTitle.substring(0, 20) + (dealTitle.length > 20 ? '...' : ''),
      hasBookingUrl: !!bookingUrl,
      requestBodyJSON: JSON.stringify(requestBody)
    });
    
    // Extra validation to ensure body is not empty after stringifying
    const stringifiedBody = JSON.stringify(requestBody);
    if (!stringifiedBody || stringifiedBody === '{}' || stringifiedBody === '""') {
      console.error("[sendDiscountCodeEmail] Stringified body is empty or invalid");
      return { success: false, error: "Failed to create valid request body" };
    }
    
    console.log(`[sendDiscountCodeEmail] Final request body length: ${stringifiedBody.length}`);
    
    // Call the edge function with explicit Content-Type and properly structured body
    const { data, error } = await supabase.functions.invoke("send-discount-email", {
      body: stringifiedBody, // Using validated stringified body
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
