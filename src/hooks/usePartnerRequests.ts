
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
    console.log("Starting partner request submission with data:", data);
    
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
      throw new Error(`Failed to submit partner request: ${errorText}`);
    }
    
    console.log("Partner request submitted successfully, proceeding to create checkout session");
    
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
        
        console.log("Creating Stripe checkout session with payload:", functionPayload);
        
        // Förbättrad hantering av headers för att ge bättre spårbarhet
        const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs";
        
        const functionResponse = await fetch(
          "https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/create-salon-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${anonKey}`,
              "apikey": anonKey,
              "x-client-info": `web/1.0/partner-signup/${data.plan_title || 'standard'}`
            },
            body: JSON.stringify(functionPayload)
          }
        );
        
        const responseStatus = functionResponse.status;
        console.log(`Stripe function response status: ${responseStatus}`);
        
        // Förbättrad hantering av svar från servern
        let responseText = "";
        try {
          responseText = await functionResponse.text();
          console.log("Raw response from Edge Function:", responseText);
        } catch (e) {
          console.error("Could not read response body:", e);
        }
        
        if (!functionResponse.ok) {
          console.error("Stripe error from edge function. Status:", responseStatus);
          console.error("Error response body:", responseText);
          
          // Försök att tolka felmeddelandet för användaren
          let userFriendlyError = "Det gick inte att skapa betalningssessionen";
          try {
            const errorObj = JSON.parse(responseText);
            if (errorObj.message) {
              userFriendlyError = `Betalningsfel: ${errorObj.message}`;
            } else if (errorObj.error) {
              userFriendlyError = `Betalningsfel: ${errorObj.error}`;
            }
          } catch (e) {
            // Om det inte går att tolka JSON, använd originaltexten
            userFriendlyError = `Betalningsfel: ${responseText.substring(0, 100)}...`;
          }
          
          toast.error(userFriendlyError);
          throw new Error(userFriendlyError);
        }
        
        // Försök att tolka svaret som JSON
        let stripeData;
        try {
          stripeData = JSON.parse(responseText);
          console.log("Parsed Stripe checkout session data:", stripeData);
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          throw new Error("Ogiltig respons från betalningstjänsten");
        }
        
        if (!stripeData || !stripeData.url) {
          console.error("No URL returned in the response:", stripeData);
          throw new Error('Ingen betalnings-URL returnerades från betalningsleverantören');
        }
        
        // Visa mer information för användaren
        toast.success("Du skickas nu till betalningssidan");
        console.log("Redirecting to Stripe checkout URL:", stripeData.url);
        
        // Return success with redirect URL
        return { 
          success: true, 
          redirectUrl: stripeData.url,
          sessionId: stripeData.session_id
        };
      } catch (stripeError) {
        console.error("Error creating Stripe checkout:", stripeError);
        toast.error("Kunde inte skapa betalningssession. Försök igen senare eller kontakta support.");
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
