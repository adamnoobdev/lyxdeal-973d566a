
import { supabase } from "@/integrations/supabase/client";
import { directFetch } from "./api/directFetch";
import { SalonData } from "../types";

/**
 * Kontrollerar om salongstabellen finns och innehåller data
 */
export const checkSalonsTable = async (): Promise<boolean> => {
  try {
    console.log("[checkSalonsTable] Kontrollerar om salongstabellen finns och innehåller data");
    
    // Försök alltid med en direkt fetch först, eftersom det säkerställer åtkomst utan autentisering
    console.log("[checkSalonsTable] Använder direkthämtning för kontroll");
    
    const directData = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name", "limit": "5" }
    );
    
    if (directData && directData.length > 0) {
      console.log("[checkSalonsTable] Direkthämtning lyckades:", {
        accessible: true,
        recordsFound: directData.length,
        sampleData: directData[0]
      });
      
      return true;
    }
    
    // Fallback till normal Supabase-förfrågan
    const { data, error, status } = await supabase
      .from("salons")
      .select("id, name")
      .limit(5);
      
    if (error) {
      console.error("[checkSalonsTable] Fel vid åtkomst till salongstabellen:", error);
      return false;
    }
    
    console.log("[checkSalonsTable] Supabase klientkontroll:", {
      accessible: true,
      recordsFound: data?.length || 0,
      sampleData: data && data.length > 0 ? data[0] : null
    });
    
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error("[checkSalonsTable] Undantag vid kontroll:", err);
    return false;
  }
};
