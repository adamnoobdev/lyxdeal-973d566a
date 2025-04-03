
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { handleWelcomeEmailRequest } from "./requestHandler.ts";

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("send-salon-welcome function started");
    return await handleWelcomeEmailRequest(req);
  } catch (error) {
    console.error("Unhandled error in send-salon-welcome function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
