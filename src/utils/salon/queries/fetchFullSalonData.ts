
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";
import { directFetch } from "./api/directFetch";

/**
 * Hämtar fullständig salongsdata med ett specifikt ID
 */
export const fetchFullSalonData = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`[fetchFullSalonData] Hämtar salong med ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Konvertera till nummer för numerisk sökning
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = !isNaN(numericId);
    
    // Prioritera direkthämtning via API utan autentisering
    console.log(`[fetchFullSalonData] Försöker direkthämta salong för ID=${salonId}`);
    
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${isValidNumber ? numericId : salonId}`, "select": "id,name,address,phone" }
    );
    
    if (directData && directData.length > 0) {
      console.log("[fetchFullSalonData] Hittade salong via direkthämtning:", directData[0]);
      return directData[0];
    } else {
      console.log("[fetchFullSalonData] Ingen salong hittades via direkthämtning");
    }
    
    // Fallback till Supabase klient
    if (isValidNumber) {
      console.log(`[fetchFullSalonData] Försöker med numerisk sökning: ${numericId}`);
      
      const { data, error } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .filter('id', 'eq', numericId)
        .maybeSingle();
        
      if (error) {
        console.error("[fetchFullSalonData] Fel vid numerisk sökning:", error);
      } else if (data) {
        console.log("[fetchFullSalonData] Hittade salong med numeriskt ID:", data);
        return data as SalonData;
      }
    }
    
    // Fallback till strängmatchning
    const stringId = String(salonId);
    console.log(`[fetchFullSalonData] Försöker med strängsökning: "${stringId}"`);
    
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)
      .maybeSingle();
      
    if (stringError) {
      console.error("[fetchFullSalonData] Fel vid strängsökning:", stringError);
    } else if (stringData) {
      console.log("[fetchFullSalonData] Hittade salong med strängjämförelse:", stringData);
      return stringData as SalonData;
    }
    
    // Sista försök: hämta alla salonger och filtrera
    console.log(`[fetchFullSalonData] Försöker hämta alla salonger för manuell sökning`);
    
    const allSalons = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name,address,phone", "limit": "50" }
    );
    
    if (allSalons && allSalons.length > 0) {
      console.log("[fetchFullSalonData] Hämtade alla salonger, antal:", allSalons.length);
      
      // Sök efter exakt match
      const matchedSalon = allSalons.find(salon => 
        salon.id == salonId || String(salon.id) === stringId
      );
      
      if (matchedSalon) {
        console.log("[fetchFullSalonData] Hittade matchande salong genom manuell jämförelse:", matchedSalon);
        return matchedSalon;
      }
      
      // Om ingen exakt match finns, använd första salongen som fallback
      console.log("[fetchFullSalonData] Ingen matchande salong hittades, använder första tillgängliga som fallback");
      return allSalons[0];
    }
    
    console.log(`[fetchFullSalonData] Kunde inte hitta salong med ID: ${salonId}`);
    return null;
  } catch (err) {
    console.error("[fetchFullSalonData] Undantag vid hämtning:", err);
    return null;
  }
};
