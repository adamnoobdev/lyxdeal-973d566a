
import { Stripe } from "https://esm.sh/stripe@12.11.0";

export async function checkWebhookEndpoints(stripe: Stripe) {
  try {
    console.log("Checking webhook endpoints...");
    
    // Check if the webhookSecret exists
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.warn("WARNING: STRIPE_WEBHOOK_SECRET is not configured");
      console.warn("Webhooks will not function correctly without this!");
    } else {
      console.log("STRIPE_WEBHOOK_SECRET is properly configured");
    }
    
    // List webhook endpoints to see if they're properly configured
    const webhooks = await stripe.webhookEndpoints.list({
      limit: 10,
    });
    
    if (webhooks.data.length === 0) {
      console.warn("WARNING: No webhook endpoints found in Stripe");
      console.warn("You need to set up a webhook endpoint in the Stripe dashboard");
    } else {
      console.log(`Found ${webhooks.data.length} webhook endpoints`);
      
      // Check for subscription webhook
      const subscriptionWebhook = webhooks.data.find(webhook => 
        webhook.enabled_events?.includes("checkout.session.completed")
      );
      
      if (subscriptionWebhook) {
        console.log("Subscription webhook found:", subscriptionWebhook.url);
        console.log("Webhook is " + (subscriptionWebhook.status === "enabled" ? "enabled" : "disabled"));
      } else {
        console.warn("WARNING: No webhook for checkout.session.completed events found");
      }
    }
  } catch (error) {
    console.error("Error checking webhook endpoints:", error);
    // Non-blocking - we don't want to stop the main flow if this check fails
  }
}
