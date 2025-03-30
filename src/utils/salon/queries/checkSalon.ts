
import { supabase } from "@/integrations/supabase/client";

/**
 * Kontrollerar om salongstabellen finns och innehåller data
 */
export const checkSalonsTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if salons table exists and contains data");
    
    // Först, prova vanlig Supabase fråga
    const { data, error, status } = await supabase
      .from("salons")
      .select("id, name")
      .limit(5);
      
    if (error) {
      console.error("Error accessing salons table with Supabase client:", error);
      
      // Prova direkt fetch som fallback utan auth
      console.log("Trying direct fetch to check salons table");
      const response = await fetch(
        `${supabase.supabaseUrl}/rest/v1/salons?select=id,name&limit=5`,
        {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        console.error("Direct fetch to salons table failed:", response.status, response.statusText);
        return false;
      }
      
      const directData = await response.json();
      console.log("Direct fetch salons table check result:", {
        accessible: true,
        recordsFound: directData?.length || 0,
        sampleData: directData
      });
      
      return Array.isArray(directData) && directData.length > 0;
    }
    
    // Tabellen existerar och vi kan komma åt den via Supabase-klienten
    console.log("Salons table check result:", {
      accessible: true,
      recordsFound: data?.length || 0,
      sampleData: data
    });
    
    return true;
  } catch (err) {
    console.error("Exception checking salons table:", err);
    return false;
  }
};
