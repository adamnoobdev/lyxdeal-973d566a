
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  // Förbättrad loggning för felsökning
  console.log(`Mottog ${req.method} förfrågan till send-discount-email funktionen`);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  // Hantera CORS preflight-förfrågningar
  if (req.method === "OPTIONS") {
    console.log("Svarar på CORS preflight-förfrågan");
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Bearbeta förfrågan och skicka mejlet
    console.log("Bearbetar mejlförfrågan");
    const response = await requestHandler(req);
    console.log(`Förfrågan bearbetad, status: ${response.status}`);
    return response;
  } catch (error) {
    console.error("Fel i send-discount-email funktionen:", error);
    console.error("Stack trace:", error.stack);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Ett okänt fel inträffade",
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
