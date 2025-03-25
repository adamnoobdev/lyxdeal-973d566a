
// Main entry point for the Stripe subscription webhook
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleWebhookEvent } from "./eventHandler.ts";
import { validateStripeWebhook, validateAuthHeader, handleUnauthorized } from "./authUtils.ts";
import { corsHeaders } from "./corsHeaders.ts";

serve(async (req) => {
  try {
    // Log the request for debugging
    console.log("Stripe webhook request received:", new Date().toISOString());
    console.log("HTTP Method:", req.method);
    console.log("URL:", req.url);
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Extract the stripe signature from the headers
    const signature = req.headers.get("stripe-signature");
    const authHeader = req.headers.get("authorization");
    
    // Log headers for debugging - remove sensitive details in production
    console.log("Headers received:", Object.fromEntries(req.headers.entries()));
    
    // Important: For Stripe webhooks, we're looking specifically for the stripe-signature header
    // This is different from normal API auth which uses the Authorization header
    if (signature) {
      console.log("Processing as Stripe webhook with signature:", signature.substring(0, 20) + "...");
      
      // Basic validation of signature format (detailed verification happens in handleWebhookEvent)
      if (!validateStripeWebhook(signature)) {
        return new Response(
          JSON.stringify({ error: "Invalid stripe-signature format" }),
          { 
            status: 400, 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders 
            } 
          }
        );
      }
    } else if (!validateAuthHeader(authHeader, signature)) {
      // For non-Stripe requests, we require standard auth
      return handleUnauthorized(Object.fromEntries(req.headers.entries()));
    }
    
    // Get the raw request body as a string for webhook verification
    const bodyText = await req.text();
    console.log("Request body size:", bodyText.length, "bytes");
    console.log("Request body preview:", bodyText.substring(0, 200) + "...");
    
    // Handle the webhook event - pass the signature for verification
    const result = await handleWebhookEvent(signature || "", bodyText);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Error processing webhook", 
        message: error.message,
        stack: error.stack 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
