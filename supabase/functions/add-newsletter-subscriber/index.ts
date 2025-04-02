
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, interests } = await req.json();
    
    // Create a Supabase client with the service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Run a raw SQL query to insert the subscriber
    // This is a safer approach since we're using parameterized queries
    const { data, error } = await supabase.rpc(
      'add_newsletter_subscriber',
      { 
        p_email: email, 
        p_name: name, 
        p_interests: interests 
      }
    );
    
    if (error) {
      // If it's a duplicate, we can consider it a success
      if (error.message.includes("duplicate")) {
        return new Response(
          JSON.stringify({ success: true, message: "Already subscribed" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.error("Error adding to newsletter:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
