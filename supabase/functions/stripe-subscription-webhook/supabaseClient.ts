
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

let supabaseAdminInstance: any = null;

export function getSupabaseAdmin() {
  if (supabaseAdminInstance) {
    console.log("Returning cached Supabase instance");
    return supabaseAdminInstance;
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
  }
  
  console.log("Creating new Supabase admin client");
  supabaseAdminInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseAdminInstance;
}

export async function getStripeWebhookSecret() {
  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (webhookSecret) {
      console.log("Found webhook secret in environment variables");
      console.log("Secret length:", webhookSecret.length);
      console.log("First few characters:", webhookSecret.substring(0, 5) + "...");
      return webhookSecret;
    }
    
    throw new Error("STRIPE_WEBHOOK_SECRET not found in environment variables");
  } catch (error) {
    console.error("Error getting webhook secret:", error);
    throw error;
  }
}
