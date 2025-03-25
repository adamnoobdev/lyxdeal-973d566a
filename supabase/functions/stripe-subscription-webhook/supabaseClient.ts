
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Cache the webhook secret to avoid repeated calls
let cachedWebhookSecret: string | null = null;

export async function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. URL present:", !!supabaseUrl, "Key present:", !!supabaseKey);
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    }
  });
}

export async function getStripeWebhookSecret() {
  // Return cached version if available
  if (cachedWebhookSecret) {
    console.log("Using cached webhook secret");
    return cachedWebhookSecret;
  }
  
  console.log("Attempting to get webhook secret");
  
  // Try from environment variable (preferred)
  try {
    const envSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (envSecret) {
      console.log("Found webhook secret in environment variables");
      console.log("Secret length:", envSecret.length);
      console.log("First few characters:", envSecret.substring(0, 5) + "...");
      cachedWebhookSecret = envSecret;
      return envSecret;
    }
  } catch (e) {
    console.error("Error checking environment variable:", e.message);
  }
  
  console.log("No webhook secret found in environment variables");
  console.error("KRITISKT FEL: Webhook-hemlighet saknas i live-miljön!");
  return null;
}
