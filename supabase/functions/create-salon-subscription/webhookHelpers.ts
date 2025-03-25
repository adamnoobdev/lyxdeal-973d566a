
import Stripe from "https://esm.sh/stripe@12.11.0";

export async function checkWebhookEndpoints(stripe: Stripe) {
  try {
    console.log("Checking webhook endpoints configuration");
    
    // Get all webhook endpoints
    const webhooks = await stripe.webhookEndpoints.list();
    
    // Look for our subscription webhook
    const subscriptionWebhook = webhooks.data.find(
      webhook => webhook.url.includes('stripe-subscription-webhook')
    );
    
    if (!subscriptionWebhook) {
      console.log("No subscription webhook found. You should create one in the Stripe dashboard.");
      console.log("URL should be: https://[your-project-id].functions.supabase.co/stripe-subscription-webhook");
      console.log("Events should include: checkout.session.completed");
      return;
    }
    
    console.log("Found subscription webhook:", subscriptionWebhook.id);
    console.log("Webhook URL:", subscriptionWebhook.url);
    console.log("Webhook status:", subscriptionWebhook.status);
    console.log("Enabled events:", subscriptionWebhook.enabled_events);
    
    // Verify the webhook has the required events
    const hasCheckoutEvent = subscriptionWebhook.enabled_events.includes('checkout.session.completed');
    
    if (!hasCheckoutEvent) {
      console.warn("Warning: Webhook doesn't have checkout.session.completed event enabled");
    }
    
    return subscriptionWebhook;
  } catch (error) {
    console.error("Error checking webhook endpoints:", error);
    return null;
  }
}
