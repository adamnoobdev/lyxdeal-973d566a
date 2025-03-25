
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
export const getSupabaseAdmin = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl) {
    console.error("SUPABASE_URL is not configured in environment variables");
    throw new Error("Supabase URL is not configured");
  }
  
  if (!supabaseServiceRoleKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables");
    throw new Error("Supabase service role key is not configured");
  }
  
  console.log(`Creating Supabase admin client with URL: ${supabaseUrl}`);
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};
