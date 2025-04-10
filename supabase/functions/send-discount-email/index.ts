
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  try {
    // Enhanced logging for debugging
    console.log(`Received ${req.method} request to send-discount-email function`);
    console.log("Request URL:", req.url);
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Responding to CORS preflight request");
      return new Response(null, {
        headers: corsHeaders,
        status: 204, // Use 204 No Content for OPTIONS responses
      });
    }
    
    // Log headers (with sensitive info masked)
    const headersMap: Record<string, string> = {};
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() === "authorization") {
        headersMap[key] = value.substring(0, 10) + "...";
      } else {
        headersMap[key] = value;
      }
    }
    console.log("Headers:", headersMap);
    
    // Check content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Invalid content type:", contentType);
      return new Response(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 415 }
      );
    }
    
    // Check content length
    const contentLength = req.headers.get('content-length');
    if (contentLength === '0') {
      console.error("Empty request body (content-length: 0)");
      return new Response(
        JSON.stringify({ error: "Request body cannot be empty" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
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
        const responseText = await responseClone.text();
        let responseBody;
        try {
          responseBody = JSON.parse(responseText);
          console.log("Response body:", responseBody);
        } catch (e) {
          console.log("Response (not JSON):", responseText.substring(0, 200));
        }
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
      console.error("Error in request processing:", error);
      console.error("Error stack trace:", error.stack);
      
      return new Response(
        JSON.stringify({
          error: "Error processing request",
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (outerError) {
    console.error("Unhandled exception in edge function:", outerError);
    console.error("Outer error stack:", outerError.stack);
    
    return new Response(
      JSON.stringify({
        error: "Unhandled exception in edge function",
        message: outerError instanceof Error ? outerError.message : "Unknown error",
        stack: outerError instanceof Error ? outerError.stack : undefined,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
