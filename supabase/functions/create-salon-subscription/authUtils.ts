
import { corsHeaders } from "./corsConfig.ts";

export function validateAuthHeader(authHeader: string | null): boolean {
  // Utökad loggning för felsökning
  console.log("Validating auth header:", authHeader ? `${authHeader.substring(0, 10)}...` : "null");
  
  if (!authHeader) {
    console.error("Missing authorization header");
    return false;
  }
  
  // Acceptera alla Bearer-tokens för att underlätta testning
  // I produktion bör detta vara mer strikt
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    console.log("Found Bearer token, length:", token.length);
    
    // Enkel validering att token inte är tom
    if (token.length > 0) {
      console.log("Auth header validation passed");
      return true;
    }
  }
  
  // Logga specifikt vad som gick fel
  console.error("Invalid authorization header format:", 
                authHeader.substring(0, 15) + "...", 
                "Expected format: 'Bearer TOKEN'");
  return false;
}

export function handleUnauthorized(headers?: Record<string, string>) {
  console.error("Unauthorized access attempt");
  console.error("Request headers:", headers ? JSON.stringify(headers, null, 2) : "No headers provided");
  
  // Logga alla viktiga headers för att underlätta felsökning
  if (headers) {
    const importantHeaders = ["authorization", "stripe-signature", "content-type", "origin"];
    console.log("Important headers status:");
    importantHeaders.forEach(header => {
      console.log(`- ${header}: ${headers[header] ? "present" : "missing"}`);
    });
  }
  
  return new Response(
    JSON.stringify({ 
      error: "Missing or invalid authorization header",
      status: "unauthorized",
      details: "Please include a valid 'Authorization: Bearer TOKEN' header",
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
