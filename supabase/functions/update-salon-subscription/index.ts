
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.11.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { salonId, subscriptionPlan, subscriptionType } = await req.json();

    if (!salonId) {
      return new Response(
        JSON.stringify({ error: "Salon ID is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SERVICE_ROLE_KEY
    );

    // Log the current values for this salon
    const { data: currentData, error: fetchError } = await supabaseAdmin
      .from("salons")
      .select("id, name, subscription_plan, subscription_type")
      .eq("id", salonId)
      .single();

    if (fetchError) {
      console.error("Error fetching salon data:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch salon data", details: fetchError }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

    console.log("Current salon data:", currentData);

    // Prepare update values
    const updateValues: Record<string, any> = {};
    
    if (subscriptionPlan) {
      updateValues.subscription_plan = subscriptionPlan;
    }
    
    if (subscriptionType) {
      updateValues.subscription_type = subscriptionType;
    }
    
    console.log("Updating salon with values:", updateValues);

    // Update salon with subscription data
    const { data, error } = await supabaseAdmin
      .from("salons")
      .update(updateValues)
      .eq("id", salonId)
      .select();

    if (error) {
      console.error("Error updating salon:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update salon", details: error }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

    // Verify that the update was successful by fetching again
    const { data: verifiedData, error: verifyError } = await supabaseAdmin
      .from("salons")
      .select("id, name, subscription_plan, subscription_type")
      .eq("id", salonId)
      .single();

    if (verifyError) {
      console.error("Error verifying update:", verifyError);
    } else {
      console.log("Salon data after update:", verifiedData);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        verification: verifiedData || null
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error in update-salon-subscription function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});
