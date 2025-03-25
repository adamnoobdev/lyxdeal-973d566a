
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleWebhookEvent } from "./eventHandler.ts";
import { corsHeaders } from "./corsConfig.ts";

// Log all requests for better debugging
serve(async (req) => {
  console.log("===============================================");
  console.log("Stripe webhook request received:", new Date().toISOString());
  console.log("HTTP Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  try {
    // CORS preflight handler
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // Validate content type - Stripe sends application/json for webhooks
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType);
      return new Response(
        JSON.stringify({ 
          error: "Invalid content type, expected application/json",
          received: contentType
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Get the signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing Stripe signature header");
      return new Response(
        JSON.stringify({ 
          error: "Missing Stripe signature header",
          headers: Object.fromEntries(req.headers.entries())
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    console.log("Stripe signature present:", signature.substring(0, 20) + "...");
    
    // Get the raw request body
    let body: string;
    try {
      // NOTE: Stripe requires the RAW body string for signature verification
      body = await req.text();
      console.log("Request body received, length:", body.length);
      
      // Log part of the body for debugging (don't log sensitive data)
      if (body.length > 0) {
        const previewLength = Math.min(100, body.length);
        console.log(`Body preview: ${body.substring(0, previewLength)}...`);
      }
    } catch (error) {
      console.error("Error reading request body:", error);
      return new Response(
        JSON.stringify({ error: "Could not read request body" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Handle the webhook event
    try {
      const result = await handleWebhookEvent(signature, body);
      console.log("Webhook event handled successfully:", result);
      console.log("===============================================");
      
      return new Response(
        JSON.stringify({ 
          received: true,
          success: true,
          result: result 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.error("Error handling webhook event:", error);
      console.error("Error stack:", error.stack);
      console.error("===============================================");
      
      // Return a specific status code for signature verification failures
      const statusCode = error.message?.includes("signature") ? 401 : 500;
      
      return new Response(
        JSON.stringify({
          received: true,
          success: false,
          error: error.message,
          stack: error.stack
        }),
        {
          status: statusCode,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  } catch (error) {
    console.error("Unhandled exception in webhook handler:", error);
    console.error("Error stack:", error.stack);
    console.error("===============================================");
    
    return new Response(
      JSON.stringify({
        error: "Internal server error", 
        message: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
