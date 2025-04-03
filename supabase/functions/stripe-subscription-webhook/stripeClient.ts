
import Stripe from "https://esm.sh/stripe@12.11.0";

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (stripeInstance) {
    console.log("Använder cachad Stripe-instans");
    return stripeInstance;
  }

  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    console.error("KRITISKT FEL: STRIPE_SECRET_KEY är inte konfigurerad i miljön");
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  
  console.log("Initialiserar ny Stripe-klient");
  console.log("Stripe API-nyckel konfigurerad, längd:", stripeSecretKey.length);
  
  // Verifiera att live-nycklar används i produktionsmiljö
  if (!stripeSecretKey.startsWith("sk_live") && !stripeSecretKey.startsWith("sk_test")) {
    console.error("VARNING: Ogiltig Stripe-nyckel (börjar inte med sk_live eller sk_test)!");
    console.error("Nyckeltyp: OGILTIG");
  } else if (!stripeSecretKey.startsWith("sk_live")) {
    console.warn("VARNING: Använder TEST-nyckel i miljö!");
    console.warn("Nyckeltyp:", stripeSecretKey.startsWith("sk_test") ? "TEST" : "ANNAN");
  } else {
    console.log("Använder korrekt LIVE Stripe-nyckel");
  }
  
  try {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      maxNetworkRetries: 3,
      timeout: 30000,
    });
    
    console.log("Stripe-klient initialiserad framgångsrikt");
    return stripeInstance;
  } catch (error) {
    console.error("Fel vid initialisering av Stripe-klient:", error.message);
    throw error;
  }
}

export async function verifyWebhookConfiguration() {
  try {
    const stripe = getStripeClient();
    const webhooks = await stripe.webhookEndpoints.list();
    
    console.log(`Hittade ${webhooks.data.length} webhook-endpoints`);
    
    const subscriptionWebhook = webhooks.data.find(
      webhook => webhook.url.includes('stripe-subscription-webhook')
    );
    
    if (!subscriptionWebhook) {
      console.warn("Hittade ingen prenumerations-webhook i Stripe-konfigurationen");
      
      // Lista alla webhook-endpoints för felsökning
      console.log("Alla registrerade webhook-endpoints:");
      webhooks.data.forEach((webhook, index) => {
        console.log(`${index + 1}. URL: ${webhook.url}`);
        console.log(`   Status: ${webhook.status}`);
        console.log(`   Händelser: ${webhook.enabled_events.join(', ')}`);
      });
      
      return {
        status: "missing",
        message: "No stripe-subscription-webhook endpoint found in Stripe",
        suggestions: [
          "Gå till Stripe Dashboard och lägg till en webhook-endpoint",
          "URL:en bör vara: https://gmqeqhlhqhyrjquzhuzg.functions.supabase.co/stripe-subscription-webhook",
          "Inkludera 'checkout.session.completed' i aktiverade händelser"
        ],
        available_webhooks: webhooks.data.map(w => ({ url: w.url, status: w.status })),
        timestamp: new Date().toISOString()
      };
    }
    
    console.log("Hittade prenumerations-webhook:", subscriptionWebhook.id);
    console.log("Webhook URL:", subscriptionWebhook.url);
    console.log("Webhook-status:", subscriptionWebhook.status);
    console.log("Webhook aktiverade händelser:", subscriptionWebhook.enabled_events);
    
    const hasCheckoutEvent = subscriptionWebhook.enabled_events.includes('checkout.session.completed');
    if (!hasCheckoutEvent) {
      console.warn("VARNING: Webhook saknar checkout.session.completed händelse!");
    }
    
    // Verifiera att webhook secret finns konfigurerat
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const secretConfigured = !!webhookSecret;
    
    if (!secretConfigured) {
      console.error("KRITISKT FEL: STRIPE_WEBHOOK_SECRET är inte konfigurerad i miljön");
    } else {
      console.log("STRIPE_WEBHOOK_SECRET är korrekt konfigurerad");
    }
    
    return {
      id: subscriptionWebhook.id,
      url: subscriptionWebhook.url,
      status: subscriptionWebhook.status,
      eventsConfigured: hasCheckoutEvent,
      secretConfigured: secretConfigured,
      environment: process.env.NODE_ENV || "UNKNOWN",
      timestamp: new Date().toISOString(),
      suggestions: !hasCheckoutEvent ? ["Lägg till 'checkout.session.completed' till aktiverade händelser"] : 
                   !secretConfigured ? ["Konfigurera STRIPE_WEBHOOK_SECRET i Edge Function-inställningar"] : []
    };
  } catch (error) {
    console.error("Fel vid verifiering av webhook-konfiguration:", error.message);
    return {
      status: "error",
      message: `Fel vid kontroll av webhook-konfiguration: ${error.message}`,
      timestamp: new Date().toISOString(),
      suggestions: [
        "Verifiera att Stripe API-nyckeln är korrekt",
        "Kontrollera om ditt konto har behörighet att lista webhooks"
      ]
    };
  }
}
