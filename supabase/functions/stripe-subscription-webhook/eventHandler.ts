
import { getStripeClient } from "./stripeClient.ts";
import { handleCheckoutCompleted } from "./eventHandlers/checkoutCompleted.ts";

export async function handleWebhookEvent(signature: string, body: string) {
  console.log("Starting webhook event verification");
  const stripe = getStripeClient();
  
  // Verify webhook signature
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("CRITICAL ERROR: Stripe webhook secret is not configured in environment variables");
    console.error("Please set STRIPE_WEBHOOK_SECRET in your Supabase project");
    throw new Error("Stripe webhook secret is not configured");
  }
  
  try {
    console.log("Verifying webhook signature...");
    console.log("Signature received:", signature.substring(0, 20) + "...");
    console.log("Webhook secret configured:", webhookSecret ? "YES" : "NO");
    console.log("Webhook secret length:", webhookSecret ? webhookSecret.length : 0);
    
    // För debugging, visa en del av body
    console.log("Body excerpt (first 100 chars):", body.substring(0, 100) + "...");
    
    // Konstruera eventet med body och signatur
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (signatureError) {
      console.error("Webhook signature verification failed:", signatureError.message);
      console.error("This could be due to:");
      console.error("1. Incorrect webhook secret in environment variables");
      console.error("2. Tampered webhook payload");
      console.error("3. Incorrect signature header format");
      console.error("4. Time skew between Stripe and our server");
      
      // Visa mer diagnostik
      console.error("Webhook secret first 4 chars:", webhookSecret.substring(0, 4));
      console.error("Signature first part:", signature.split(",")[0]);
      throw new Error(`Webhook signature verification failed: ${signatureError.message}`);
    }
    
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
