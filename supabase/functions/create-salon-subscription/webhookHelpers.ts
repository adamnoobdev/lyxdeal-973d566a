
import Stripe from "https://esm.sh/stripe@12.11.0";

export async function checkWebhookEndpoints(stripe: Stripe) {
  try {
    // Check webhook endpoints
    console.log("Checking Stripe webhook endpoints...");
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    console.log(`Found ${webhooks.data.length} webhook endpoints`);
    
    // Log all webhook endpoints for diagnostics
    webhooks.data.forEach((webhook, index) => {
      console.log(`Webhook #${index + 1}:`);
      console.log(`  ID: ${webhook.id}`);
      console.log(`  URL: ${webhook.url}`);
      console.log(`  Status: ${webhook.status}`);
      console.log(`  Events: ${webhook.enabled_events?.join(', ') || 'none'}`);
      console.log(`  API Version: ${webhook.api_version}`);
    });
    
    // Check if we have a webhook for checkout.session.completed
    const hasCheckoutWebhook = webhooks.data.some(webhook => 
      webhook.enabled_events?.includes('checkout.session.completed') || 
      webhook.enabled_events?.includes('*')
    );
    
    // Verify that the webhook has the correct endpoints
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.warn("WARNING: STRIPE_WEBHOOK_SECRET environment variable is not set!");
      console.warn("Webhook signature verification will fail without this secret.");
    } else {
      console.log("STRIPE_WEBHOOK_SECRET is configured");
    }
    
    if (!hasCheckoutWebhook) {
      console.warn("WARNING: No webhook found for checkout.session.completed events!");
      console.warn("You need to configure this in the Stripe dashboard.");
    }
    
    // Check for webhooks pointing to our subscription-webhook endpoint
    const subscriptionWebhookUrl = webhooks.data.find(webhook => 
      webhook.url.includes("stripe-subscription-webhook")
    );
    
    if (!subscriptionWebhookUrl) {
      console.warn("WARNING: No webhook pointing to stripe-subscription-webhook function!");
      console.warn("You need to create this webhook in the Stripe dashboard.");
    } else {
      console.log("Found webhook for subscription-webhook function:", subscriptionWebhookUrl.url);
    }
    
    return { 
      success: true, 
      hasCheckoutWebhook,
      hasWebhookSecret: !!webhookSecret,
      webhookCount: webhooks.data.length,
      subscriptionWebhookConfigured: !!subscriptionWebhookUrl
    };
  } catch (webhookError) {
    console.error("Error checking webhooks:", webhookError);
    // Continue despite error - this is just diagnostics
    return { 
      success: false, 
      error: webhookError.message,
      stack: webhookError.stack
    };
  }
}
