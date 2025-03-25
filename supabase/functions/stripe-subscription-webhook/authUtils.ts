
// Utility functions for handling authentication

export function validateAuthHeader(authHeader: string | null, stripeSignature: string | null): boolean {
  // För Stripe webhooks behöver vi inte standard authorization header
  // eftersom Stripe autentiserar via stripe-signature headern
  if (stripeSignature) {
    console.log("Stripe signature header found, skipping standard auth validation");
    return true;
  }
  
  // För standard API-anrop kräver vi fortfarande en Bearer token
  if (!authHeader) {
    console.error("Missing authorization header and no stripe-signature present");
    return false;
  }
  
  return authHeader.startsWith('Bearer ');
}

export function handleUnauthorized(headers: Record<string, string>): Response {
  console.error("Unauthorized request received");
  console.error("Headers received:", JSON.stringify(headers));
  
  return new Response(
    JSON.stringify({ 
      error: "Unauthorized. Missing or invalid authorization header."
    }),
    { 
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    }
  );
}

// Validerar specifikt en Stripe webhook-signatur
export function validateStripeWebhook(signature: string | null): boolean {
  if (!signature) {
    console.error("Missing stripe-signature header");
    return false;
  }
  
  // Stripe-signaturen börjar med t= följt av en tidsstämpel
  if (!signature.startsWith('t=')) {
    console.error("Invalid stripe-signature format:", signature.substring(0, 10) + "...");
    return false;
  }
  
  return true;
}
