
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  // Förbättrad loggning för felsökning
  console.log(`Mottog ${req.method} förfrågan till send-discount-email funktionen`);
  
  try {
    const headers = Object.fromEntries(req.headers.entries());
    const logHeaders = { ...headers };
    
    // Dölj eventuella känsliga headers i loggar
    if (logHeaders.authorization) {
      logHeaders.authorization = "***REDACTED***";
    }
    console.log("Headers:", logHeaders);
    
    // Logga URL-information för bättre debugging
    console.log("Request URL:", req.url);
    
    // Om möjligt, logga förfrågansinformation (utan att påverka läsningen i requestHandler)
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) {
      try {
        // Klona förfrågan för att inte påverka den ursprungliga
        const reqClone = req.clone();
        const body = await reqClone.json();
        
        // Logga säkrare version av body utan känslig information
        const safeBody = { ...body };
        if (safeBody.email) safeBody.email = safeBody.email.substring(0, 3) + "***";
        if (safeBody.phone) safeBody.phone = "***";
        console.log("Request body (sanitized):", safeBody);
      } catch (e) {
        console.warn("Could not log request body:", e.message);
      }
    }
  } catch (e) {
    console.error("Could not log headers:", e);
  }
  
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
    
    // Logga svaret för debugging
    try {
      const responseClone = response.clone();
      const responseBody = await responseClone.text();
      console.log(`Response body: ${responseBody.substring(0, 200)}${responseBody.length > 200 ? '...' : ''}`);
    } catch (e) {
      console.warn("Could not log response body:", e.message);
    }
    
    return response;
  } catch (error) {
    console.error("Fel i send-discount-email funktionen:", error);
    console.error("Stack trace:", error.stack);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Ett okänt fel inträffade",
        stack: error instanceof Error ? error.stack : "Ingen stack trace tillgänglig",
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
