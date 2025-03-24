
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
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const { planTitle, planType, price, email, businessName } = requestData;
    
    if (!planTitle || !planType || !price || !email || !businessName) {
      console.error("Missing required fields in request:", requestData);
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields in request",
          receivedData: requestData 
        }),
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
    let customer;
    try {
      customer = await stripe.customers.create({
        email,
        name: businessName,
        metadata: {
          plan_title: planTitle,
          plan_type: planType,
        },
      });
      console.log("Customer created:", customer.id);
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create Stripe customer",
          details: error.message
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Determine the origin for redirects - säkerställ att detta är korrekt
    let origin = req.headers.get("origin") || "https://www.lyxdeal.se";
    
    // Fixa problem där origin ibland kommer från localhost eller testmiljö
    if (origin.includes("localhost") || origin.includes("lovableproject.com")) {
      origin = "https://www.lyxdeal.se";
    }
    
    console.log("Using origin for redirects:", origin);
    
    let session;
    try {
      // VIKTIGT: Vi skapar nu Stripe checkout utan den anpassade appearance som kan orsaka problem
      console.log("Creating checkout session with amount:", Math.round(price * 100));
      
      session = await stripe.checkout.sessions.create({
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
              unit_amount: Math.round(price * 100), // Convert to cents, ensure integer
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
        // Skapa standardiserade betalningsformuläret utan anpassningar
        locale: "sv",
        allow_promotion_codes: true,
        billing_address_collection: "auto",
      });

      console.log("Checkout session created successfully:", session.id);
      console.log("Checkout URL:", session.url);
      
      if (!session.url) {
        throw new Error("No checkout URL returned from Stripe");
      }
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create Stripe checkout session",
          details: error.message 
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Return the checkout URL as JSON
    console.log("Returning response with URL:", session.url);
    return new Response(
      JSON.stringify({ 
        url: session.url,
        success: true 
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unhandled error in creating checkout session:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error creating checkout session",
        message: error.message,
        stack: error.stack
      }),
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
