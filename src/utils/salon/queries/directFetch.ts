
/**
 * Direct fetch of data via REST API without authentication
 * This allows us to fetch public data without being logged in
 */
export async function directFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[] | null> {
  try {
    // Ensure we have the correct URL and API key
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gmqeqhlhqhyrjquzhuzg.supabase.co";
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs";
    
    // Create a copy of params to avoid modifying the original
    const cleanParams = { ...params };
    
    // Add select=* as default if it doesn't already exist
    if (!cleanParams['select']) {
      cleanParams['select'] = '*';
    }
    
    // Build REST API URL
    const url = new URL(`${supabaseUrl}/rest/v1/${endpoint}`);
    
    // Add parameters to URL
    Object.entries(cleanParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Critical: Set correct Supabase API key in headers
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    
    // Detailed logging for debugging
    console.log(`[directFetch] Calling REST API: ${endpoint}`);
    console.log(`[directFetch] URL (utan API-nyckel): ${url.toString().replace(/apikey=([^&]+)/, 'apikey=REDACTED')}`);
    console.log(`[directFetch] Parameters: ${JSON.stringify(cleanParams)}`);
    
    // Make the fetch call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Check HTTP status code
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[directFetch] HTTP error: ${response.status} - ${response.statusText}`);
        console.error(`[directFetch] Error message: ${errorText}`);
        
        // För 403 Forbidden, troligen ett RLS-problem
        if (response.status === 403) {
          console.error(`[directFetch] 403 Forbidden: Detta är troligen ett RLS policy-problem!`);
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      
      // Parse response as JSON
      const data = await response.json();
      
      // Handle different response types
      if (Array.isArray(data)) {
        console.log(`[directFetch] Retrieved ${data.length} ${endpoint} records`);
        return data as T[];
      } else if (data && typeof data === 'object') {
        console.log(`[directFetch] Retrieved a single ${endpoint} record`);
        return [data] as T[];
      } else {
        console.log(`[directFetch] Empty or unexpected response from API:`, data);
        return [];
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Specifik hantering för abort (timeout)
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        console.error(`[directFetch] Request timed out efter 10 sekunder`);
        throw new Error('Förfrågan tog för lång tid, försök igen senare');
      } else {
        console.error(`[directFetch] Fetch error:`, fetchError);
        throw fetchError;
      }
    }
  } catch (error) {
    console.error(`[directFetch] Error during direct fetch of ${endpoint}:`, error);
    throw error;
  }
}
