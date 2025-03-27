
// Absolut enklaste möjliga funktion - bör alltid fungera
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "*"
};

serve(async (req) => {
  console.log("TEST-OPENNESS ENDPOINT ANROPAD");
  console.log("HTTP-METOD:", req.method);
  
  // Hantera CORS preflight
  if (req.method === "OPTIONS") {
    console.log("Behandlar OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  
  // Logga alla headers för felsökning
  console.log("Alla request headers:");
  const headersMap = Object.fromEntries(req.headers.entries());
  console.log(JSON.stringify(headersMap, null, 2));
  
  // VIKTIG ÄNDRING: Vi kontrollerar inte längre efter auth header
  // Returnera alltid framgångsrik respons OAVSETT autentisering
  return new Response(
    JSON.stringify({
      success: true,
      message: "Öppen endpoint fungerar!",
      timestamp: new Date().toISOString(),
      method: req.method,
      headers_received: Object.keys(headersMap),
      info: "Denna endpoint kräver INGEN autentisering"
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
