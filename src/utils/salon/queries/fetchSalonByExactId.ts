
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";
import { directFetch } from "./api/directFetch";

/**
 * Hämtar en salong med exakt matchande ID
 */
export const fetchSalonByExactId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`[fetchSalonByExactId] Försöker hämta salong med ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Konvertera till nummer för numerisk sökning
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = !isNaN(numericId);
    const stringId = String(salonId);
    
    // Prioritera direkthämtning via API utan autentisering
    console.log(`[fetchSalonByExactId] Försöker direkthämta salong med ID=${salonId}`);
    
    // Använd directFetch med bättre felhantering
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${isValidNumber ? numericId : salonId}`, "select": "id,name,address,phone" }
    );
    
    if (directData && directData.length > 0) {
      console.log("[fetchSalonByExactId] Hittade salong via direkthämtning:", directData[0]);
      return directData[0];
    } else {
      console.log("[fetchSalonByExactId] Ingen salong hittades via direkthämtning, försöker alternativa metoder");
    }
    
    // Fallback till Supabase klient
    // Försök hämta med numeriskt ID först om giltigt
    if (isValidNumber) {
      console.log(`[fetchSalonByExactId] Försöker hämta med numeriskt ID: ${numericId}`);
      
      const { data: numericData, error: numericError } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .filter('id', 'eq', numericId)
        .maybeSingle();
        
      if (numericError) {
        console.error("[fetchSalonByExactId] Fel vid numerisk sökning:", numericError);
      } else if (numericData) {
        console.log("[fetchSalonByExactId] Hittade salong med numeriskt ID:", numericData);
        return numericData as SalonData;
      }
    }
    
    // Prova strängsökning med olika metoder
    console.log(`[fetchSalonByExactId] Försöker med strängsökning: ${stringId}`);
    
    // Metod 1: Textfilter med explicit konvertering
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)
      .maybeSingle();
      
    if (stringError) {
      console.error("[fetchSalonByExactId] Fel vid strängsökning:", stringError);
    } else if (stringData) {
      console.log("[fetchSalonByExactId] Hittade salong med strängjämförelse:", stringData);
      return stringData as SalonData;
    }
    
    // Metod 2: Hämta alla salonger och filtrera manuellt
    console.log(`[fetchSalonByExactId] Försöker hämta alla salonger för manuell sökning`);
    
    const allSalons = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name,address,phone", "limit": "50" }
    );
      
    if (allSalons && allSalons.length > 0) {
      console.log("[fetchSalonByExactId] Hämtade alla salonger, antal:", allSalons.length);
      
      // Sök efter exakt match
      const matchedSalon = allSalons.find(salon => 
        salon.id == salonId || String(salon.id) === stringId
      );
      
      if (matchedSalon) {
        console.log("[fetchSalonByExactId] Hittade matchande salong genom manuell jämförelse:", matchedSalon);
        return matchedSalon;
      }
      
      console.log("[fetchSalonByExactId] Ingen matchande salong hittades bland alla salonger");
    }
    
    console.log(`[fetchSalonByExactId] Kunde inte hitta salong med ID: ${salonId}`);
    return null;
  } catch (err) {
    console.error("[fetchSalonByExactId] Undantag vid hämtning:", err);
    return null;
  }
};
