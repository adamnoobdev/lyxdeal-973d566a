
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
      
      // Detailed debugging for the request body
      try {
        // Clone the request to make sure we don't consume the body before processing
        const clonedReq = req.clone();
        
        // Get the request body as text for inspection
        let bodyText;
        try {
          bodyText = await clonedReq.text();
          console.log(`Raw request body length: ${bodyText.length}`);
          
          // Log the first part of the body (for privacy, limit what's shown)
          if (bodyText.length > 0) {
            console.log(`Body preview (first 100 chars): ${bodyText.substring(0, 100)}${bodyText.length > 100 ? '...' : ''}`);
            
            // Try to parse as JSON to verify it's valid
            try {
              const jsonBody = JSON.parse(bodyText);
              console.log("Parsed JSON successfully, keys:", Object.keys(jsonBody).join(", "));
            } catch (jsonError) {
              console.error("Failed to parse body as JSON:", jsonError.message);
            }
          } else {
            console.error("Request body is empty");
          }
        } catch (bodyError) {
          console.error("Error reading request body:", bodyError);
        }
      } catch (debugError) {
        console.error("Error in request debugging:", debugError);
      }
      
      // Check if content-length exists and is greater than zero
      if (contentLength === '0' || contentLength === 'unknown' || parseInt(contentLength || '0') <= 2) {
        console.error("Request has empty or invalid content-length:", contentLength);
        
        return new Response(
          JSON.stringify({ 
            error: "Empty request body detected",
            message: "The request body is empty. Check that the request is properly formatted with a valid body.",
            contentLength,
            contentType
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }
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
    
    // Create a fresh request with properly verified body for the handler
    try {
      // Clone the request first so we don't consume the body
      const clonedReq = req.clone();
      const bodyText = await clonedReq.text();
      
      // Ensure we have a body
      if (!bodyText || bodyText.trim().length === 0) {
        console.error("Empty request body detected in final check");
        return new Response(
          JSON.stringify({ 
            error: "Request body cannot be empty",
            message: "The request body is empty but content-length header might be set. Check that the body is properly sent."
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Validate JSON
      try {
        const parsedBody = JSON.parse(bodyText);
        if (!parsedBody || (typeof parsedBody === 'object' && Object.keys(parsedBody).length === 0)) {
          console.error("Empty JSON object received");
          return new Response(
            JSON.stringify({ error: "Empty JSON object received" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }
        
        // Create a new request with the verified body
        const newRequest = new Request(req.url, {
          method: req.method,
          headers: req.headers,
          body: JSON.stringify(parsedBody)
        });
        
        // Process the request and send the email
        console.log("Forwarding valid request to handler");
        const response = await requestHandler(newRequest);
        
        // Add CORS headers to the response
        const responseHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          responseHeaders.set(key, value);
        });
        
        console.log("Handler processed request, returning response");
        // Return the response with CORS headers
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
        
      } catch (parseError) {
        console.error("Invalid JSON format:", parseError.message);
        return new Response(
          JSON.stringify({ 
            error: "Invalid JSON format in request body", 
            details: parseError.message,
            receivedBody: bodyText.substring(0, 200) + (bodyText.length > 200 ? '...' : '')
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    } catch (e) {
      console.error("Error pre-checking body:", e);
      return new Response(
        JSON.stringify({ 
          error: "Error reading request body", 
          details: e instanceof Error ? e.message : String(e)
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
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
