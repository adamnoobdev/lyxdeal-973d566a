
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
    // Kontrollera att vi har all nödvändig data
    if (!data.name || !data.business_name || !data.email || !data.phone) {
      toast.error("Vänligen fyll i alla obligatoriska fält");
      return { success: false, error: "Ofullständiga uppgifter" };
    }
    
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
      toast.error("Kunde inte skicka ansökan: " + errorText);
      throw new Error(`Failed to submit partner request: ${errorText}`);
    }
    
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
        
        // Using public anon key for edge function access
        const functionResponse = await fetch(
          "https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/create-salon-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs`
            },
            body: JSON.stringify(functionPayload)
          }
        );
        
        if (!functionResponse.ok) {
          const stripeErrorText = await functionResponse.text();
          console.error("Stripe error from edge function:", stripeErrorText);
          toast.error("Kunde inte skapa betalningssession. Vänligen försök igen.");
          throw new Error(`Failed to create payment session: ${stripeErrorText}`);
        }
        
        const stripeData = await functionResponse.json();
        
        if (!stripeData || !stripeData.url) {
          toast.error("Ingen checkout-URL returnerades. Vänligen försök igen.");
          throw new Error('No checkout URL returned from payment provider');
        }
        
        // Return success with redirect URL
        return { 
          success: true, 
          redirectUrl: stripeData.url 
        };
      } catch (stripeError) {
        console.error("Error creating Stripe checkout:", stripeError);
        toast.error("Ett fel uppstod vid betalningsförberedelsen. Vänligen försök igen senare.");
        
        // Lägg till en fallback - låt användaren klicka på en länk
        toast.error("Klicka här för att försöka igen", {
          action: {
            label: "Försök igen",
            onClick: () => window.location.reload()
          }
        });
        
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
