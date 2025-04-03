
// Main entry point for the Stripe subscription webhook
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getStripeClient, verifyWebhookConfiguration } from "./stripeClient.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";
import { corsHeaders } from "./corsHeaders.ts";
import { validateStripeWebhook, handleUnauthorized, validateAuthHeader } from "./authUtils.ts";
import { handleWebhookEvent } from "./eventHandler.ts";

/**
 * Primary webhook handler function that processes Stripe webhook events
 */
serve(async (req) => {
  // Enhanced logging for all incoming requests
  console.log("================================================================");
  console.log("==== STRIPE WEBHOOK REQUEST RECEIVED ====");
  console.log("Request time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  // Log all request headers for debugging
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log("Request headers (COMPLETE):", JSON.stringify(headersMap, null, 2));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400"
      } 
    });
  }
  
  // Verify that we're using live environment in production
  try {
    const stripeClient = getStripeClient();
    const apiKey = stripeClient?.apiKey || '';
    
    if (!apiKey.startsWith("sk_live")) {
      console.log("INFO: Using TEST key (sk_test) in current environment");
    } else {
      console.log("INFO: Using LIVE Stripe key (sk_live)");
    }
  } catch (e) {
    console.error("Could not verify Stripe key:", e.message);
  }
  
  // Add a special path for testing if the webhook endpoint is working
  const url = new URL(req.url);
  if (url.pathname.endsWith("/test")) {
    console.log("TEST ENDPOINT CALLED - webhook function is available!");
    // Verify webhook configuration directly
    try {
      const webhookConfig = await verifyWebhookConfiguration();
      return new Response(
        JSON.stringify({ 
          message: "Webhook test endpoint reached successfully", 
          webhook_config: webhookConfig,
          timestamp: new Date().toISOString(),
          webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET"),
          environment: webhookConfig.environment || "UNKNOWN",
          authentication: "JWT VALIDATION DISABLED - ALL TRAFFIC ALLOWED"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (error) {
      console.error("Error verifying webhook configuration:", error);
      return new Response(
        JSON.stringify({ 
          message: "Webhook endpoint is accessible but configuration check failed", 
          error: error.message,
          timestamp: new Date().toISOString(),
          webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET"),
          authentication: "JWT VALIDATION DISABLED - ALL TRAFFIC ALLOWED"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  }

  try {
    // Get stripe signature from headers
    const signature = req.headers.get("stripe-signature");
    const authHeader = req.headers.get("authorization");
    
    console.log("======= AUTHENTICATION INFORMATION =======");
    console.log("Stripe signature exists:", !!signature, signature ? signature.substring(0, 20) + "..." : "missing");
    console.log("Auth header exists:", !!authHeader, authHeader ? authHeader.substring(0, 15) + "..." : "missing");
    console.log("JWT validation: COMPLETELY DISABLED");
    console.log("=========================================");
    
    // ALL TRAFFIC IS ALLOWED WITHOUT VALIDATION
    console.log("IMPORTANT: ALL TRAFFIC IS ALLOWED WITHOUT JWT VALIDATION");
    
    if (signature) {
      console.log("Processing request with Stripe signature");
      
      // Get raw request body as text
      const payload = await req.text();
      console.log("Request payload size:", payload.length, "bytes");
      console.log("Request payload preview:", payload.substring(0, 200) + "...");
      
      console.log("Processing Stripe webhook event...");
      const result = await handleWebhookEvent(signature, payload);
      
      console.log("Webhook processing completed with result:", JSON.stringify(result));
      
      return new Response(
        JSON.stringify(result),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } 
    else {
      console.log("Non-webhook request received - JWT validation completely bypassed");
      
      // Safely determine environment
      let environment = "UNKNOWN";
      try {
        const stripeClient = getStripeClient();
        const apiKey = stripeClient?.apiKey || '';
        environment = apiKey.startsWith("sk_live") ? "LIVE" : "TEST";
      } catch (err) {
        console.error("Error determining environment:", err.message);
      }
      
      return new Response(
        JSON.stringify({ 
          message: "API endpoint running - no JWT verification in place", 
          timestamp: new Date().toISOString(),
          webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET"),
          environment: environment,
          authentication: "JWT VALIDATION COMPLETELY DISABLED",
          note: "This endpoint accepts all traffic without JWT verification"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("===== WEBHOOK ERROR =====");
    console.error("Unhandled error:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("===========================");
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        note: "JWT validation is disabled, so this error is not related to authentication"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
