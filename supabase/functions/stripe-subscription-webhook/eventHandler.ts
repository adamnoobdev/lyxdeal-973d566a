
import { getStripeClient } from "./stripeClient.ts";
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";

export async function handleWebhookEvent(signature: string, body: string) {
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
    
    console.log(`Processing webhook event type: ${event.type}, id: ${event.id}`);
    
    // Log the entire event object for debugging
    console.log(`Event data: ${JSON.stringify(event.data.object, null, 2)}`);
    
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("Processing checkout.session.completed event");
        try {
          const session = event.data.object;
          console.log("Session metadata:", session.metadata);
          console.log("Session customer:", session.customer);
          console.log("Session subscription:", session.subscription);
          
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
