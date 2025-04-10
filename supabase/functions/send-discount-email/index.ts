
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  // Enhanced logging for debugging
  console.log(`Received ${req.method} request to send-discount-email function`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Responding to CORS preflight request");
    return new Response(null, {
      headers: corsHeaders,
      status: 204, // Use 204 No Content for OPTIONS responses
    });
  }

  try {
    const headers = Object.fromEntries(req.headers.entries());
    const logHeaders = { ...headers };
    
    // Mask sensitive headers in logs
    if (logHeaders.authorization) {
      logHeaders.authorization = "***REDACTED***";
    }
    console.log("Headers:", logHeaders);
    
    // Log URL information for better debugging
    console.log("Request URL:", req.url);
    
    // Validate and log request information
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) {
      try {
        // Clone request to avoid affecting the original
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
        
        // Log safer version of body without sensitive information
        const safeBody = { ...body };
        if (safeBody.email) safeBody.email = safeBody.email.substring(0, 3) + "***";
        if (safeBody.phone) safeBody.phone = "***";
        console.log("Request body (sanitized):", safeBody);
        
        // Validate required fields
        if (!body.email || !body.name || (!body.code && body.code !== "DIRECT_BOOKING") || !body.dealTitle) {
          const missingFields = [];
          if (!body.email) missingFields.push("email");
          if (!body.name) missingFields.push("name");
          if (!body.code && body.code !== "DIRECT_BOOKING") missingFields.push("code");
          if (!body.dealTitle) missingFields.push("dealTitle");
          
          return new Response(
            JSON.stringify({ 
              error: `Missing required fields: ${missingFields.join(', ')}`,
              errorDetails: "All required fields must be provided",
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
      // If not OPTIONS or POST with JSON, return an error
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
    // Process the request and send the email
    console.log("Processing email request");
    const response = await requestHandler(req);
    console.log(`Request processed, status: ${response.status}`);
    
    // Add CORS headers to the response
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });
    
    // Log response for debugging
    try {
      const responseClone = response.clone();
      const responseBody = await responseClone.text();
      console.log(`Response body: ${responseBody.substring(0, 200)}${responseBody.length > 200 ? '...' : ''}`);
    } catch (e) {
      console.warn("Could not log response body:", e.message);
    }
    
    // Return the response with CORS headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error in send-discount-email function:", error);
    console.error("Stack trace:", error.stack);
    
    // Create a more detailed error message
    const errorResponse = {
      error: error instanceof Error ? error.message : "An unknown error occurred",
      stack: error instanceof Error ? error.stack : "No stack trace available",
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
