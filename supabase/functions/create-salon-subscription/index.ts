
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
    console.log("Creating salon subscription - request received");
    
    // Initialize Stripe with secret key from environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "STRIPE_SECRET_KEY is not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });

    // Get request data
    const requestData = await req.json();
    console.log("Request data:", JSON.stringify(requestData));
    
    const { planTitle, planType, price, email, businessName } = requestData;
    
    if (!planTitle || !planType || !price || !email || !businessName) {
      console.error("Missing required fields in request:", requestData);
      return new Response(
        JSON.stringify({ error: "Missing required fields in request" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create a customer in Stripe
    console.log("Creating Stripe customer for:", email);
    const customer = await stripe.customers.create({
      email,
      name: businessName,
      metadata: {
        plan_title: planTitle,
        plan_type: planType,
      },
    });
    console.log("Customer created:", customer.id);

    // Create a checkout session with customized appearance
    console.log("Creating checkout session");
    const origin = req.headers.get("origin") || "https://www.lyxdeal.se";
    
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
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/partner`,
      metadata: {
        business_name: businessName,
        email,
        plan_title: planTitle,
        plan_type: planType,
      },
      // Anpassad design som matchar Lyxdeal's tema
      custom_text: {
        submit: {
          message: "Lyxdeal hanterar dina betalningar säkert via Stripe.",
        },
      },
      // Anpassa färger och utseende enligt Lyxdeal's tema
      payment_intent_data: {
        description: `Lyxdeal salongspartner - ${planTitle}`,
      },
      // Custom branding och färgtema
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#520053',
          colorBackground: '#ffffff',
          colorText: '#520053',
          colorDanger: '#EF4444',
          fontFamily: 'Outfit, sans-serif',
          spacingUnit: '4px',
          borderRadius: '4px',
        },
        rules: {
          '.Input': {
            border: '1px solid #E5E7EB',
          },
          '.Button': {
            backgroundColor: '#520053',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '4px',
          },
          '.Button:hover': {
            backgroundColor: '#470047',
          }
        }
      },
    });

    console.log("Checkout session created:", session.id);
    console.log("Checkout URL:", session.url);

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
