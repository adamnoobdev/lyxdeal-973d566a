
const API_URL = "https://gmqeqhlhqhyrjquzhuzg.supabase.co/rest/v1";

/**
 * Directly fetches data from Supabase REST API without requiring authentication
 */
export async function directFetch<T>(
  table: string,
  params: Record<string, string> = {},
  options: RequestInit = {}
): Promise<T[] | null> {
  try {
    // Build URL with query parameters
    const url = new URL(`${API_URL}/${table}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Add Supabase API headers
    const headers = new Headers({
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    });

    // Make fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      ...options,
    });

    // Handle errors
    if (!response.ok) {
      console.error(`[directFetch] Error response: ${response.status} ${response.statusText}`);
      if (response.status === 401 || response.status === 403) {
        console.error("[directFetch] Authorization error, public data may still be accessible");
        // For auth errors, we don't throw - we'll try to return whatever data we can
        return null;
      }
      return null;
    }

    // Parse response
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("[directFetch] Exception:", error);
    return null;
  }
}
