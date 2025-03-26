
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
  
  return new Response(
    JSON.stringify({
      success: true,
      message: "Öppen endpoint fungerar!",
      timestamp: new Date().toISOString(),
      method: req.method
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
