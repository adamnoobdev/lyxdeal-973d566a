
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  // Förbättrad loggning för felsökning
  console.log(`Mottog ${req.method} förfrågan till send-discount-email funktionen`);
  
  // Hantera CORS preflight-förfrågningar
  if (req.method === "OPTIONS") {
    console.log("Svarar på CORS preflight-förfrågan");
    return new Response(null, {
      headers: corsHeaders,
      status: 204, // Använd 204 No Content för OPTIONS-svar
    });
  }

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
    
    // Validera och logga förfrågansinformation
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) {
      try {
        // Klona förfrågan för att inte påverka den ursprungliga
        const reqClone = req.clone();
        let body = null;
        
        try {
          body = await reqClone.json();
        } catch (jsonError) {
          console.error("JSON parse error:", jsonError);
          return new Response(
            JSON.stringify({ error: "Invalid JSON in request body" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }
        
        // Logga säkrare version av body utan känslig information
        const safeBody = { ...body };
        if (safeBody.email) safeBody.email = safeBody.email.substring(0, 3) + "***";
        if (safeBody.phone) safeBody.phone = "***";
        console.log("Request body (sanitized):", safeBody);
        
        // Validera obligatoriska fält
        if (!body.email || !body.name || (!body.code && body.code !== "DIRECT_BOOKING") || !body.dealTitle) {
          const missingFields = [];
          if (!body.email) missingFields.push("email");
          if (!body.name) missingFields.push("name");
          if (!body.code && body.code !== "DIRECT_BOOKING") missingFields.push("code");
          if (!body.dealTitle) missingFields.push("dealTitle");
          
          return new Response(
            JSON.stringify({ 
              error: `Missing required fields: ${missingFields.join(', ')}`,
              errorDetails: "Alla obligatoriska fält måste anges",
              missingFields
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }
      } catch (e) {
        console.warn("Could not log request body:", e.message);
      }
    } else if (req.method !== "OPTIONS") {
      // Om det inte är en OPTIONS eller POST med JSON, returnera ett fel
      return new Response(
        JSON.stringify({ 
          error: "Method not allowed or incorrect content type",
          expectedMethod: "POST",
          expectedContentType: "application/json" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        }
      );
    }
  } catch (e) {
    console.error("Could not log headers:", e);
  }

  try {
    // Bearbeta förfrågan och skicka mejlet
    console.log("Bearbetar mejlförfrågan");
    const response = await requestHandler(req);
    console.log(`Förfrågan bearbetad, status: ${response.status}`);
    
    // Lägg till CORS headers till svaret
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });
    
    // Logga svaret för debugging
    try {
      const responseClone = response.clone();
      const responseBody = await responseClone.text();
      console.log(`Response body: ${responseBody.substring(0, 200)}${responseBody.length > 200 ? '...' : ''}`);
    } catch (e) {
      console.warn("Could not log response body:", e.message);
    }
    
    // Returnera svaret med CORS headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Fel i send-discount-email funktionen:", error);
    console.error("Stack trace:", error.stack);
    
    // Skapa ett mer detaljerat felmeddelande
    const errorResponse = {
      error: error instanceof Error ? error.message : "Ett okänt fel inträffade",
      stack: error instanceof Error ? error.stack : "Ingen stack trace tillgänglig",
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? { 
        name: error.name,
        cause: error.cause ? String(error.cause) : undefined
      } : undefined
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
