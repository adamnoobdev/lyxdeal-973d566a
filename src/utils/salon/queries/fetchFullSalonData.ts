
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";
import { directFetch } from "./api/directFetch";

/**
 * Hämtar fullständig salongsdata med ett specifikt ID
 */
export const fetchFullSalonData = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Fetching full salon data for ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Hämta direkt via API utan autentisering först
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    
    console.log(`Using direct API query for salon ID: ${salonId}`);
    
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${numericId}`, "select": "id,name,address,phone" }
    );
    
    if (directData && directData.length > 0) {
      console.log("Retrieved salon with direct API query:", directData[0]);
      return directData[0];
    }
    
    // Fallback till Supabase klient om API-förfrågan misslyckas
    if (!isNaN(numericId)) {
      console.log(`Using numeric query for salon ID: ${numericId}`);
      
      const { data, error } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .filter('id', 'eq', numericId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching salon with numeric ID:", error);
      } else if (data) {
        console.log("Retrieved salon with numeric ID:", data);
        return data as SalonData;
      }
    }
    
    // Fallback till strängmatchning om numerisk sökning misslyckas
    const stringId = String(salonId);
    console.log(`Using string filter for salon ID: "${stringId}"`);
    
    // Använd filter-metoden med explicit typkonvertering för att matcha strängar
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)  // Konvertera id till text för jämförelse
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string-based salon query:", stringError);
    } else if (stringData) {
      console.log("Retrieved salon with string comparison:", stringData);
      return stringData as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId} using any method`);
    return null;
  } catch (err) {
    console.error("Exception in fetchFullSalonData:", err);
    return null;
  }
};
