
import Stripe from "https://esm.sh/stripe@12.11.0";

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (stripeInstance) {
    console.log("Using cached Stripe instance");
    return stripeInstance;
  }

  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    console.error("CRITICAL ERROR: STRIPE_SECRET_KEY is not configured");
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  
  console.log("Initializing new Stripe client");
  console.log("Using key type:", stripeSecretKey.startsWith("sk_live") ? "LIVE" : "TEST");
  
  try {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      maxNetworkRetries: 3,
      timeout: 30000,
    });
    
    console.log("Stripe client initialized successfully");
    return stripeInstance;
  } catch (error) {
    console.error("Error initializing Stripe client:", error.message);
    throw error;
  }
}

export async function verifyWebhookConfiguration() {
  try {
    const stripe = getStripeClient();
    const webhooks = await stripe.webhookEndpoints.list();
    
    console.log(`Found ${webhooks.data.length} webhook endpoints`);
    
    const subscriptionWebhook = webhooks.data.find(
      webhook => webhook.url.includes('stripe-subscription-webhook')
    );
    
    if (!subscriptionWebhook) {
      console.warn("No subscription webhook found in Stripe configuration");
      
      // Lista alla webhook-endpoints för felsökning
      console.log("All registered webhook endpoints:");
      webhooks.data.forEach((webhook, index) => {
        console.log(`${index + 1}. URL: ${webhook.url}`);
        console.log(`   Status: ${webhook.status}`);
        console.log(`   Events: ${webhook.enabled_events.join(', ')}`);
      });
      
      return {
        status: "missing",
        message: "No stripe-subscription-webhook endpoint found in Stripe",
        suggestions: [
          "Go to the Stripe Dashboard and add a webhook endpoint",
          "The URL should be: https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/stripe-subscription-webhook",
          "Include 'checkout.session.completed' in enabled events"
        ],
        available_webhooks: webhooks.data.map(w => ({ url: w.url, status: w.status }))
      };
    }
    
    console.log("Found subscription webhook:", subscriptionWebhook.id);
    console.log("Webhook URL:", subscriptionWebhook.url);
    console.log("Webhook status:", subscriptionWebhook.status);
    console.log("Webhook enabled events:", subscriptionWebhook.enabled_events);
    
    const hasCheckoutEvent = subscriptionWebhook.enabled_events.includes('checkout.session.completed');
    if (!hasCheckoutEvent) {
      console.warn("Warning: Webhook is missing checkout.session.completed event");
    }
    
    // Verifiera att webhook secret finns konfigurerat
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const secretConfigured = !!webhookSecret;
    
    return {
      id: subscriptionWebhook.id,
      url: subscriptionWebhook.url,
      status: subscriptionWebhook.status,
      eventsConfigured: hasCheckoutEvent,
      secretConfigured: secretConfigured,
      suggestions: !hasCheckoutEvent ? ["Add 'checkout.session.completed' to enabled events"] : 
                   !secretConfigured ? ["Configure STRIPE_WEBHOOK_SECRET in Edge Function settings"] : []
    };
  } catch (error) {
    console.error("Error verifying webhook configuration:", error.message);
    return {
      status: "error",
      message: `Error checking webhook configuration: ${error.message}`,
      suggestions: [
        "Verify Stripe API key is correct",
        "Check if your account has permission to list webhooks"
      ]
    };
  }
}
