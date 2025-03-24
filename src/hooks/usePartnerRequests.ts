
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PartnerRequestData {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  message?: string;
  plan_title?: string;
  plan_payment_type?: string;
  plan_price?: number;
  plan_deal_count?: number;
}

export const submitPartnerRequest = async (data: PartnerRequestData) => {
  try {
    console.log("Starting partner request submission");
    
    // Use the REST API to insert directly without type checking
    const response = await fetch(
      "https://gmqeqhlhqhyrjquzhuzg.supabase.co/rest/v1/partner_requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(data)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to submit partner request:", errorText);
      throw new Error(`Failed to submit partner request: ${errorText}`);
    }
    
    console.log("Partner request submitted successfully, now creating Stripe checkout session");
    
    // Create Stripe checkout session for the subscription only if we have a plan price
    if (data.plan_price && data.plan_price > 0) {
      try {
        // Prepare function payload with all required fields
        const functionPayload = {
          planTitle: data.plan_title || 'Salongspartner',
          planType: data.plan_payment_type || 'monthly',
          price: data.plan_price,
          email: data.email,
          businessName: data.business_name
        };
        
        console.log("Calling Supabase edge function with data:", functionPayload);
        
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-salon-subscription', {
          body: functionPayload
        });
        
        if (stripeError) {
          console.error("Stripe error from edge function:", stripeError);
          throw new Error(stripeError.message || 'Failed to create payment session');
        }
        
        if (!stripeData) {
          console.error("No data returned from Stripe edge function");
          throw new Error('No response data from payment provider');
        }
        
        if (!stripeData.url) {
          console.error("No URL returned from Stripe edge function:", stripeData);
          throw new Error('No checkout URL returned from payment provider');
        }
        
        console.log("Stripe checkout URL received:", stripeData.url);
        
        // Return success with redirect URL
        return { 
          success: true, 
          redirectUrl: stripeData.url 
        };
      } catch (stripeError) {
        console.error("Error creating Stripe checkout:", stripeError);
        toast.error("Ett fel uppstod vid betalningsförberedelsen. Vänligen försök igen.");
        throw stripeError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting partner request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
