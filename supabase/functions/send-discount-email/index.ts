
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
    
    // Log request details without sensitive info
    try {
      const contentType = req.headers.get('content-type') || 'none';
      const contentLength = req.headers.get('content-length') || 'unknown';
      const origin = req.headers.get('origin') || 'unknown';
      
      console.log(`Request details: method=${req.method}, content-type=${contentType}, content-length=${contentLength}, origin=${origin}`);
    } catch (e) {
      console.log("Error logging request details:", e.message);
    }
    
    // Check content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Invalid content type:", contentType);
      return new Response(
        JSON.stringify({ 
          error: "Content-Type must be application/json",
          receivedContentType: contentType || "none" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 415 }
      );
    }
    
    // Check content length
    const contentLength = req.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      console.error("Empty or missing content-length header:", contentLength);
      return new Response(
        JSON.stringify({ error: "Request body cannot be empty" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Extra check for body
    const clonedReq = req.clone();
    try {
      const bodyText = await clonedReq.text();
      if (!bodyText || bodyText.trim() === '') {
        console.error("Empty request body despite content-length header");
        return new Response(
          JSON.stringify({ error: "Request body is empty despite Content-Length header" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    } catch (e) {
      console.error("Error pre-checking body:", e);
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
          console.log("Response (not JSON):", responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
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
