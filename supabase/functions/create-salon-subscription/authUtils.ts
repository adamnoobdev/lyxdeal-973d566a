
import { corsHeaders } from "./corsConfig.ts";

export function validateAuthHeader(authHeader: string | null): boolean {
  if (!authHeader) {
    console.error("Missing authorization header");
    return false;
  }
  
  // Check if it's a Bearer token
  if (authHeader.startsWith("Bearer ")) {
    console.log("Valid Bearer token authorization header detected");
    return true;
  }
  
  // If it's some other authorization type, log it and return false
  console.error("Invalid authorization header format:", authHeader.substring(0, 10) + "...");
  return false;
}

export function handleUnauthorized(headers?: Record<string, string>) {
  console.error("Unauthorized access attempt");
  console.error("Request headers:", headers || {});
  
  return new Response(
    JSON.stringify({ 
      error: "Missing or invalid authorization header",
      status: "unauthorized",
      timestamp: new Date().toISOString()
    }),
    {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}
