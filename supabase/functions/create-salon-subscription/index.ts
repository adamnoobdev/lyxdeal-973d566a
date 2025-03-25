
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.11.0";

import { corsHeaders } from "./corsConfig.ts";
import { validateAuthHeader, handleUnauthorized } from "./authUtils.ts";
import { createStripeCustomer, createCheckoutSession, setupPromoCode } from "./stripeHelpers.ts";
import { updatePartnerRequest } from "./partnerRequestHelpers.ts";
import { checkWebhookEndpoints } from "./webhookHelpers.ts";

serve(async (req) => {
  // Utökad loggning för inkommande förfrågan
  console.log("=======================================");
  console.log("Create salon subscription request received", new Date().toISOString());
  console.log("HTTP Method:", req.method);
  
  // Logga alla headers för felsökning
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log("All request headers:", JSON.stringify(headersMap, null, 2));
  
  // Specifikt logga de viktigaste headrarna
  console.log("Authorization header:", req.headers.get("authorization") ? "present" : "missing");
  console.log("Content-Type:", req.headers.get("content-type"));
  console.log("Origin:", req.headers.get("origin"));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting create-salon-subscription function");
    
    // Verifiera authorization header
    const authHeader = req.headers.get("authorization");
    console.log("Authorization header present:", !!authHeader);
    
    if (!validateAuthHeader(authHeader)) {
      console.error("Auth validation failed, headers:", headersMap);
      return handleUnauthorized(headersMap);
    }
    
    // Initialize Stripe with secret key from environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          error: "STRIPE_SECRET_KEY is not configured",
          timestamp: new Date().toISOString()
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
    
    // Logga vilken typ av nyckel som används (live eller test)
    console.log("Using Stripe key type:", stripeSecretKey.startsWith("sk_live") ? "LIVE" : "TEST");
    
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
      maxNetworkRetries: 3, // Lägg till retry-logik för ökad tillförlitlighet
    });

    // Get request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body",
          details: error.message,
          timestamp: new Date().toISOString()
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
    
    const { planTitle, planType, price, email, businessName } = requestData;
    
    if (!planTitle || !planType || !price || !email || !businessName) {
      console.error("Missing required fields in request:", requestData);
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields in request",
          receivedData: requestData,
          requiredFields: ["planTitle", "planType", "price", "email", "businessName"],
          timestamp: new Date().toISOString()
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
    const { customer } = await createStripeCustomer(stripe, email, businessName, planTitle, planType);
    console.log("Customer created with ID:", customer.id);

    // Determine the origin for redirects
    let origin = req.headers.get("origin") || "https://www.lyxdeal.se";
    console.log("Origin header:", origin);
    
    // Fix issues where origin sometimes comes from localhost or test environment
    if (origin.includes("localhost") || origin.includes("lovableproject")) {
      origin = "https://www.lyxdeal.se";
      console.log("Corrected origin to:", origin);
    }
    
    // Verifiera webhook endpoint och konfiguration
    console.log("Checking webhook configuration...");
    const webhookCheck = await checkWebhookEndpoints(stripe);
    console.log("Webhook check result:", webhookCheck);
    
    // Create promo code if it doesn't exist
    console.log("Setting up promo code...");
    await setupPromoCode(stripe);
    
    // Create checkout session
    console.log("Creating checkout session...");
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
    
    console.log("Checkout session created with ID:", session.id);
    console.log("Checkout URL:", session.url);
    
    // Update partner request with session ID
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseKey) {
      console.log("Updating partner request in Supabase...");
      await updatePartnerRequest(
        supabaseUrl, 
        supabaseKey, 
        email, 
        session.id, 
        planTitle, 
        planType, 
        price
      );
      console.log("Partner request updated successfully");
    } else {
      console.warn("Cannot update partner request: missing Supabase config");
    }

    // Return the checkout URL as JSON
    console.log("Returning checkout URL to client:", session.url);
    console.log("=======================================");
    return new Response(
      JSON.stringify({ 
        url: session.url,
        success: true,
        session_id: session.id,
        timestamp: new Date().toISOString()
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
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("=======================================");
    return new Response(
      JSON.stringify({ 
        error: "Error creating checkout session",
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
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
