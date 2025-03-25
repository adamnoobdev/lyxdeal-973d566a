
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
export const getSupabaseAdmin = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase credentials are not configured");
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};
