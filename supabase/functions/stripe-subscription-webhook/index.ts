
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleWebhookEvent } from "./eventHandler.ts";
import { corsHeaders } from "./corsConfig.ts";

serve(async (req) => {
  // Logga alla inkommande begäranden för debugging
  console.log("=======================================");
  console.log("Webhook received", new Date().toISOString());
  console.log("HTTP Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Responding to OPTIONS request with CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Se om vi får Stripe-signaturen
    const signature = req.headers.get("stripe-signature");
    console.log("Stripe signature present:", !!signature);
    
    if (!signature) {
      console.error("No Stripe signature found in request headers");
      return new Response(
        JSON.stringify({ 
          error: "No Stripe signature found",
          headers: Object.fromEntries(req.headers.entries()),
          timestamp: new Date().toISOString()
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
          console.log("Event object ID:", jsonSample.data.object.id);
          
          // Log metadata om det finns
          if (jsonSample.data.object.metadata) {
            console.log("Metadata:", JSON.stringify(jsonSample.data.object.metadata));
          }
        }
      } catch (parseError) {
        console.error("Could not parse webhook body as JSON for logging:", parseError.message);
      }
    }
    
    // Innan vi försöker bearbeta webhook, kontrollera att vi har alla miljövariabler
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    console.log("Environment variables check:");
    console.log("- STRIPE_WEBHOOK_SECRET:", !!webhookSecret);
    console.log("- STRIPE_SECRET_KEY:", !!stripeKey);
    console.log("- SUPABASE_URL:", !!supabaseUrl);
    console.log("- SUPABASE_SERVICE_ROLE_KEY:", !!supabaseKey);
    console.log("- RESEND_API_KEY:", !!resendKey);
    
    if (!webhookSecret || !stripeKey || !supabaseUrl || !supabaseKey || !resendKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Missing required environment variables", 
          missingVars: {
            webhookSecret: !webhookSecret,
            stripeKey: !stripeKey,
            supabaseUrl: !supabaseUrl,
            supabaseKey: !supabaseKey,
            resendKey: !resendKey
          },
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
    
    // Process webhook event
    console.log("Starting to process webhook event");
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
    console.error("Critical error in subscription webhook:", error);
    console.error("Stack trace:", error.stack);
    
    // Try to determine the specific part of the process that failed
    let errorSource = "unknown";
    if (error.message?.includes("signature")) errorSource = "signature_verification";
    else if (error.message?.includes("account")) errorSource = "account_creation";
    else if (error.message?.includes("email")) errorSource = "email_sending";
    
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
  } finally {
    console.log("Webhook handling completed at", new Date().toISOString());
    console.log("=======================================");
  }
});
