
// Utility functions for handling authentication

export function validateAuthHeader(authHeader: string | null): boolean {
  // For Stripe webhooks, we don't require the standard authorization header
  // as Stripe authenticates via the stripe-signature header
  // This function will be bypassed for Stripe webhook validation
  if (!authHeader) {
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
        "Content-Type": "application/json"
      }
    }
  );
}
