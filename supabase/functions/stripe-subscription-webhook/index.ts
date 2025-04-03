
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
  
  try {
    // Log request details for debugging
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
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
            environment: Deno.env.get('DENO_ENV') || "unknown",
            supabase_url_configured: !!Deno.env.get("SUPABASE_URL"),
            stripe_secret_configured: !!Deno.env.get("STRIPE_SECRET_KEY"),
            webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET")
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
            timestamp: new Date().toISOString()
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Get stripe signature from headers
    const signature = req.headers.get("stripe-signature");
    
    console.log("Stripe signature present:", !!signature);
    if (signature) {
      // Get raw request body as text
      const payload = await req.text();
      console.log("Request payload size:", payload.length, "bytes");
      
      if (payload.length > 0) {
        try {
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
        } catch (eventError) {
          console.error("Error handling webhook event:", eventError);
          return new Response(
            JSON.stringify({ 
              error: "Error handling webhook event", 
              message: eventError.message,
              stack: eventError.stack
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
      } else {
        console.error("Empty payload received");
        return new Response(
          JSON.stringify({ error: "Empty payload" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } else {
      console.log("No Stripe signature found - this may be a test request");
      
      return new Response(
        JSON.stringify({ 
          message: "No Stripe signature found. This endpoint expects Stripe webhook requests.", 
          timestamp: new Date().toISOString(),
          note: "If you're testing, add /test to the URL path",
          environment: Deno.env.get('DENO_ENV') || "unknown",
          supabase_url_configured: !!Deno.env.get("SUPABASE_URL"),
          stripe_secret_configured: !!Deno.env.get("STRIPE_SECRET_KEY"),
          webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET")
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
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
