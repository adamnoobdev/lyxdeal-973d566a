
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
  // Utökad loggning för att spåra alla inkommande förfrågningar
  console.log("===== WEBHOOK REQUEST RECEIVED =====");
  console.log("Request time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  // Logga alla request headers för debugging
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log("All request headers:", JSON.stringify(headersMap, null, 2));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling preflight OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }
  
  // Lägg till en special path för att testa om webhook-endpointen fungerar
  const url = new URL(req.url);
  if (url.pathname.endsWith("/test")) {
    console.log("TEST ENDPOINT CALLED - webhook function is accessible!");
    // Verifiera webhook-konfigurationen direkt
    try {
      const webhookConfig = await verifyWebhookConfiguration();
      return new Response(
        JSON.stringify({ 
          message: "Webhook test endpoint reached successfully", 
          webhook_config: webhookConfig,
          timestamp: new Date().toISOString()
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

  try {
    // Få stripe-signatur från headers
    const signature = req.headers.get("stripe-signature");
    const authHeader = req.headers.get("authorization");
    
    console.log("Stripe signature present:", !!signature, signature ? signature.substring(0, 20) + "..." : "none");
    console.log("Auth header present:", !!authHeader, authHeader ? authHeader.substring(0, 15) + "..." : "none");
    
    // VIKTIG ÄNDRING: För Stripe webhook-anrop, acceptera alla anrop med Stripe-signatur
    if (signature) {
      console.log("Processing request with Stripe signature");
      // För Stripe webhooks, kontrollera bara signaturformatet
      if (!validateStripeWebhook(signature)) {
        console.error("Invalid Stripe signature format");
        return new Response(
          JSON.stringify({ 
            error: "Invalid stripe-signature format",
            format_expected: "t=timestamp,v1=signature",
            timestamp: new Date().toISOString()
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Även om signaturen verkar giltig, logga lite mer information för debugging
      console.log("Stripe signature validation passed, proceeding with request");
    } else if (!validateAuthHeader(authHeader, signature)) {
      // För icke-Stripe anrop, kräv auth-header
      console.error("Request failed authentication check - no valid auth header or stripe signature");
      return handleUnauthorized(headersMap);
    }
    
    // Get the raw request body as text
    const payload = await req.text();
    console.log("Request payload size:", payload.length, "bytes");
    console.log("Request payload preview:", payload.substring(0, 200) + "...");
    
    // För Stripe webhook-anrop, hantera eventet
    if (signature) {
      console.log("Processing Stripe webhook event...");
      console.log("Using Live Stripe API keys");
      const result = await handleWebhookEvent(signature, payload);
      
      console.log("Webhook processing complete with result:", JSON.stringify(result));
      
      return new Response(
        JSON.stringify(result),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else {
      // För icke-webhook anrop, hantera det som ett vanligt API-anrop
      console.log("Non-webhook request received");
      
      return new Response(
        JSON.stringify({ 
          message: "API endpoint running - use Stripe webhooks to trigger events", 
          timestamp: new Date().toISOString() 
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
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
