
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.11.0";

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
    // Initialize Stripe with secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    // Get request data
    const { planTitle, planType, price, email, businessName } = await req.json();

    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email,
      name: businessName,
      metadata: {
        plan_title: planTitle,
        plan_type: planType,
      },
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: `${planTitle} - ${planType === "yearly" ? "Årsbetalning" : "Månadsbetalning"}`,
              description: `Prenumeration på ${planTitle} med ${planType === "yearly" ? "årsbetalning" : "månadsbetalning"}`,
            },
            unit_amount: price * 100, // Convert to cents
            recurring: {
              interval: planType === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/partner`,
      metadata: {
        business_name: businessName,
        email,
        plan_title: planTitle,
        plan_type: planType,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
