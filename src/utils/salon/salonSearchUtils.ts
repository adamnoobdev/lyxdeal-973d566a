
import { SalonData } from "./types";
import { fetchAllSalons } from "./queries/fetchAllSalons";
import { directFetch } from "./queries/api/directFetch";

/**
 * Finds a salon with a similar ID in the list of all salons
 */
export const findSalonWithSimilarId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`[findSalonWithSimilarId] Söker salong med liknande ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Prioritera direkthämtning via API utan autentisering
    console.log("[findSalonWithSimilarId] Försöker direkthämta alla salonger");
    
    const directData = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name,address,phone", "limit": "50" }
    );
    
    let allSalons: SalonData[] = [];
    
    if (directData && directData.length > 0) {
      allSalons = directData as SalonData[];
      console.log("[findSalonWithSimilarId] Hämtade salonger via direkthämtning, antal:", allSalons.length);
    } else {
      // Fallback till Supabase klient
      console.log("[findSalonWithSimilarId] Direkthämtning misslyckades, försöker via fetchAllSalons");
      allSalons = await fetchAllSalons() || [];
    }
    
    if (!allSalons || allSalons.length === 0) {
      console.log("[findSalonWithSimilarId] Inga salonger hittades");
      return null;
    }
    
    // Prova flera matchningsstrategier för salongs-ID
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = typeof numericId === 'number' && !isNaN(numericId);
    const stringId = String(salonId);
    
    console.log(`[findSalonWithSimilarId] Söker med flera strategier:
    - Original ID: ${salonId} (${typeof salonId})
    - Numeriskt ID: ${numericId} (${isValidNumber ? 'giltigt' : 'ogiltigt'})
    - Sträng ID: ${stringId}
    - Bland ${allSalons.length} salonger`);
    
    // Debug första salonger
    if (allSalons.length > 0) {
      console.log("[findSalonWithSimilarId] Exempelsalonger:",
        allSalons.slice(0, 3).map(s => `ID: ${s.id} (${typeof s.id}), Namn: ${s.name}`));
    }
    
    // Prova exakt match först
    let matchedSalon = allSalons.find(salon => {
      // Prova olika jämförelsestrategier
      return salon.id === salonId || 
             (isValidNumber && salon.id === numericId) || 
             String(salon.id) === stringId;
    });
    
    if (matchedSalon) {
      console.log("[findSalonWithSimilarId] Hittade exakt matchande salong:", matchedSalon);
      return matchedSalon;
    }
    
    // Om ingen exakt match, ta första salongen som fallback
    if (allSalons.length > 0) {
      console.log("[findSalonWithSimilarId] Ingen match, använder första salong som fallback:", allSalons[0]);
      return allSalons[0];
    }
    
    console.log("[findSalonWithSimilarId] Inga salonger att använda som fallback");
    return null;
  } catch (err) {
    console.error("[findSalonWithSimilarId] Undantag vid sökning:", err);
    return null;
  }
};
