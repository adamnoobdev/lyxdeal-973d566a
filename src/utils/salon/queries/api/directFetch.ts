
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
    
    console.log(`Making direct fetch to: ${url}`);
    
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.log(`Direct API fetch failed: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.error("Exception in directFetch:", err);
    return null;
  }
};
