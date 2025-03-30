
import { supabase } from "@/integrations/supabase/client";
import { directFetch } from "./api/directFetch";
import { SalonData } from "../types";

/**
 * Kontrollerar om salongstabellen finns och innehåller data
 */
export const checkSalonsTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if salons table exists and contains data");
    
    // Försök alltid med en direkt fetch först, eftersom det säkerställer åtkomst utan autentisering
    console.log("Using direct fetch to check salons table");
    
    const directData = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name", "limit": "5" }
    );
    
    if (directData && directData.length > 0) {
      console.log("Direct fetch salons table check result:", {
        accessible: true,
        recordsFound: directData.length,
        sampleData: directData
      });
      
      return true;
    }
    
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
  } catch (err) {
    console.error("Exception checking salons table:", err);
    return false;
  }
};
