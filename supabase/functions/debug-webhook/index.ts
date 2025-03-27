
// Debug webhook för att testa om Stripe-anrop kan nå funktionen
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Definiera CORS-headers som tillåter alla anrop
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  try {
    console.log("==== DEBUG WEBHOOK MOTTAGEN ====");
    console.log("Tidpunkt:", new Date().toISOString());
    console.log("Metod:", req.method);
    console.log("URL:", req.url);
    
    // Logga alla request headers
    const headersMap = Object.fromEntries(req.headers.entries());
    console.log("Headers:", JSON.stringify(headersMap, null, 2));
    
    // Hantera CORS preflight
    if (req.method === "OPTIONS") {
      console.log("Hanterar OPTIONS preflight");
      return new Response(null, { headers: corsHeaders });
    }
    
    // Försök att läsa body-data
    let bodyData = "Ingen body";
    try {
      if (req.body) {
        const bodyText = await req.text();
        console.log("Body längd:", bodyText.length);
        console.log("Body förhandsvisning:", bodyText.substring(0, 200) + "...");
        bodyData = bodyText;
      }
    } catch (err) {
      console.log("Kunde inte läsa body:", err.message);
    }
    
    // Kontrollera Supabase-konfiguration
    console.log("Miljövariabler tillgängliga:");
    console.log("STRIPE_SECRET_KEY konfigurerad:", !!Deno.env.get("STRIPE_SECRET_KEY"));
    console.log("STRIPE_WEBHOOK_SECRET konfigurerad:", !!Deno.env.get("STRIPE_WEBHOOK_SECRET"));
    
    // Returnera framgångsrikt svar - NOTERA: Ingen auth-kontroll
    return new Response(
      JSON.stringify({
        success: true,
        message: "Debug webhook anropad framgångsrikt",
        timestamp: new Date().toISOString(),
        headers_received: Object.keys(headersMap),
        body_size: bodyData.length,
        environment_check: {
          stripe_key_configured: !!Deno.env.get("STRIPE_SECRET_KEY"),
          webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET")
        }
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("Fel i debug-webhook:", err);
    console.error("Felmeddelande:", err.message);
    console.error("Stack:", err.stack);
    
    return new Response(
      JSON.stringify({
        error: "Internt serverfel",
        message: err.message,
        stack: err.stack,
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
