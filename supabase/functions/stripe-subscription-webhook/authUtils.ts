
import { corsHeaders } from "./corsHeaders.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";

export function validateStripeWebhook(signature: string | null): boolean {
  if (!signature) {
    console.error("No Stripe signature provided in request");
    return false;
  }
  
  // Enkel validering av signaturformat - ska innehålla "t=" och "v1="
  const hasTimestamp = signature.includes("t=");
  const hasSignature = signature.includes("v1=");
  
  if (!hasTimestamp || !hasSignature) {
    console.error(`Invalid signature format: Missing ${!hasTimestamp ? 't=' : ''} ${!hasSignature ? 'v1=' : ''}`);
    return false;
  }
  
  console.log("Stripe signature format validated successfully");
  return true;
}

export function validateAuthHeader(authHeader: string | null, stripeSignature: string | null): boolean {
  // VIKTIG ÄNDRING: Om Stripe-signatur finns, acceptera anropet även utan auth-header
  if (stripeSignature) {
    console.log("Stripe webhook detected, skipping regular auth validation");
    return true; // Acceptera Stripe webhook-anrop utan att kräva auth-header
  }
  
  // För icke-Stripe-begäran, validera standard auth-header
  if (!authHeader) {
    console.log("No auth header found for non-Stripe request");
    return false;
  }
  
  // Headern ska vara i formatet "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log("Invalid auth header format, expected 'Bearer <token>'");
    return false;
  }
  
  // Enkel token-validering
  const token = parts[1];
  const isValid = token.length > 0;
  console.log("Auth token validation result:", isValid ? "valid" : "invalid");
  return isValid;
}

export function handleUnauthorized(headers?: Record<string, string>) {
  console.error("Unauthorized request - missing or invalid authentication", 
    headers ? JSON.stringify({
      'stripe-signature': headers['stripe-signature'] ? 'present' : 'missing',
      'authorization': headers['authorization'] ? 'present' : 'missing'
    }) : "No headers");
  
  return new Response(
    JSON.stringify({ 
      code: 401,
      message: "Missing authorization header or invalid Stripe signature",
      timestamp: new Date().toISOString()
    }),
    { 
      status: 401, 
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      } 
    }
  );
}
