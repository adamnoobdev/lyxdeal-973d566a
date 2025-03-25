
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.11.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Logga allt för debugging
  console.log("=======================================");
  console.log("Create salon subscription request received", new Date().toISOString());
  console.log("HTTP Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting create-salon-subscription function");
    
    // Verifiera authorization header
    const authHeader = req.headers.get("authorization");
    console.log("Authorization header present:", !!authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ 
          error: "Missing or invalid authorization header",
          headers: Object.fromEntries(req.headers.entries())
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Initialize Stripe with secret key from environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "STRIPE_SECRET_KEY is not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Kontrollera att webhook-hemligheten finns
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      console.log("This is critical for webhook validation!");
    } else {
      console.log("STRIPE_WEBHOOK_SECRET is configured");
    }
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });

    // Get request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const { planTitle, planType, price, email, businessName } = requestData;
    
    if (!planTitle || !planType || !price || !email || !businessName) {
      console.error("Missing required fields in request:", requestData);
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields in request",
          receivedData: requestData 
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

    // Create a customer in Stripe
    let customer;
    try {
      console.log("Creating Stripe customer for:", email);
      customer = await stripe.customers.create({
        email,
        name: businessName,
        metadata: {
          plan_title: planTitle,
          plan_type: planType,
        },
      });
      console.log("Created Stripe customer:", customer.id);
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create Stripe customer",
          details: error.message
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

    // Determine the origin for redirects
    let origin = req.headers.get("origin") || "https://www.lyxdeal.se";
    console.log("Origin header:", origin);
    
    // Fix issues where origin sometimes comes from localhost or test environment
    if (origin.includes("localhost") || origin.includes("lovableproject")) {
      origin = "https://www.lyxdeal.se";
      console.log("Corrected origin to:", origin);
    }
    
    // Verifiera webhook endpoint
    try {
      // Kontrollera webhook endpoints
      console.log("Checking Stripe webhook endpoints...");
      const webhooks = await stripe.webhookEndpoints.list({ limit: 5 });
      console.log(`Found ${webhooks.data.length} webhook endpoints`);
      
      // Logga alla webhook-endpoints för diagnostik
      webhooks.data.forEach((webhook, index) => {
        console.log(`Webhook #${index + 1}:`);
        console.log(`  URL: ${webhook.url}`);
        console.log(`  Status: ${webhook.status}`);
        console.log(`  Events: ${webhook.enabled_events?.join(', ') || 'none'}`);
      });
      
      // Kontrollera om vi har en webhook för checkout.session.completed
      const hasCheckoutWebhook = webhooks.data.some(webhook => 
        webhook.enabled_events?.includes('checkout.session.completed') || 
        webhook.enabled_events?.includes('*')
      );
      
      if (!hasCheckoutWebhook) {
        console.warn("WARNING: No webhook found for checkout.session.completed events!");
        console.warn("You may need to configure this in the Stripe dashboard.");
      }
    } catch (webhookError) {
      console.error("Error checking webhooks:", webhookError);
      // Fortsätt trots fel - detta är bara diagnostik
    }
    
    // Create our session parameters
    let sessionParams = {
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: `${planTitle} - ${planType === "yearly" ? "Årsbetalning" : "Månadsbetalning"}`,
              description: `Prenumeration på ${planTitle} med ${planType === "yearly" ? "årsbetalning" : "månadsbetalning"}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents, ensure integer
            recurring: {
              interval: planType === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/partner`,
      metadata: {
        business_name: businessName,
        email,
        plan_title: planTitle,
        plan_type: planType,
      },
      locale: "sv",
      allow_promotion_codes: true, // Enable promotion codes directly in Stripe UI
      billing_address_collection: "auto",
    };
    
    // Create the coupon and promo code separately (we won't apply it directly)
    // This will allow users to apply the promo code themselves in the Stripe checkout UI
    try {
      console.log("Checking for existing promo code");
      // Check if the promotion code already exists
      const existingPromoCodes = await stripe.promotionCodes.list({
        code: 'provmanad',
        active: true,
        limit: 1
      });

      if (existingPromoCodes.data.length === 0) {
        console.log("No existing promo code found, creating a new one");
        // Create a coupon for 100% off first month
        const coupon = await stripe.coupons.create({
          duration: 'once',
          percent_off: 100,
          name: 'Gratis provmånad',
        });
        console.log("Created new coupon:", coupon.id);

        // Create a promotion code for the coupon
        const promoCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: 'provmanad',
          active: true,
          metadata: {
            description: 'Gratis provmånad för nya salongspartners'
          }
        });
        console.log("Created new promo code:", promoCode.id);
      } else {
        console.log("Using existing promo code:", existingPromoCodes.data[0].id);
      }
    } catch (error) {
      console.error("Error with promotion code creation:", error);
      // Continue even if promo code creation failed - this is not critical
    }
    
    console.log("Creating Stripe checkout session");
    console.log("Session parameters:", JSON.stringify(sessionParams));
    
    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionParams);
      console.log("Created checkout session:", session.id);

      if (!session.url) {
        throw new Error("No checkout URL returned from Stripe");
      }
      
      console.log("Checkout URL:", session.url);
      
      // Update the partner request with the session ID
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        
        if (supabaseUrl && supabaseKey) {
          console.log("Attempting to update partner_requests table with session ID");
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          // Först, leta efter en befintlig partner request
          const { data: existingData, error: existingError } = await supabase
            .from("partner_requests")
            .select("id, email")
            .eq("email", email)
            .order("created_at", { ascending: false })
            .limit(1);
            
          if (existingError) {
            console.error("Error finding existing partner request:", existingError);
          } else if (existingData && existingData.length > 0) {
            console.log("Found existing partner request to update:", existingData[0].id);
            
            // Update existing partner request with session ID
            const { data, error } = await supabase
              .from("partner_requests")
              .update({ 
                stripe_session_id: session.id,
                plan_title: planTitle,
                plan_payment_type: planType,
                plan_price: price
              })
              .eq("id", existingData[0].id)
              .select();
              
            if (error) {
              console.error("Error updating partner request with session ID:", error);
            } else {
              console.log("Successfully updated partner request with session ID");
            }
          } else {
            console.log("No existing partner request found, creating a new one");
            
            // Create a new partner request with the session ID
            const { data: newData, error: newError } = await supabase
              .from("partner_requests")
              .insert([
                {
                  name: businessName,
                  business_name: businessName,
                  email: email,
                  phone: "Unknown", // Saknar telefonnummer men behöver fylla i ett värde
                  stripe_session_id: session.id,
                  plan_title: planTitle,
                  plan_payment_type: planType,
                  plan_price: price
                }
              ])
              .select();
              
            if (newError) {
              console.error("Error creating new partner request with session ID:", newError);
            } else {
              console.log("Successfully created new partner request with session ID");
            }
          }
        } else {
          console.error("Missing Supabase credentials for partner request update");
        }
      } catch (updateError) {
        console.error("Failed to update partner request with session ID:", updateError);
        // Continue despite error - still want to return the checkout URL
      }
      
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create Stripe checkout session",
          details: error.message 
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

    // Return the checkout URL as JSON
    console.log("Returning checkout URL to client:", session.url);
    console.log("=======================================");
    return new Response(
      JSON.stringify({ 
        url: session.url,
        success: true,
        session_id: session.id
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unhandled error in creating checkout session:", error);
    console.error("=======================================");
    return new Response(
      JSON.stringify({ 
        error: "Error creating checkout session",
        message: error.message,
        stack: error.stack
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
