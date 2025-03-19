
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
      throw new Error(`Failed to submit partner request: ${errorText}`);
    }
    
    // Create Stripe checkout session for the subscription
    if (data.plan_price && data.plan_price > 0) {
      // Call Stripe checkout function
      const { success: stripeSuccess, url, error: stripeError } = await createStripeCheckout({
        planTitle: data.plan_title || 'Salongspartner',
        planType: data.plan_payment_type || 'monthly',
        price: data.plan_price,
        email: data.email,
        businessName: data.business_name
      });
      
      if (!stripeSuccess) {
        throw new Error(stripeError || 'Failed to create payment session');
      }
      
      // Return success with redirect URL
      return { 
        success: true, 
        redirectUrl: url 
      };
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

interface StripeCheckoutParams {
  planTitle: string;
  planType: string;
  price: number;
  email: string;
  businessName: string;
}

export const createStripeCheckout = async (params: StripeCheckoutParams) => {
  try {
    const response = await supabase.functions.invoke('create-salon-subscription', {
      body: params
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      success: true,
      url: response.data.url
    };
  } catch (error) {
    console.error('Error creating Stripe checkout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

