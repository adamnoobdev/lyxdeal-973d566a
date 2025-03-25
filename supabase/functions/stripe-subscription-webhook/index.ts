
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
    
    // Log headers for debugging - ta bort känsliga uppgifter i produktion
    console.log("Headers received:", Object.fromEntries(req.headers.entries()));
    
    // För Stripe webhooks kräver vi en giltig stripe-signature header
    if (signature) {
      console.log("Processing as Stripe webhook with signature:", signature.substring(0, 20) + "...");
      
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
      // För andra anrop kräver vi standard auth
      return handleUnauthorized(Object.fromEntries(req.headers.entries()));
    }
    
    // Get the raw request body as a string for webhook verification
    const bodyText = await req.text();
    console.log("Request body size:", bodyText.length, "bytes");
    
    // Handle the webhook event
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
