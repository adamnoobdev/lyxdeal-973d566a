
// Förenklad auth-validering som bara kontrollerar att headern finns och är icke-tom
export function validateAuthHeader(authHeader: string | null): boolean {
  if (!authHeader) {
    console.error("Authorization header is missing");
    return false;
  }
  
  // Bara en enkel kontroll att den finns och har ett värde
  console.log("Auth header length:", authHeader.length);
  return authHeader.length > 0;
}

// Förberedd svarshantering för obehöriga anrop
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
