
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";
import { getStripeClient } from "./stripeClient.ts";

export async function handleWebhookEvent(signature: string, payload: string) {
  try {
    console.log("Starting to handle webhook event");
    
    if (!signature) {
      console.error("No stripe-signature header found");
      return { error: "Missing stripe-signature header" };
    }
    
    if (!payload || payload.trim() === '') {
      console.error("Empty or invalid payload received");
      return { error: "Empty or invalid payload" };
    }
    
    // Get webhook secret from environment
    const webhookSecret = await getStripeWebhookSecret();
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not found in environment or Supabase secrets");
      return { error: "Webhook secret not configured", suggestion: "Check Edge Function environment variables" };
    }
    
    console.log("Webhook secret retrieved successfully, length:", webhookSecret.length);
    console.log("First few characters of secret:", webhookSecret.substring(0, 5) + "...");
    
    // Initialize Stripe
    const stripe = getStripeClient();
    
    let event;
    try {
      // Verify the event with Stripe
      console.log("Verifying Stripe signature with secret");
      console.log("Payload size:", payload.length, "bytes");
      console.log("Signature first 20 chars:", signature.substring(0, 20) + "...");
      
      try {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        console.log("Signature verified successfully");
      } catch (err) {
        console.error("Stripe signature verification failed:", err.message);
        return {
          error: "Signature verification failed",
          details: err.message,
          suggestion: "Verify that the correct webhook secret is configured"
        };
      }
      
      console.log("Event type:", event.type);
      console.log("Event ID:", event.id);
    } catch (err) {
      console.error("Webhook processing failed:", err);
      console.error("Error message:", err.message);
      
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
    
    console.log("Processing event type:", event.type);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log("Processing checkout.session.completed event");
        console.log("Customer:", event.data.object.customer);
        console.log("Customer email:", event.data.object.customer_details?.email);
        console.log("Subscription:", event.data.object.subscription);
        return await handleCheckoutCompleted(event.data.object);
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return { 
          received: true,
          event_type: event.type,
          message: "Event received but not processed" 
        };
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return { 
      error: "Error handling webhook event", 
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
  }
}
