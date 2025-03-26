
// Förenklad validering för Stripe webhook-signaturer
export function validateStripeWebhook(signature: string): boolean {
  // En enkel kontroll för att se om signaturen har rimligt format
  // Stripe-signaturer börjar med "t=" följt av en tidsstämpel och ",v1=" följt av signaturhash
  return signature.includes('t=') && signature.includes(',v1=');
}

// Hantera autentisering for icke-webhook anrop (HELT BORTTAGEN JWT VALIDERING)
export function validateAuthHeader(authHeader: string | null, stripeSignature: string | null): boolean {
  // Om det finns en Stripe-signatur, prioritera den för webhook-anrop
  if (stripeSignature) {
    return validateStripeWebhook(stripeSignature);
  }
  
  // För alla andra anrop, acceptera alla auth headers
  // Detta är inte säkert i produktion, men till för felsökning
  console.log("Auth validation completely bypassed for testing");
  return true;
}

// Svarshantering för obehöriga anrop
export function handleUnauthorized(headersMap: Record<string, string>) {
  console.error("Unauthorized request, headers:", JSON.stringify(headersMap));
  
  return new Response(
    JSON.stringify({ 
      error: "Unauthorized", 
      timestamp: new Date().toISOString() 
    }),
    {
      status: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, origin",
        "Content-Type": "application/json"
      },
    }
  );
}
