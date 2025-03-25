
import { getStripeClient } from "./stripeClient.ts";
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";

export async function handleWebhookEvent(signature: string, body: string) {
  console.log("Starting webhook event verification");
  const stripe = getStripeClient();
  
  // Verify webhook signature
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("Stripe webhook secret is not configured in environment variables");
    throw new Error("Stripe webhook secret is not configured");
  }
  
  try {
    console.log("Verifying webhook signature...");
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    
    console.log(`Successfully verified webhook signature for event: ${event.type}, id: ${event.id}`);
    console.log(`Processing webhook event type: ${event.type}, id: ${event.id}`);
    
    // Log the entire event object for debugging
    console.log(`Event data: ${JSON.stringify(event.data.object, null, 2)}`);
    
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("Processing checkout.session.completed event");
        try {
          const session = event.data.object;
          console.log("Session ID:", session.id);
          console.log("Session metadata:", session.metadata);
          console.log("Session customer:", session.customer);
          console.log("Session subscription:", session.subscription);
          
          // Försök hitta partnern i databasen
          try {
            const supabaseUrl = Deno.env.get("SUPABASE_URL");
            const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
            
            if (supabaseUrl && supabaseKey) {
              const supabaseAdmin = { supabaseUrl, supabaseKey };
              console.log("Supabase configured for manual partner lookup");
              
              // Denna kod exekveras bara för diagnostik och loggning
              const myHeaders = new Headers();
              myHeaders.append("apikey", supabaseKey);
              myHeaders.append("Content-Type", "application/json");
              
              const requestOptions = {
                method: 'GET',
                headers: myHeaders,
              };
              
              let partnerUrl = `${supabaseUrl}/rest/v1/partner_requests?stripe_session_id=eq.${session.id}`;
              console.log("Checking for partner with session ID:", partnerUrl);
              
              try {
                const partnerResponse = await fetch(partnerUrl, requestOptions);
                const partnerData = await partnerResponse.json();
                console.log("Partner lookup response:", JSON.stringify(partnerData, null, 2));
                
                if (partnerData && partnerData.length > 0) {
                  console.log("Found partner with session ID:", partnerData[0].id);
                  console.log("Partner email:", partnerData[0].email);
                } else {
                  console.log("No partner found with session ID, checking by email");
                  
                  // Försök hitta partnern med e-post om den finns i metadata
                  if (session.metadata && session.metadata.email) {
                    partnerUrl = `${supabaseUrl}/rest/v1/partner_requests?email=eq.${encodeURIComponent(session.metadata.email)}`;
                    console.log("Checking for partner with email:", partnerUrl);
                    
                    const emailPartnerResponse = await fetch(partnerUrl, requestOptions);
                    const emailPartnerData = await emailPartnerResponse.json();
                    console.log("Partner email lookup response:", JSON.stringify(emailPartnerData, null, 2));
                    
                    if (emailPartnerData && emailPartnerData.length > 0) {
                      console.log("Found partner with email:", emailPartnerData[0].id);
                    } else {
                      console.log("No partner found with email either");
                    }
                  }
                }
              } catch (partnerLookupError) {
                console.error("Error looking up partner:", partnerLookupError);
              }
            }
          } catch (lookupError) {
            console.error("Error in manual partner lookup:", lookupError);
          }
          
          const result = await handleCheckoutCompleted(session);
          console.log("Checkout session processing result:", result);
          return { success: true, eventType: event.type, result };
        } catch (error) {
          console.error("Failed to handle checkout.session.completed:", error);
          console.error("Error stack:", error.stack);
          throw new Error(`Checkout session handling failed: ${error.message}`);
        }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return { success: true, eventType: event.type };
  } catch (err) {
    console.error(`Webhook error:`, err);
    console.error(`Webhook error stack:`, err.stack);
    throw new Error(`Webhook error: ${err.message}`);
  }
}
