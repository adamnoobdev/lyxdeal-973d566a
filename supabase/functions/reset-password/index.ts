
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { handleResetPasswordRequest } from "./requestHandler.ts";

serve(async (req) => {
  // Hantera OPTIONS-förfrågan för CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("reset-password function started");
    return await handleResetPasswordRequest(req);
  } catch (error) {
    console.error("Oväntat fel i reset-password-funktionen:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
