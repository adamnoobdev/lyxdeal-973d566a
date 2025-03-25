
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleWebhookEvent } from "./eventHandler.ts";
import { corsHeaders } from "./corsConfig.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received webhook request");
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No Stripe signature found in request headers");
      return new Response(
        JSON.stringify({ 
          error: "No Stripe signature found",
          headers: Object.fromEntries(req.headers.entries())
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get the request body and log its contents for debugging
    const body = await req.text();
    console.log(`Webhook payload received, size: ${body.length} bytes`);
    
    // Log a sample of the payload for debugging (first 500 chars)
    if (body.length > 0) {
      console.log(`Payload sample: ${body.substring(0, Math.min(500, body.length))}...`);
      
      try {
        // Try to parse as JSON to see structure
        const jsonSample = JSON.parse(body);
        console.log("Event type from payload:", jsonSample.type);
        console.log("Event ID from payload:", jsonSample.id);
        
        if (jsonSample.data && jsonSample.data.object) {
          console.log("Event object type:", jsonSample.data.object.object);
        }
      } catch (parseError) {
        console.error("Could not parse webhook body as JSON for logging:", parseError.message);
      }
    }
    
    // Process webhook event
    const result = await handleWebhookEvent(signature, body);
    console.log("Webhook processing completed successfully:", result);
    
    return new Response(JSON.stringify({ received: true, ...result }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    // Enhanced error logging
    console.error("Error in subscription webhook:", error);
    console.error("Stack trace:", error.stack);
    
    // Try to determine the specific part of the process that failed
    let errorSource = "unknown";
    if (error.message.includes("signature")) errorSource = "signature_verification";
    else if (error.message.includes("account")) errorSource = "account_creation";
    else if (error.message.includes("email")) errorSource = "email_sending";
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorSource,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
