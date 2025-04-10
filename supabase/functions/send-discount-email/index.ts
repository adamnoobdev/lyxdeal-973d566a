
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  try {
    // Enhanced logging for debugging
    console.log(`Received ${req.method} request to send-discount-email function`);
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Responding to CORS preflight request");
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }
    
    // Log request content type
    const contentType = req.headers.get('content-type');
    console.log(`Request content-type: ${contentType}`);
    
    // Validate content type
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Invalid content type:", contentType);
      return new Response(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 415 }
      );
    }
    
    // Process the request body to check its validity
    const bodyClone = req.clone();
    try {
      const bodyText = await bodyClone.text();
      if (!bodyText || bodyText.trim() === '') {
        console.error("Empty request body detected");
        return new Response(
          JSON.stringify({ error: "Request body cannot be empty" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      console.log(`Request body length: ${bodyText.length} bytes`);
      if (bodyText.length < 10) {
        console.log("Full body content (very short):", bodyText);
      } else {
        console.log("Body preview:", bodyText.substring(0, 100) + "...");
      }
    } catch (bodyReadError) {
      console.error("Error reading request body:", bodyReadError);
    }
    
    // Forward to request handler
    console.log("Forwarding request to handler");
    try {
      const response = await requestHandler(req);
      
      // Ensure CORS headers are set on the response
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      
      console.log(`Response status: ${response.status}`);
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders
      });
    } catch (handlerError) {
      console.error("Error in request handler:", handlerError);
      return new Response(
        JSON.stringify({ 
          error: "Error processing request", 
          message: handlerError instanceof Error ? handlerError.message : String(handlerError),
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (outerError) {
    console.error("Unhandled exception in edge function:", outerError);
    return new Response(
      JSON.stringify({
        error: "Unhandled exception in edge function",
        message: outerError instanceof Error ? outerError.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
