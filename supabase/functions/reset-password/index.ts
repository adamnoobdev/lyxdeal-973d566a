
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./corsConfig.ts";
import { handleResetPasswordRequest } from "./requestHandler.ts";

serve(async (req) => {
  console.log("=== Reset Password Function Started ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  
  // Log all headers for debugging
  const headers = Object.fromEntries(req.headers.entries());
  console.log("Request headers:", JSON.stringify(headers, null, 2));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400"  // Cache preflight requests for 24 hours
      } 
    });
  }

  try {
    console.log("Processing reset-password request");
    const response = await handleResetPasswordRequest(req);
    console.log("Request processed successfully, status:", response.status);
    return response;
  } catch (error) {
    console.error("CRITICAL ERROR in reset-password edge function:");
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error in reset-password function",
        message: error instanceof Error ? error.message : String(error),
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
