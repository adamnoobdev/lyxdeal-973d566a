import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.11.0";

import { corsHeaders } from "./corsConfig.ts";
import { validateAuthHeader, handleUnauthorized } from "./authUtils.ts";
import { createStripeCustomer, createCheckoutSession, setupPromoCode } from "./stripeHelpers.ts";
import { updatePartnerRequest } from "./partnerRequestHelpers.ts";
import { checkWebhookEndpoints } from "./webhookHelpers.ts";

serve(async (req) => {
  // Logga allt för debugging
  console.log("=======================================");
  console.log("Create salon subscription request received", new Date().toISOString());
  console.log("HTTP Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting create-salon-subscription function");
    
    // Verifiera authorization header
    const authHeader = req.headers.get("authorization");
    console.log("Authorization header present:", !!authHeader);
    
    if (!validateAuthHeader(authHeader)) {
      return handleUnauthorized(Object.fromEntries(req.headers.entries()));
    }
    
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
    
    // Kontrollera att webhook-hemligheten finns
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      console.log("This is critical for webhook validation!");
    } else {
      console.log("STRIPE_WEBHOOK_SECRET is configured, value length:", webhookSecret.length);
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
    const { customer } = await createStripeCustomer(stripe, email, businessName, planTitle, planType);

    // Determine the origin for redirects
    let origin = req.headers.get("origin") || "https://www.lyxdeal.se";
    console.log("Origin header:", origin);
    
    // Fix issues where origin sometimes comes from localhost or test environment
    if (origin.includes("localhost") || origin.includes("lovableproject")) {
      origin = "https://www.lyxdeal.se";
      console.log("Corrected origin to:", origin);
    }
    
    // Verifiera webhook endpoint och konfiguration
    const webhookCheck = await checkWebhookEndpoints(stripe);
    console.log("Webhook check result:", webhookCheck);
    
    // Create promo code if it doesn't exist
    await setupPromoCode(stripe);
    
    // Create checkout session
    const session = await createCheckoutSession(
      stripe, 
      customer, 
      planTitle, 
      planType, 
      price, 
      businessName, 
      email, 
      origin
    );
    
    // Update partner request with session ID
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseKey) {
      await updatePartnerRequest(
        supabaseUrl, 
        supabaseKey, 
        email, 
        session.id, 
        planTitle, 
        planType, 
        price
      );
    }

    // Return the checkout URL as JSON
    console.log("Returning checkout URL to client:", session.url);
    console.log("=======================================");
    return new Response(
      JSON.stringify({ 
        url: session.url,
        success: true,
        session_id: session.id
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
    console.error("=======================================");
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
