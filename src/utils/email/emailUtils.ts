
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
    
    // Enhanced validation to ensure all parameters are correctly formatted
    if (!email || !email.includes('@')) {
      console.error("[sendDiscountCodeEmail] Invalid email format:", email);
      return { success: false, error: "Invalid email format" };
    }
    
    if (!code || code.trim().length === 0) {
      console.error("[sendDiscountCodeEmail] Empty discount code provided");
      return { success: false, error: "Empty discount code" };
    }

    // Create a properly structured request body
    const requestBody = {
      email: email.trim().toLowerCase(),
      name: name?.trim() || "Kund",
      phone: phone?.trim() || "",
      code: code.trim().toUpperCase(),
      dealTitle: dealTitle?.trim() || "",
      subscribedToNewsletter: !!subscribedToNewsletter,
      bookingUrl: bookingUrl?.trim() || null
    };

    // Log the request body for debugging
    console.log(`[sendDiscountCodeEmail] Request body:`, JSON.stringify(requestBody));
    
    try {
      // PRIMARY METHOD: Using supabase.functions.invoke
      console.log("[sendDiscountCodeEmail] Invoking edge function with Supabase SDK");
      
      const { data, error } = await supabase.functions.invoke("send-discount-email", {
        body: requestBody
      });
      
      if (error) {
        console.error("[sendDiscountCodeEmail] Error from Supabase invoke:", error);
        throw error;
      }
      
      console.log("[sendDiscountCodeEmail] Edge function response:", data);
      
      return { 
        success: true, 
        data 
      };
      
    } catch (invokeError) {
      console.error("[sendDiscountCodeEmail] Failed with Supabase invoke method:", invokeError);
      
      // FALLBACK METHOD: Using fetch directly
      try {
        console.log("[sendDiscountCodeEmail] Falling back to direct fetch call");
        
        const projectRef = "gmqeqhlhqhyrjquzhuzg"; // Your Supabase project reference
        const functionUrl = `https://${projectRef}.supabase.co/functions/v1/send-discount-email`;
        
        // Get session for auth header
        const { data: session } = await supabase.auth.getSession();
        const authHeader = session?.session?.access_token 
          ? { Authorization: `Bearer ${session.session.access_token}` } 
          : {};
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader,
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[sendDiscountCodeEmail] Fetch error: ${response.status} ${response.statusText}`, errorText);
          return { 
            success: false, 
            error: `API error: ${response.status} ${response.statusText}`,
            data: { errorText }
          };
        }
        
        const fetchData = await response.json();
        console.log("[sendDiscountCodeEmail] Direct fetch response:", fetchData);
        
        return { success: true, data: fetchData };
      } catch (fetchError) {
        console.error("[sendDiscountCodeEmail] Error with fetch fallback:", fetchError);
        return { 
          success: false, 
          error: `Failed to send email: ${fetchError.message || "Unknown error"}` 
        };
      }
    }
  } catch (error) {
    console.error("[sendDiscountCodeEmail] Exception sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown exception in email sending" 
    };
  }
};
