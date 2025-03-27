
// Debug webhook for testing network connectivity
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Define CORS headers that allow all calls
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  try {
    console.log("==== DEBUG WEBHOOK RECEIVED ====");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    
    // Log all request headers
    const headersMap = Object.fromEntries(req.headers.entries());
    console.log("Headers:", JSON.stringify(headersMap, null, 2));
    
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS preflight");
      return new Response(null, { headers: corsHeaders });
    }
    
    // Try to read body data
    let bodyData = "No body";
    try {
      if (req.body) {
        const bodyText = await req.text();
        console.log("Body length:", bodyText.length);
        console.log("Body preview:", bodyText.substring(0, 200) + "...");
        bodyData = bodyText;
      }
    } catch (err) {
      console.log("Could not read body:", err.message);
    }
    
    // Return successful response - NO auth check
    return new Response(
      JSON.stringify({
        success: true,
        message: "Debug webhook called successfully",
        timestamp: new Date().toISOString(),
        headers_received: Object.keys(headersMap),
        body_size: bodyData.length
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("Error in debug-webhook:", err);
    console.error("Error message:", err.message);
    console.error("Stack:", err.stack);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: err.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
