
// Simplest possible function to test Edge Function connectivity
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  console.log("TEST-OPENNESS ENDPOINT CALLED");
  console.log("HTTP METHOD:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  
  // Log request details for debugging
  console.log("Request URL:", req.url);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  
  // Return a simple success response
  return new Response(
    JSON.stringify({
      success: true,
      message: "Test function is working!",
      timestamp: new Date().toISOString(),
      method: req.method
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
});
