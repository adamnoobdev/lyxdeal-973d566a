
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  // Log all details of the request
  console.log("===== TEST WEBHOOK REQUEST =====");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Log all headers
    const headers = Object.fromEntries(req.headers.entries());
    console.log("Headers received:", JSON.stringify(headers, null, 2));
    
    // Check for stripe-signature
    const signature = req.headers.get("stripe-signature");
    console.log("Stripe signature present:", !!signature);
    if (signature) {
      console.log("Signature value:", signature);
    }
    
    // Get body content
    const body = await req.text();
    console.log("Body length:", body.length);
    console.log("Body preview:", body.substring(0, 200) + "...");
    
    try {
      // Try to parse as JSON for better logging
      const jsonBody = JSON.parse(body);
      console.log("Event type:", jsonBody.type);
      console.log("Event ID:", jsonBody.id);
    } catch (e) {
      console.log("Body is not valid JSON");
    }
    
    // Check for webhook secret
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    console.log("Webhook secret configured:", !!webhookSecret);
    if (webhookSecret) {
      console.log("Webhook secret length:", webhookSecret.length);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Test webhook received successfully",
        has_signature: !!signature,
        has_webhook_secret: !!webhookSecret,
        request_method: req.method,
        body_length: body.length,
        timestamp: new Date().toISOString()
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
    console.error("Error in test webhook:", error);
    
    return new Response(
      JSON.stringify({
        error: "Error processing test webhook",
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
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
