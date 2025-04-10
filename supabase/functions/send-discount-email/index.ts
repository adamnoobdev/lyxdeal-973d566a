
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { requestHandler } from "./requestHandler.ts";

serve(async (req) => {
  // Log the incoming request for debugging
  console.log(`Received ${req.method} request to send-discount-email function`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Responding to CORS preflight request");
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Process the request and send the email
    console.log("Processing email request");
    const response = await requestHandler(req);
    console.log(`Request processed, status: ${response.status}`);
    return response;
  } catch (error) {
    console.error("Error in send-discount-email function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
