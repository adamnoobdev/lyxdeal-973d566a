
// Main entry point for the Stripe subscription webhook
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleWebhookEvent } from "./eventHandler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  try {
    // Log the request for debugging
    console.log("Stripe webhook request received:", new Date().toISOString());
    console.log("HTTP Method:", req.method);
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Extract the stripe signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing stripe-signature header");
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Log headers for debugging
    console.log("Headers received:", Object.fromEntries(req.headers.entries()));
    console.log("Stripe signature found:", signature.substring(0, 20) + "...");
    
    // Get the raw request body as a string for webhook verification
    const bodyText = await req.text();
    
    // Handle the webhook event
    const result = await handleWebhookEvent(signature, bodyText);
    
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
