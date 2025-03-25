
import Stripe from "https://esm.sh/stripe@12.11.0";

export async function checkWebhookEndpoints(stripe: Stripe) {
  try {
    console.log("Checking webhook endpoints configuration");
    
    // Get all webhook endpoints
    const webhooks = await stripe.webhookEndpoints.list();
    console.log(`Found ${webhooks.data.length} webhooks in total`);
    
    // Look for our subscription webhook
    const subscriptionWebhook = webhooks.data.find(
      webhook => webhook.url.includes('stripe-subscription-webhook')
    );
    
    if (!subscriptionWebhook) {
      console.log("No subscription webhook found. You should create one in the Stripe dashboard.");
      console.log("URL should be: https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/stripe-subscription-webhook");
      console.log("Events should include: checkout.session.completed");
      
      // For debugging - list all webhook URLs
      console.log("Available webhook URLs:");
      webhooks.data.forEach(hook => {
        console.log(`- ${hook.url} (${hook.status})`);
      });
      
      return { 
        error: "No subscription webhook found",
        webhooks: webhooks.data.map(w => ({ url: w.url, status: w.status })),
        recommended_url: "https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/stripe-subscription-webhook"
      };
    }
    
    console.log("Found subscription webhook:", subscriptionWebhook.id);
    console.log("Webhook URL:", subscriptionWebhook.url);
    console.log("Webhook status:", subscriptionWebhook.status);
    console.log("Enabled events:", subscriptionWebhook.enabled_events);
    
    // Check if the webhook includes the correct events
    const hasCheckoutEvent = subscriptionWebhook.enabled_events.includes('checkout.session.completed');
    
    if (!hasCheckoutEvent) {
      console.warn("Warning: Webhook doesn't have checkout.session.completed event enabled");
      return { warning: "Missing checkout.session.completed event" };
    }
    
    // Check webhook secret
    try {
      const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (webhookSecret) {
        console.log("STRIPE_WEBHOOK_SECRET is configured in environment variables");
      } else {
        console.warn("STRIPE_WEBHOOK_SECRET is not configured in environment variables");
        console.warn("This is required for webhook signature validation");
        return { warning: "Webhook secret not configured" };
      }
    } catch (err) {
      console.error("Error checking webhook secret:", err);
      return { error: "Error checking webhook secret" };
    }
    
    return { success: true, webhook: subscriptionWebhook.id };
  } catch (error) {
    console.error("Error checking webhook endpoints:", error);
    return { error: "Failed to check webhook endpoints" };
  }
}
