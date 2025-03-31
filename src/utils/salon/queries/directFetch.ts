
/**
 * Direkthämtning av data via REST API utan autentisering
 * Detta gör att vi kan hämta offentlig data utan att vara inloggad
 */
export async function directFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[] | null> {
  try {
    // Säkerställ att vi har rätt URL och API-nyckel
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gmqeqhlhqhyrjquzhuzg.supabase.co";
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs";
    
    // KRITISKT - Skapa en kopia av params för att inte modifiera originalet
    const cleanParams = { ...params };
    
    // Lägg till select=* som standard om det inte redan finns
    if (!cleanParams['select']) {
      cleanParams['select'] = '*';
    }
    
    // VIKTIGT: Ta bort city-parametern om den finns eftersom kolumnen inte existerar
    if (cleanParams['city']) {
      console.log(`[directFetch] Tar bort ogiltigt 'city'-filter: ${cleanParams['city']} eftersom kolumnen inte existerar i ${endpoint}`);
      delete cleanParams['city'];
    }
    
    // Bygg REST API URL
    const url = new URL(`${supabaseUrl}/rest/v1/${endpoint}`);
    
    // Lägg till parametrar i URL
    Object.entries(cleanParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Kritiskt: Sätt korrekt Supabase API-nyckel i headers
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    
    // Detaljerad loggning för felsökning
    console.log(`[directFetch] Anropar REST API: ${endpoint}`);
    console.log(`[directFetch] URL (utan API-nyckel): ${url.toString().replace(/apikey=([^&]+)/, 'apikey=REDACTED')}`);
    console.log(`[directFetch] Parametrar efter rensning: ${JSON.stringify(cleanParams)}`);
    
    // Gör fetch-anropet
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers
    });
    
    // Kontrollera HTTP-statuskoden
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[directFetch] HTTP-fel: ${response.status} - ${response.statusText}`);
      console.error(`[directFetch] Felmeddelande: ${errorText}`);
      console.error(`[directFetch] URL (utan API-nyckel): ${url.toString().replace(/apikey=([^&]+)/, 'apikey=REDACTED')}`);
      return null;
    }
    
    // Tolka svaret som JSON
    const data = await response.json();
    
    // Hantera olika svarstyper
    if (Array.isArray(data)) {
      console.log(`[directFetch] Hämtade ${data.length} ${endpoint}-poster`);
      return data.length > 0 ? data as T[] : [];
    } else if (data && typeof data === 'object') {
      console.log(`[directFetch] Hämtade en ${endpoint}-post:`, data.id || 'ID saknas');
      return [data] as T[];
    } else {
      console.log(`[directFetch] Tomt eller oförväntat svar från API:`, data);
      return [];
    }
  } catch (error) {
    console.error(`[directFetch] Fel vid direkthämtning av ${endpoint}:`, error);
    return null;
  }
}
