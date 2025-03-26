
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
        
        const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs";
        
        // EXTREMT FÖRENKLAD VERSION - minimera CORS-problem och auth-problem
        console.log("Anropar Supabase Edge Function med anonym autentisering");
        const functionResponse = await fetch(
          "https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/create-salon-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${anonKey}`
            },
            body: JSON.stringify(functionPayload)
          }
        );
        
        const responseStatus = functionResponse.status;
        console.log(`Stripe function response status: ${responseStatus}`);
        
        // Logga hela svaret för enklare felsökning
        const responseText = await functionResponse.text();
        console.log("Raw response from Edge Function:", responseText);
        
        if (!functionResponse.ok) {
          console.error("Stripe error from edge function. Status:", responseStatus);
          console.error("Error response body:", responseText);
          toast.error("Det gick inte att skapa betalningssessionen. Försök igen senare.");
          throw new Error(`Error from server: ${responseText}`);
        }
        
        // Försök att tolka svaret som JSON
        let stripeData;
        try {
          stripeData = JSON.parse(responseText);
          console.log("Parsed Stripe checkout session data:", stripeData);
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          toast.error("Ogiltig respons från betalningstjänsten");
          throw new Error("Ogiltig respons från betalningstjänsten");
        }
        
        if (!stripeData || !stripeData.url) {
          console.error("No URL returned in the response:", stripeData);
          toast.error('Ingen betalnings-URL returnerades från betalningsleverantören');
          throw new Error('Ingen betalnings-URL returnerades från betalningsleverantören');
        }
        
        // DIREKT OMDIRIGERING - använder både window.location.href och window.open för att vara extra säker
        console.log("Redirecting user to Stripe:", stripeData.url);
        toast.success("Du skickas nu till betalningssidan");
        
        // Metod 1: Direct href change (primär metod)
        window.location.href = stripeData.url;
        
        // Metod 2: Backup med timeout om metod 1 inte fungerar av någon anledning
        setTimeout(() => {
          if (window.location.href !== stripeData.url) {
            console.log("Attempting backup redirect method with window.open");
            window.open(stripeData.url, "_self");
          }
        }, 1000);
        
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
