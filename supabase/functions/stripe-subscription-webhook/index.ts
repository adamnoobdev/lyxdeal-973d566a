
// Main entry point for the Stripe subscription webhook
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getStripeClient } from "./stripeClient.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";
import { corsHeaders } from "./corsHeaders.ts";

/**
 * Primary webhook handler function that processes Stripe webhook events
 */
serve(async (req) => {
  // Enhanced logging for request details
  console.log("===== WEBHOOK REQUEST RECEIVED =====");
  console.log("Request time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  // Log all request headers for debugging
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log("Headers:", JSON.stringify(headersMap, null, 2));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling preflight OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the stripe signature from the headers
    const signature = req.headers.get("stripe-signature");
    console.log("Stripe signature present:", !!signature);
    
    if (!signature) {
      console.error("CRITICAL ERROR: Missing stripe-signature header");
      return new Response(
        JSON.stringify({ 
          error: "Missing stripe-signature header",
          documentation: "https://stripe.com/docs/webhooks/signatures",
          timestamp: new Date().toISOString()
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the raw request body as text
    const payload = await req.text();
    console.log("Request payload size:", payload.length, "bytes");
    
    // Get webhook secret
    const webhookSecret = await getStripeWebhookSecret();
    if (!webhookSecret) {
      console.error("CRITICAL ERROR: Webhook secret not found");
      return new Response(
        JSON.stringify({ 
          error: "Webhook secret not configured",
          suggestion: "Check environment variables or Supabase secrets" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Webhook secret found, attempting to verify signature");
    
    // Initialize Stripe
    const stripe = getStripeClient();
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      console.log("✅ Signature verification successful");
      console.log("Event type:", event.type);
      console.log("Event ID:", event.id);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ 
          error: "Webhook signature verification failed", 
          message: err.message,
          details: {
            signatureLength: signature.length,
            payloadPreview: payload.substring(0, 50) + "...",
            webhookSecretConfigured: !!webhookSecret
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Handle different event types
    const response = await handleStripeEvent(event);
    
    console.log("Webhook processing complete with response:", response);
    console.log("===== WEBHOOK REQUEST COMPLETED =====");
    
    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
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

/**
 * Handle different types of Stripe events
 */
async function handleStripeEvent(event: any) {
  console.log(`Processing ${event.type} event with ID: ${event.id}`);
  
  switch (event.type) {
    case 'checkout.session.completed':
      console.log("Processing checkout.session.completed");
      return await handleCheckoutCompleted(event.data.object);
      
    default:
      console.log(`Event type ${event.type} not handled specifically`);
      return { 
        received: true, 
        event_type: event.type,
        message: "Event acknowledged but not specifically processed"
      };
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session: any) {
  console.log("Handling checkout.session.completed event");
  console.log("Session ID:", session.id);
  console.log("Customer:", session.customer);
  console.log("Customer email:", session.customer_details?.email);
  
  try {
    // Get customer details
    const email = session.customer_details?.email;
    const businessName = session.metadata?.business_name;
    const planTitle = session.metadata?.plan_title;
    const planType = session.metadata?.plan_type;
    
    console.log("Processing checkout for:", {
      email,
      businessName,
      planTitle,
      planType
    });
    
    if (!email) {
      console.error("Missing email in session data");
      return { error: "Missing customer email" };
    }
    
    // Get the Supabase client
    const { getSupabaseAdmin } = await import("./supabaseClient.ts");
    const supabase = await getSupabaseAdmin();
    
    // Update partner request status
    console.log("Updating partner request status to approved");
    const { data: partnerData, error: partnerError } = await supabase
      .from('partner_requests')
      .update({ 
        status: 'approved',
        stripe_session_id: session.id
      })
      .eq('email', email)
      .select()
      .single();
    
    if (partnerError) {
      console.error("Error updating partner request:", partnerError);
    } else {
      console.log("Partner request updated successfully:", partnerData);
    }
    
    // Create salon account
    console.log("Creating new salon account");
    try {
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .insert({
          name: businessName || 'New Salon',
          email: email,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          subscription_plan: planTitle || 'Standard',
          subscription_type: planType || 'monthly',
          status: 'active'
        })
        .select()
        .single();
      
      if (salonError) {
        console.error("Error creating salon account:", salonError);
        return { error: "Failed to create salon account", details: salonError };
      }
      
      console.log("Salon account created successfully:", salonData);
      return { 
        success: true, 
        message: "Checkout completed and salon account created",
        salon_id: salonData.id
      };
    } catch (err) {
      console.error("Exception creating salon account:", err);
      return { error: "Exception creating salon account", message: err.message };
    }
  } catch (error) {
    console.error("Error processing checkout completed event:", error);
    return { 
      error: "Error processing checkout", 
      message: error.message,
      stack: error.stack
    };
  }
}
