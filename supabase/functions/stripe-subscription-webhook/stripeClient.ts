
import Stripe from "https://esm.sh/stripe@12.11.0";

// Initialize Stripe with secret key from environment variables
export const getStripeClient = () => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    throw new Error("Stripe API key is not configured");
  }
  
  return new Stripe(stripeKey, {
    apiVersion: "2022-11-15",
  });
};
