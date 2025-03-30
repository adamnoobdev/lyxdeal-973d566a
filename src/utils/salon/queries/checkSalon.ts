
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/supabaseConfig";

/**
 * Kontrollerar om salongstabellen finns och innehåller data
 */
export const checkSalonsTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if salons table exists and contains data");
    
    // Försök alltid med en direkt fetch först, eftersom det säkerställer åtkomst utan autentisering
    console.log("Using direct fetch to check salons table");
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/salons?select=id,name&limit=5`,
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
      console.error("Direct fetch to salons table failed:", response.status, response.statusText);
      
      // Fallback till normal Supabase-förfrågan
      const { data, error, status } = await supabase
        .from("salons")
        .select("id, name")
        .limit(5);
        
      if (error) {
        console.error("Error accessing salons table with Supabase client:", error);
        return false;
      }
      
      console.log("Supabase client salons table check result:", {
        accessible: true,
        recordsFound: data?.length || 0,
        sampleData: data
      });
      
      return Array.isArray(data) && data.length > 0;
    }
    
    const directData = await response.json();
    console.log("Direct fetch salons table check result:", {
      accessible: true,
      recordsFound: directData?.length || 0,
      sampleData: directData
    });
    
    return Array.isArray(directData) && directData.length > 0;
  } catch (err) {
    console.error("Exception checking salons table:", err);
    return false;
  }
};
