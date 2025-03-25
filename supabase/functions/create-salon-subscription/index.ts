
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
    console.log("Starting create-salon-subscription function");
    
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
    let customer;
    try {
      console.log("Creating Stripe customer for:", email);
      customer = await stripe.customers.create({
        email,
        name: businessName,
        metadata: {
          plan_title: planTitle,
          plan_type: planType,
        },
      });
      console.log("Created Stripe customer:", customer.id);
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

    // Determine the origin for redirects
    let origin = req.headers.get("origin") || "https://www.lyxdeal.se";
    console.log("Origin header:", origin);
    
    // Fix issues where origin sometimes comes from localhost or test environment
    if (origin.includes("localhost") || origin.includes("lovableproject")) {
      origin = "https://www.lyxdeal.se";
      console.log("Corrected origin to:", origin);
    }
    
    // Create our session parameters
    let sessionParams = {
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
      locale: "sv",
      allow_promotion_codes: true, // Enable promotion codes directly in Stripe UI
      billing_address_collection: "auto",
    };
    
    // Create the coupon and promo code separately (we won't apply it directly)
    // This will allow users to apply the promo code themselves in the Stripe checkout UI
    try {
      console.log("Checking for existing promo code");
      // Check if the promotion code already exists
      const existingPromoCodes = await stripe.promotionCodes.list({
        code: 'provmanad',
        active: true,
        limit: 1
      });

      if (existingPromoCodes.data.length === 0) {
        console.log("No existing promo code found, creating a new one");
        // Create a coupon for 100% off first month
        const coupon = await stripe.coupons.create({
          duration: 'once',
          percent_off: 100,
          name: 'Gratis provmånad',
        });
        console.log("Created new coupon:", coupon.id);

        // Create a promotion code for the coupon
        const promoCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: 'provmanad',
          active: true,
          metadata: {
            description: 'Gratis provmånad för nya salongspartners'
          }
        });
        console.log("Created new promo code:", promoCode.id);
      } else {
        console.log("Using existing promo code:", existingPromoCodes.data[0].id);
      }
    } catch (error) {
      console.error("Error with promotion code creation:", error);
      // Continue even if promo code creation failed - this is not critical
    }
    
    console.log("Creating Stripe checkout session");
    console.log("Session parameters:", JSON.stringify(sessionParams));
    
    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionParams);
      console.log("Created checkout session:", session.id);

      if (!session.url) {
        throw new Error("No checkout URL returned from Stripe");
      }
      
      console.log("Checkout URL:", session.url);
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
