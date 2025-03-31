
/**
 * Direkthämtning av data via REST API utan autentisering
 * Detta gör att vi kan hämta offentlig data utan att vara inloggad
 */
export async function directFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[] | null> {
  try {
    // Bygg URL med parametrar
    const url = new URL(`${import.meta.env.VITE_SUPABASE_URL || "https://gmqeqhlhqhyrjquzhuzg.supabase.co"}/rest/v1/${endpoint}`);
    
    // Lägg till parametrar i URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Sätt API-nyckel och content-type headers för att använda REST API
    const headers = {
      'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs"}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    
    // Gör fetch-anropet
    console.log(`[directFetch] Anropar: ${url.toString().replace(/apikey=([^&]+)/, 'apikey=REDACTED')}`);
    console.log(`[directFetch] Parametrar: ${JSON.stringify(params)}`);
    console.log(`[directFetch] Använder headers:`, Object.keys(headers));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers
    });
    
    // Kontrollera HTTP-statuskoden
    if (!response.ok) {
      console.error(`[directFetch] HTTP-fel: ${response.status} - ${response.statusText}`);
      console.error(`[directFetch] URL: ${url.toString().replace(/apikey=([^&]+)/, 'apikey=REDACTED')}`);
      
      // Logga responsens innehåll för felsökning
      try {
        const errorText = await response.text();
        console.error(`[directFetch] Felmeddelande: ${errorText}`);
      } catch (e) {
        console.error("[directFetch] Kunde inte läsa felmeddelande från svar");
      }
      
      return null;
    }
    
    // Tolka svaret som JSON
    const data = await response.json();
    
    // Om svaret är en tom array, returnera en tom array
    if (Array.isArray(data) && data.length === 0) {
      console.log(`[directFetch] Tomt svar från API`);
      return [];
    }
    
    // Hantera både array och single-objekt svar
    const resultArray = Array.isArray(data) ? data : [data];
    console.log(`[directFetch] Hämtade ${resultArray.length} poster:`, resultArray);
    
    return resultArray as T[];
  } catch (error) {
    console.error(`[directFetch] Fel vid direkthämtning: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
