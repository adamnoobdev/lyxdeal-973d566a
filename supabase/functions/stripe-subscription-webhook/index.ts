
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.11.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe with secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });
    
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get the request body
    const body = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret || ""
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed` }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      // Supabase API URL - env var exported by default when deployed
      Deno.env.get("SUPABASE_URL") || "",
      // Supabase API SERVICE ROLE KEY - env var exported by default when deployed
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        console.log("Checkout session completed:", session);
        
        // Generate a random password
        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        
        // Create a new salon account with the details from the checkout session
        console.log("Creating user account for:", session.metadata.email);
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: session.metadata.email,
          password,
          email_confirm: true,
        });

        if (userError) {
          console.error("Error creating user:", userError);
          return new Response(
            JSON.stringify({ error: "Failed to create user account" }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Create salon record
        console.log("Creating salon record for:", session.metadata.business_name);
        const { data: salonData, error: salonError } = await supabaseAdmin
          .from("salons")
          .insert([
            {
              name: session.metadata.business_name,
              email: session.metadata.email,
              role: "salon_owner",
              user_id: userData.user.id,
              subscription_plan: session.metadata.plan_title,
              subscription_type: session.metadata.plan_type,
              stripe_customer_id: session.customer
            }
          ])
          .select();

        if (salonError) {
          console.error("Error creating salon:", salonError);
          return new Response(
            JSON.stringify({ error: "Failed to create salon record" }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Update partner request status
        console.log("Updating partner request status for:", session.metadata.email);
        const { error: updateError } = await supabaseAdmin
          .from("partner_requests")
          .update({ status: "approved" })
          .eq("email", session.metadata.email);

        if (updateError) {
          console.error("Error updating partner request:", updateError);
        }

        // Send email with temporary password
        try {
          console.log("Sending welcome email to:", session.metadata.email);
          const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-salon-welcome`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({
              email: session.metadata.email,
              business_name: session.metadata.business_name,
              temporary_password: password
            }),
          });
          
          if (!emailResponse.ok) {
            const emailErrorData = await emailResponse.json();
            console.error("Email API error:", emailErrorData);
            throw new Error("Failed to send welcome email");
          }
          
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
        }

        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in subscription webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
