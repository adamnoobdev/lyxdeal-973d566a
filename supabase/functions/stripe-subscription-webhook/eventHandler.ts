
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
    console.log("Signature:", signature.substring(0, 20) + "...");
    console.log("Webhook secret configured:", "YES (length: " + webhookSecret.length + ")");
    
    // Construct the event with the raw body string and signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    
    console.log(`Successfully verified webhook signature for event: ${event.type}, id: ${event.id}`);
    console.log(`Processing webhook event type: ${event.type}, id: ${event.id}`);
    
    // Parse the body as JSON for logging
    let bodyObject;
    try {
      bodyObject = JSON.parse(body);
      // Log selective parts of the event data for diagnostics
      if (bodyObject.data && bodyObject.data.object) {
        const obj = bodyObject.data.object;
        console.log("Event data summary:");
        console.log(`- ID: ${obj.id}`);
        console.log(`- Type: ${bodyObject.type}`);
        console.log(`- Customer: ${obj.customer || 'N/A'}`);
        console.log(`- Amount: ${obj.amount_total !== undefined ? obj.amount_total : 'N/A'}`);
        console.log(`- Status: ${obj.status || 'N/A'}`);
        console.log(`- Created: ${new Date((obj.created || 0) * 1000).toISOString()}`);
        
        if (obj.metadata) {
          console.log("Metadata:", obj.metadata);
        }
      }
    } catch (parseError) {
      console.error("Error parsing body as JSON for logging:", parseError);
      // Continue with the original event object
    }
    
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
