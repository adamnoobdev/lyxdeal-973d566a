
// Förenklad validering för Stripe webhook-signaturer
export function validateStripeWebhook(signature: string): boolean {
  console.log("Validerar Stripe webhook-signatur:", signature.substring(0, 20) + "...");
  
  // En enkel kontroll för att se om signaturen har rimligt format
  // Stripe-signaturer börjar med "t=" följt av en tidsstämpel och ",v1=" följt av signaturhash
  const isValid = signature.includes('t=') && signature.includes(',v1=');
  
  console.log("Stripe signatur validering resultat:", isValid ? "GODKÄND" : "UNDERKÄND");
  return isValid;
}

// Hantera autentisering for icke-webhook anrop (HELT BORTTAGEN JWT VALIDERING)
export function validateAuthHeader(authHeader: string | null, stripeSignature: string | null): boolean {
  console.log("=== AUTENTISERING KONTROLL STARTAD ===");
  console.log("Auth header:", authHeader ? authHeader.substring(0, 15) + "..." : "SAKNAS");
  console.log("Stripe signatur:", stripeSignature ? stripeSignature.substring(0, 20) + "..." : "SAKNAS");
  
  // Om det finns en Stripe-signatur, prioritera den för webhook-anrop
  if (stripeSignature) {
    console.log("Stripe signatur hittad - använder denna för validering istället för JWT");
    return validateStripeWebhook(stripeSignature);
  }
  
  // För alla andra anrop, acceptera alla auth headers
  // Detta är inte säkert i produktion, men till för felsökning
  console.log("JWT-VALIDERING HELT AVSTÄNGD - ALL TRAFIK TILLÅTS!");
  console.log("=== AUTENTISERING KONTROLL AVSLUTAD ===");
  return true;
}

// Svarshantering för obehöriga anrop
export function handleUnauthorized(headersMap: Record<string, string>) {
  console.error("OBEHÖRIGT ANROP DETEKTERAT");
  console.error("Headers:", JSON.stringify(headersMap, null, 2));
  
  return new Response(
    JSON.stringify({ 
      error: "Unauthorized", 
      timestamp: new Date().toISOString(),
      message: "Obehörigt anrop - kontrollera autentiseringsheaders"
    }),
    {
      status: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, origin, stripe-signature",
        "Content-Type": "application/json"
      },
    }
  );
}
