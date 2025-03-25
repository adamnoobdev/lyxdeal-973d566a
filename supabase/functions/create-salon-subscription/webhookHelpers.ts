
import Stripe from "https://esm.sh/stripe@12.11.0";

export async function checkWebhookEndpoints(stripe: Stripe) {
  try {
    // Kontrollera webhook endpoints
    console.log("Checking Stripe webhook endpoints...");
    const webhooks = await stripe.webhookEndpoints.list({ limit: 5 });
    console.log(`Found ${webhooks.data.length} webhook endpoints`);
    
    // Logga alla webhook-endpoints för diagnostik
    webhooks.data.forEach((webhook, index) => {
      console.log(`Webhook #${index + 1}:`);
      console.log(`  URL: ${webhook.url}`);
      console.log(`  Status: ${webhook.status}`);
      console.log(`  Events: ${webhook.enabled_events?.join(', ') || 'none'}`);
    });
    
    // Kontrollera om vi har en webhook för checkout.session.completed
    const hasCheckoutWebhook = webhooks.data.some(webhook => 
      webhook.enabled_events?.includes('checkout.session.completed') || 
      webhook.enabled_events?.includes('*')
    );
    
    if (!hasCheckoutWebhook) {
      console.warn("WARNING: No webhook found for checkout.session.completed events!");
      console.warn("You may need to configure this in the Stripe dashboard.");
    }
    
    return { success: true, hasCheckoutWebhook };
  } catch (webhookError) {
    console.error("Error checking webhooks:", webhookError);
    // Fortsätt trots fel - detta är bara diagnostik
    return { success: false, error: webhookError.message };
  }
}
