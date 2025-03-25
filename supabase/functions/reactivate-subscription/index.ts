
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.11.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Reactivate subscription request received", new Date().toISOString());
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Stripe API key is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Verifiera att live-nycklar används i produktionsmiljö
    if (!stripeKey.startsWith("sk_live")) {
      console.error("VARNING: Använder TEST-nyckel i produktionsmiljö!");
      console.error("Nyckeltyp:", stripeKey.startsWith("sk_test") ? "TEST" : "ANNAN");
    } else {
      console.log("Använder korrekt LIVE Stripe-nyckel");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
    });

    // Initiera Supabase-klienten
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { subscription_id } = await req.json();

    if (!subscription_id) {
      return new Response(
        JSON.stringify({ error: "Subscription ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Reactivating subscription: ${subscription_id}`);

    // Återaktivera prenumerationen
    const subscription = await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end: false,
    });

    console.log("Successfully reactivated subscription:", subscription.id);

    // Uppdatera databasen med den nya prenumerationsstatusen
    const { error: updateError } = await supabaseAdmin
      .from("salons")
      .update({
        cancel_at_period_end: false
      })
      .eq("stripe_subscription_id", subscription_id);

    if (updateError) {
      console.error("Error updating salon subscription status:", updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        subscription_id: subscription.id,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        environment: stripeKey.startsWith("sk_live") ? "LIVE" : "TEST"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
