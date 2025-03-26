
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
  console.log("================================================================");
  console.log("==== STRIPE WEBHOOK FÖRFRÅGAN MOTTAGEN ====");
  console.log("Förfrågan tid:", new Date().toISOString());
  console.log("Metod:", req.method);
  console.log("URL:", req.url);
  
  // Logga alla request headers för debugging
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log("Request headers (KOMPLETT):", JSON.stringify(headersMap, null, 2));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Hanterar OPTIONS preflight-förfrågan");
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400"
      } 
    });
  }
  
  // Verifiera att vi använder live-miljö i produktion
  try {
    const stripeClient = getStripeClient();
    const apiKey = stripeClient?.apiKey || '';
    
    if (!apiKey.startsWith("sk_live")) {
      console.log("INFO: Använder TEST-nyckel (sk_test) i aktuell miljö");
    } else {
      console.log("INFO: Använder LIVE Stripe-nyckel (sk_live)");
    }
  } catch (e) {
    console.error("Kunde inte verifiera Stripe-nyckel:", e.message);
  }
  
  // Lägg till en special path för att testa om webhook-endpointen fungerar
  const url = new URL(req.url);
  if (url.pathname.endsWith("/test")) {
    console.log("TEST ENDPOINT ANROPAD - webhook-funktionen är tillgänglig!");
    // Verifiera webhook-konfigurationen direkt
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
    // Få stripe-signatur från headers
    const signature = req.headers.get("stripe-signature");
    const authHeader = req.headers.get("authorization");
    
    console.log("======= AUTENTISERINGS INFORMATION =======");
    console.log("Stripe signature finns:", !!signature, signature ? signature.substring(0, 20) + "..." : "saknas");
    console.log("Auth header finns:", !!authHeader, authHeader ? authHeader.substring(0, 15) + "..." : "saknas");
    console.log("JWT-validering: HELT INAKTIVERAD");
    console.log("=========================================");
    
    // ALL TRAFIK TILLÅTS UTAN VALIDERING
    console.log("VIKTIGT: ALL TRAFIK TILLÅTS UTAN JWT-VALIDERING");
    
    if (signature) {
      console.log("Behandlar förfrågan med Stripe-signatur");
      
      // Få raw request body som text
      const payload = await req.text();
      console.log("Request payload storlek:", payload.length, "bytes");
      console.log("Request payload förhandsvisning:", payload.substring(0, 200) + "...");
      
      console.log("Behandlar Stripe webhook-händelse...");
      const result = await handleWebhookEvent(signature, payload);
      
      console.log("Webhook-behandling slutförd med resultat:", JSON.stringify(result));
      
      return new Response(
        JSON.stringify(result),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } 
    else {
      console.log("Icke-webhook-förfrågan mottagen - JWT-validering helt kringgången");
      
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
