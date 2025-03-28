
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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe API key is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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

    console.log(`Cancelling subscription: ${subscription_id}`);

    // Avsluta prenumerationen vid periodens slut
    const subscription = await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end: true,
    });

    console.log("Successfully cancelled subscription:", subscription.id);

    // Hämta salongs-ID från stripe_subscription_id
    const { data: salons, error: fetchError } = await supabaseAdmin
      .from("salons")
      .select("id")
      .eq("stripe_subscription_id", subscription_id)
      .single();

    if (fetchError) {
      console.error("Error fetching salon information:", fetchError);
    }

    // Uppdatera databasen med den nya prenumerationsstatusen och inaktivera salongen
    const { error: updateError } = await supabaseAdmin
      .from("salons")
      .update({
        cancel_at_period_end: true,
        status: "inactive"
      })
      .eq("stripe_subscription_id", subscription_id);

    if (updateError) {
      console.error("Error updating salon subscription status:", updateError);
    }

    // Om vi hittade salongs-ID, inaktivera alla aktiva erbjudanden för salongen
    if (salons && salons.id) {
      const { error: dealsError } = await supabaseAdmin
        .from("deals")
        .update({ is_active: false })
        .eq("salon_id", salons.id)
        .eq("is_active", true);

      if (dealsError) {
        console.error("Error deactivating salon deals:", dealsError);
      } else {
        console.log(`Successfully deactivated deals for salon ID: ${salons.id}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        subscription_id: subscription.id,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
