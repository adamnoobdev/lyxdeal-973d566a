
// Main entry point for the Stripe subscription webhook
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleWebhookEvent } from "./eventHandler.ts";
import { validateStripeWebhook, validateAuthHeader, handleUnauthorized } from "./authUtils.ts";
import { corsHeaders } from "./corsHeaders.ts";

serve(async (req) => {
  try {
    // Förbättrad loggning för att spåra HTTP-begäran
    console.log("============== WEBHOOK REQUEST RECEIVED ==============");
    console.log("Request time:", new Date().toISOString());
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    
    // Logga alla headers för att se vad som faktiskt skickas från Stripe
    const headersMap = Object.fromEntries(req.headers.entries());
    console.log("Headers:", JSON.stringify(headersMap, null, 2));
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Handling preflight OPTIONS request");
      return new Response(null, { headers: corsHeaders });
    }
    
    // Extract the stripe signature from the headers
    const signature = req.headers.get("stripe-signature");
    const authHeader = req.headers.get("authorization");
    
    console.log("Stripe-Signature present:", !!signature);
    if (signature) {
      console.log("Signature value (first 20 chars):", signature.substring(0, 20) + "...");
    }
    console.log("Authorization header present:", !!authHeader);
    
    // För Stripe-webhooks, validera signaturen om den finns
    if (signature) {
      console.log("Processing as Stripe webhook with signature");
      if (!validateStripeWebhook(signature)) {
        console.error("Invalid stripe-signature format");
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
      console.log("Stripe signature format validation passed");
    } 
    // För icke-Stripe begäran, kräv standard auth
    else if (!validateAuthHeader(authHeader, signature)) {
      console.error("Authentication failed: No valid signature or auth header");
      return handleUnauthorized(headersMap);
    }
    
    // Get the raw request body as a string for webhook verification
    const bodyText = await req.text();
    console.log("Request body size:", bodyText.length, "bytes");
    if (bodyText.length > 0) {
      try {
        // Försök parsa JSON för att visa strukturen men hantera om det inte är JSON
        const bodyPreview = JSON.parse(bodyText);
        console.log("Request body event type:", bodyPreview.type);
        console.log("Request body ID:", bodyPreview.id);
        if (bodyPreview.data?.object?.id) {
          console.log("Session ID:", bodyPreview.data.object.id);
        }
      } catch (e) {
        console.log("Request body is not valid JSON or empty");
      }
    } else {
      console.error("Request body is empty");
    }
    
    // Handle the webhook event - pass the signature for verification
    console.log("Passing request to handleWebhookEvent");
    const result = await handleWebhookEvent(signature || "", bodyText);
    
    console.log("Webhook handling result:", JSON.stringify(result, null, 2));
    console.log("============== WEBHOOK REQUEST COMPLETED ==============");
    
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
    console.error("============== WEBHOOK ERROR ==============");
    console.error("Unhandled error in webhook processing:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("============================================");
    
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
