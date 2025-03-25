
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Cache the webhook secret to avoid repeated calls
let cachedWebhookSecret: string | null = null;

export async function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
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
  
  console.log("Fetching webhook secret...");
  
  // Try to get from environment variable first (preferred method)
  const envSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (envSecret) {
    console.log("Found webhook secret in environment variables");
    cachedWebhookSecret = envSecret;
    return envSecret;
  }
  
  console.log("No webhook secret in environment variables, trying Supabase secrets");
  
  try {
    // Fallback: try to get from Supabase secrets
    const supabaseAdmin = await getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.rpc('get_secret', {
      name: 'STRIPE_WEBHOOK_SECRET'
    });
    
    if (error) {
      console.error("Error fetching webhook secret from Supabase:", error);
      return null;
    }
    
    if (!data) {
      console.error("No webhook secret found in Supabase");
      return null;
    }
    
    console.log("Found webhook secret in Supabase secrets");
    cachedWebhookSecret = data;
    return data;
  } catch (err) {
    console.error("Exception fetching webhook secret:", err);
    console.error("Error details:", err.message);
    return null;
  }
}
