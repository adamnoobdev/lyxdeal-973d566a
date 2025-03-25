
import { corsHeaders } from "./corsHeaders.ts";
import { getStripeWebhookSecret } from "./supabaseClient.ts";

export function validateStripeWebhook(signature: string | null): boolean {
  // Just check that the signature exists, actual verification will be done in the handler
  return !!signature;
}

export function validateAuthHeader(authHeader: string | null, stripeSignature: string | null): boolean {
  // If we have a stripe signature, we skip the regular auth validation
  if (stripeSignature) {
    console.log("Stripe signature present, skipping regular auth validation");
    return true;
  }
  
  // For non-Stripe requests, validate the standard auth header
  if (!authHeader) {
    console.log("No auth header found");
    return false;
  }
  
  // The header should be in the format "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log("Invalid auth header format");
    return false;
  }
  
  // Simple token validation - in production you'd verify this
  const token = parts[1];
  return token.length > 0;
}

export function handleUnauthorized(headers?: Record<string, string>) {
  console.error("Unauthorized request", headers ? JSON.stringify(headers) : "No headers");
  
  return new Response(
    JSON.stringify({ 
      code: 401,
      message: "Missing authorization header" 
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
