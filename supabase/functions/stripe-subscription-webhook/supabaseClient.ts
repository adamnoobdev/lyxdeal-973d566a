
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
  
  // First try from environment variable (preferred)
  try {
    const envSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (envSecret) {
      console.log("Found webhook secret in environment variables");
      cachedWebhookSecret = envSecret;
      return envSecret;
    }
  } catch (e) {
    console.error("Error checking environment variable:", e.message);
  }
  
  console.log("No webhook secret found in environment variables");
  
  // Then try from Supabase secrets
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.functions.invoke('get-secret', {
      body: { name: 'STRIPE_WEBHOOK_SECRET' }
    });
    
    if (error) {
      console.error("Error invoking get-secret function:", error);
      return null;
    }
    
    if (data && data.value) {
      console.log("Found webhook secret from secrets function");
      cachedWebhookSecret = data.value;
      return data.value;
    }
  } catch (e) {
    console.error("Error getting secret from function:", e.message);
  }
  
  // Last resort: try direct DB access for secrets
  // This is not recommended but might work if all else fails
  try {
    console.log("Attempting direct access to secrets");
    const supabaseAdmin = await getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.rpc('get_secret', {
      name: 'STRIPE_WEBHOOK_SECRET'
    });
    
    if (error) {
      console.error("Error getting secret from RPC:", error);
      return null;
    }
    
    if (data) {
      console.log("Found webhook secret via RPC");
      cachedWebhookSecret = data;
      return data;
    }
  } catch (e) {
    console.error("Error with RPC call:", e.message);
  }
  
  console.error("Could not find webhook secret anywhere!");
  return null;
}
