
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";
import { getStripeClient } from "./stripeClient.ts";

export async function handleWebhookEvent(signature: string, payload: string) {
  try {
    console.log("=== WEBHOOK HÄNDELSE BEHANDLING STARTAD ===");
    
    if (!signature) {
      console.error("Ingen stripe-signature header hittades");
      return { error: "Missing stripe-signature header" };
    }
    
    if (!payload || payload.trim() === '') {
      console.error("Tom eller ogiltig payload mottagen");
      return { error: "Empty or invalid payload" };
    }
    
    // Get webhook secret from environment
    const webhookSecret = await getStripeWebhookSecret();
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET hittades inte i miljövariabler eller Supabase secrets");
      return { 
        error: "Webhook secret not configured", 
        suggestion: "Check Edge Function environment variables",
        credentials_error: true
      };
    }
    
    console.log("Webhook-hemlighet hämtad, längd:", webhookSecret.length);
    console.log("Första tecknen i hemligheten:", webhookSecret.substring(0, 5) + "...");
    
    // Initialize Stripe
    const stripe = getStripeClient();
    
    let event;
    try {
      // Verify the event with Stripe USING THE ASYNC VERSION
      console.log("Verifierar Stripe-signatur med hemlighet (använder asynkron metod)");
      console.log("Payload storlek:", payload.length, "bytes");
      console.log("Signatur första 20 tecken:", signature.substring(0, 20) + "...");
      
      try {
        // Use constructEventAsync instead of constructEvent
        event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
        console.log("SIGNATUR VERIFIERAD FRAMGÅNGSRIKT!");
      } catch (err) {
        console.error("STRIPE SIGNATUR VERIFIERING MISSLYCKADES:", err.message);
        console.error("Detaljer:", err);
        return {
          error: "Signature verification failed",
          details: err.message,
          suggestion: "Verify that the correct webhook secret is configured"
        };
      }
      
      console.log("Händelse typ:", event.type);
      console.log("Händelse ID:", event.id);
    } catch (err) {
      console.error("Webhook-behandling misslyckades:", err);
      console.error("Felmeddelande:", err.message);
      
      // Detaljerad felrapportering för debug
      return { 
        error: `Webhook processing failed: ${err.message}`,
        details: {
          signatureLength: signature?.length || 0,
          payloadLength: payload?.length || 0,
          signaturePreview: signature?.substring(0, 20) + "...",
          webhookSecretConfigured: !!webhookSecret,
          webhookSecretLength: webhookSecret?.length || 0,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    console.log("Behandlar händelse av typ:", event.type);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log("Behandlar checkout.session.completed-händelse");
        console.log("Kund:", event.data.object.customer);
        console.log("Kund e-post:", event.data.object.customer_details?.email);
        console.log("Prenumeration:", event.data.object.subscription);
        return await handleCheckoutCompleted(event.data.object);
      default:
        console.log(`Ohanterad händelsetyp: ${event.type}`);
        return { 
          received: true,
          event_type: event.type,
          message: "Event received but not processed" 
        };
    }
  } catch (error) {
    console.error("Fel vid hantering av webhook-händelse:", error);
    console.error("Felmeddelande:", error.message);
    console.error("Stackspår:", error.stack);
    return { 
      error: "Error handling webhook event", 
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
  }
}
