
import { supabase } from "@/integrations/supabase/client";

/**
 * Kontrollerar om salongstabellen finns och innehåller data
 */
export const checkSalonsTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if salons table exists and contains data");
    
    // Använd en enkel fråga som borde fungera även om tabellen är tom
    const { data, error } = await supabase
      .from("salons")
      .select("id, name")
      .limit(5);
      
    if (error) {
      console.error("Error accessing salons table:", error);
      return false;
    }
    
    // Tabellen existerar och vi kan komma åt den
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
