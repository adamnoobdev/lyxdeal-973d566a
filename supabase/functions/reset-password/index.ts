
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { handleResetPasswordRequest } from "./requestHandler.ts";

serve(async (req) => {
  console.log("=== Reset Password Function Started ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  // Hantera OPTIONS-förfrågan för CORS
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing reset-password request");
    const response = await handleResetPasswordRequest(req);
    console.log("Request processed, status:", response.status);
    return response;
  } catch (error) {
    console.error("Oväntat fel i reset-password-funktionen:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } finally {
    console.log("=== Reset Password Function Completed ===");
  }
});
