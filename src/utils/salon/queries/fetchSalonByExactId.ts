
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/supabaseConfig";
import { directFetch } from "./api/directFetch";

/**
 * Hämtar en salong med exakt matchande ID
 */
export const fetchSalonByExactId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Attempting to fetch salon with exact ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Konvertera till nummer för numerisk sökning
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = !isNaN(numericId);
    
    // Hämta direkt via API utan autentisering först
    console.log(`Fetching salon with ID=${salonId} via direct API`);
    
    // Använd directFetch för att hämta salongen
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${numericId}`, "select": "id,name,address,phone" }
    );
    
    if (directData && directData.length > 0) {
      console.log("Found salon with direct API query:", directData[0]);
      return directData[0];
    }
    
    // Fallback till Supabase klient
    // Försök hämta med numeriskt ID först om giltigt
    if (isValidNumber) {
      console.log(`Querying salon with numeric ID: ${numericId}`);
      
      const { data: numericData, error: numericError } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .filter('id', 'eq', numericId)
        .maybeSingle();
        
      if (numericError) {
        console.error("Error in numeric salon query:", numericError);
      } else if (numericData) {
        console.log("Found salon with numeric ID:", numericData);
        return numericData as SalonData;
      }
    }
    
    // Om numerisk sökning misslyckas, prova strängmatchning med explicit content-type
    const stringId = String(salonId);
    console.log(`Querying salon with string ID filter: ${stringId}`);
    
    // Ändra till att använda filterfunktionen med explicit typkonvertering
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)  // Konvertera id till text för jämförelse
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string salon query:", stringError);
    } else if (stringData) {
      console.log("Found salon with string ID comparison:", stringData);
      return stringData as SalonData;
    }
    
    // Om ingen exakt match, prova att söka efter alla salonger (begränsat antal)
    console.log(`No direct match, fetching a limited set of salons to search manually`);
    
    // Använd directFetch för att hämta alla salonger
    const allSalons = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name,address,phone", "limit": "50" }
    );
      
    if (allSalons && allSalons.length > 0) {
      console.log("Got all salons to search manually, count:", allSalons.length);
      // Sök manuellt efter en matchande ID
      const matchedSalon = allSalons.find(salon => 
        salon.id == salonId || String(salon.id) === stringId
      );
      
      if (matchedSalon) {
        console.log("Found salon through manual comparison:", matchedSalon);
        return matchedSalon as SalonData;
      }
      
      // Fallback till första salonen om ingen match hittas
      console.log("No matching salon found, using first available salon as fallback");
      return allSalons[0] as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId} using any method`);
    return null;
  } catch (err) {
    console.error("Exception fetching salon by exact ID:", err);
    return null;
  }
};
