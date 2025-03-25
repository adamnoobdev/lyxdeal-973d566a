
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
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return { success: true };
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
}
