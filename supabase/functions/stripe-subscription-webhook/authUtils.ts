
import { corsHeaders } from "./corsHeaders.ts";

export function validateStripeWebhook(signature: string): boolean {
  console.log("Validating Stripe signature:", signature ? "Present" : "Missing");
  
  if (!signature) {
    console.error("No stripe-signature header present");
    return false;
  }
  
  // Enkel validering av signaturformat
  // Verkliga signaturer ser ut som: t=1642...,v1=5678...
  if (signature.includes("t=") && signature.includes("v1=")) {
    console.log("Stripe signature format looks valid");
    return true;
  }
  
  console.error("Invalid Stripe signature format:", signature.substring(0, 30) + "...");
  return false;
}

export function validateAuthHeader(authHeader: string | null, stripeSignature: string | null): boolean {
  // Prioritera Stripe-signatur om sådan finns (från Stripe direkt)
  if (stripeSignature && validateStripeWebhook(stripeSignature)) {
    console.log("Request has valid Stripe signature, bypassing auth header check");
    return true;
  }
  
  // Annars validera Auth-header för direkta anrop
  console.log("Validating auth header:", authHeader ? `${authHeader.substring(0, 10)}...` : "null");
  
  if (!authHeader) {
    console.error("Missing authorization header and no valid Stripe signature");
    return false;
  }
  
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    console.log("Found Bearer token, length:", token.length);
    
    // Enkel validering att token inte är tom
    if (token.length > 0) {
      console.log("Auth header validation passed");
      return true;
    }
  }
  
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
    const importantHeaders = ["authorization", "stripe-signature", "content-type", "origin", "apikey"];
    console.log("Important headers status:");
    importantHeaders.forEach(header => {
      console.log(`- ${header}: ${headers[header] ? "present" : "missing"}`);
    });
  }
  
  return new Response(
    JSON.stringify({ 
      error: "Missing or invalid authorization header or Stripe signature",
      status: "unauthorized",
      details: "Please include either a valid 'Authorization: Bearer TOKEN' header or a valid Stripe signature",
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
