
import { getStripeClient } from "./stripeClient.ts";
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";

export async function handleWebhookEvent(signature: string, body: string) {
  const stripe = getStripeClient();
  
  // Verify webhook signature
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
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
    console.log(`Event data: ${JSON.stringify(event.data.object, null, 2)}`);
    
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("Processing checkout.session.completed event");
        try {
          const result = await handleCheckoutCompleted(event.data.object);
          console.log("Checkout session processing result:", result);
          return { success: true, eventType: event.type, result };
        } catch (error) {
          console.error("Failed to handle checkout.session.completed:", error);
          throw new Error(`Checkout session handling failed: ${error.message}`);
        }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return { success: true, eventType: event.type };
  } catch (err) {
    console.error(`Webhook error:`, err);
    throw new Error(`Webhook error: ${err.message}`);
  }
}
