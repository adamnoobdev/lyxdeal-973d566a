
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
    console.error("KRITISKT FEL: Supabase miljövariabler saknas (SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY)");
    throw new Error("Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
  }
  
  console.log("Skapar ny Supabase-klient med service role");
  console.log("Supabase URL:", supabaseUrl);
  console.log("Service role key length:", supabaseKey.length);
  
  try {
    // Create client with service_role key for admin privileges
    supabaseAdminInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
    
    console.log("Supabase-klient skapad framgångsrikt");
    return supabaseAdminInstance;
  } catch (error) {
    console.error("Fel vid skapande av Supabase-klient:", error);
    throw error;
  }
}

export async function getStripeWebhookSecret() {
  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (webhookSecret) {
      console.log("Webhook-hemlighet hittad i miljövariabler");
      console.log("Hemlighet längd:", webhookSecret.length);
      console.log("Första tecken:", webhookSecret.substring(0, 5) + "...");
      return webhookSecret;
    }
    
    console.error("KRITISKT FEL: STRIPE_WEBHOOK_SECRET hittades inte i miljövariabler");
    throw new Error("STRIPE_WEBHOOK_SECRET hittades inte i miljövariabler");
  } catch (error) {
    console.error("Fel vid hämtning av webhook-hemlighet:", error);
    throw error;
  }
}
