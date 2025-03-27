
// Absolut enklaste möjliga funktion - bör alltid fungera
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*"
};

serve(async (req) => {
  console.log("TEST-OPENNESS ENDPOINT ANROPAD");
  
  // Hantera CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Logga alla headers för felsökning
  console.log("Alla request headers:");
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log(JSON.stringify(headersMap, null, 2));
  
  // Kontrollera för eventuell JWT token (för felsökning)
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    console.log("Auth header finns:", authHeader.substring(0, 15) + "...");
  } else {
    console.log("Ingen auth header hittades");
  }

  // Försök att läsa body om det finns
  let bodyText = "Ingen body";
  try {
    if (req.body) {
      bodyText = await req.text();
      console.log("Body förhandsvisning:", bodyText.substring(0, 200));
    }
  } catch (e) {
    console.log("Kunde inte läsa body:", e.message);
  }
  
  // Returnera alltid framgångsrik respons oavsett autentisering
  return new Response(
    JSON.stringify({
      success: true,
      message: "Öppen endpoint fungerar!",
      timestamp: new Date().toISOString(),
      method: req.method,
      headers_received: Object.keys(headersMap),
      auth_header_present: !!authHeader
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
});
