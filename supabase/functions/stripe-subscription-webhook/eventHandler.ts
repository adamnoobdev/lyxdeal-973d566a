
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";
import Stripe from "https://esm.sh/stripe@12.11.0";

export async function handleWebhookEvent(signature: string, payload: string) {
  try {
    console.log("Starting to handle webhook event");
    
    // Get webhook secret from environment
    const webhookSecret = await getStripeWebhookSecret();
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not found in environment");
      return { error: "Webhook secret not configured" };
    }
    
    if (!signature) {
      console.error("No stripe-signature header found");
      return { error: "Missing stripe-signature header" };
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });
    
    let event;
    try {
      // Verify the event with Stripe
      console.log("Verifying Stripe signature with secret");
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      console.log("Signature verified successfully");
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return { error: `Webhook Error: ${err.message}` };
    }
    
    console.log("Processing event type:", event.type);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log("Processing checkout.session.completed");
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
    console.error("Error stack:", error.stack);
    return { 
      error: "Error handling webhook event", 
      message: error.message,
      stack: error.stack 
    };
  }
}
