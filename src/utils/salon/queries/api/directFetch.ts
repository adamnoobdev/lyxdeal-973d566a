
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/supabaseConfig";

/**
 * Utför en direkt API-begäran till Supabase utan att gå via klienten
 */
export const directFetch = async <T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[] | null> => {
  try {
    // Bygg query string från params
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const queryPart = queryString ? `?${queryString}` : '';
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}${queryPart}`;
    
    console.log(`[directFetch] Hämtar data direkt från: ${url}`);
    
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      console.error(`[directFetch] Direkthämtning misslyckades: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`[directFetch] Felmeddelande: ${errorText}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`[directFetch] Framgångsrik hämtning från ${endpoint}, antal objekt:`, Array.isArray(data) ? data.length : 'N/A (ej array)');
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.error("[directFetch] Exception vid API-anrop:", err);
    return null;
  }
};
