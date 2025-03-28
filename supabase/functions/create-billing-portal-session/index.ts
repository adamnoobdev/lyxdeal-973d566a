
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe API key is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
    });

    const { customer_id } = await req.json();

    if (!customer_id) {
      return new Response(
        JSON.stringify({ error: "Customer ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Creating billing portal session for customer: ${customer_id}`);

    // Skapa en session till Stripe kundportal med explicit konfiguration
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: `${Deno.env.get("PUBLIC_SITE_URL") || "https://lyxdeal.se"}/salon/dashboard`,
      // Explicit konfiguration för portalen för att lösa problemet
      configuration: {
        features: {
          payment_method_update: {
            enabled: true
          },
          invoice_history: {
            enabled: true
          },
          subscription_cancel: {
            enabled: true
          },
          subscription_update: {
            enabled: true
          }
        }
      }
    });

    console.log("Successfully created billing portal session:", portalSession.url);

    return new Response(
      JSON.stringify({ url: portalSession.url }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    
    // Förbättrad felhantering med mer information i svaret
    const errorMessage = error.message || "Ett okänt fel uppstod";
    const errorDetails = error.type || error.code || "unknown";
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        message: "Kunde inte skapa en portal-session. Kontrollera att Stripe Customer Portal är konfigurerad i Stripe Dashboard."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
