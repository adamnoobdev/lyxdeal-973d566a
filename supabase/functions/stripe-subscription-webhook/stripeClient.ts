
import Stripe from "https://esm.sh/stripe@12.11.0";

export function getStripeClient(): Stripe {
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    console.error("CRITICAL ERROR: STRIPE_SECRET_KEY is not configured");
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  
  console.log("Initializing Stripe client with API key (first 4 chars):", stripeSecretKey.substring(0, 4) + "****");
  
  return new Stripe(stripeSecretKey, {
    apiVersion: "2022-11-15",
    maxNetworkRetries: 3, // Add retries for improved reliability
    timeout: 30000, // Extended timeout for webhook processing
  });
}
