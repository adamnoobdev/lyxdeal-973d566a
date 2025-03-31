
import { fetchSalonByExactId } from "./queries/fetchSalonByExactId";
import { SalonData, createDefaultSalonData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { findSalonWithSimilarId } from "./salonSearchUtils";

/**
 * Försöker hämta fullständig salongsdata med flera fallback-strategier
 */
export const resolveSalonData = async (
  salonId?: number | string | null,
  city?: string | null
): Promise<SalonData> => {
  try {
    console.log(`[resolveSalonData] Försöker hitta salong med ID: ${salonId}, city: ${city || 'N/A'}`);
    
    // Direkthämtning via REST API utan autentisering
    if (salonId) {
      console.log(`[resolveSalonData] Försöker direkthämta salong med ID: ${salonId}`);
      const directData = await fetchSalonByExactId(salonId);
      
      if (directData) {
        console.log("[resolveSalonData] Hittade salong via direkthämtning");
        return directData;
      }
    }
    
    // Fallback till liknande ID-sökningar
    if (salonId) {
      console.log(`[resolveSalonData] Försöker hitta salong med liknande ID: ${salonId}`);
      const similarData = await findSalonWithSimilarId(salonId);
      
      if (similarData) {
        console.log("[resolveSalonData] Hittade salong med liknande ID");
        return similarData;
      }
    }

    // Sista utväg: Skapa en standard salon med staden
    if (city) {
      console.log(`[resolveSalonData] Skapar default salong för stad: ${city}`);
      return {
        ...createDefaultSalonData(),
        name: `Salong i ${city}`,
      };
    }

    // Om allt annat misslyckas, returnera en standard salon
    console.log("[resolveSalonData] Returnerar default salong");
    return createDefaultSalonData();
  } catch (error) {
    console.error(`[resolveSalonData] Fel vid hämtning av salong: ${error instanceof Error ? error.message : String(error)}`);
    return createDefaultSalonData();
  }
};
