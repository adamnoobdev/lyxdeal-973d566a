
import { fetchSalonByExactId } from "./queries/fetchSalonByExactId";
import { SalonData, createDefaultSalonData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { findSalonWithSimilarId } from "./salonSearchUtils";
import { directFetch } from "./queries/directFetch";

/**
 * Försöker hämta fullständig salongsdata med flera fallback-strategier
 */
export const resolveSalonData = async (
  salonId?: number | string | null,
  city?: string | null
): Promise<SalonData> => {
  try {
    console.log(`[resolveSalonData] Startar sökning efter salong med ID: ${salonId}, stad: ${city || 'N/A'}`);
    
    // Strategi 1: Direkthämtning via publik API
    if (salonId) {
      console.log(`[resolveSalonData] Strategi 1: Direkthämtning med ID: ${salonId}`);
      const directData = await fetchSalonByExactId(salonId);
      
      if (directData) {
        console.log("[resolveSalonData] Hittade salong via direkthämtning:", directData);
        return directData;
      }
    }
    
    // Strategi 2: Sök efter liknande ID - behåller denna strategi men förbättrar debugging
    if (salonId) {
      console.log(`[resolveSalonData] Strategi 2: Söker salong med liknande ID: ${salonId}`);
      try {
        const similarData = await findSalonWithSimilarId(salonId);
        
        if (similarData) {
          console.log("[resolveSalonData] Hittade salong med liknande ID:", similarData);
          return similarData;
        }
      } catch (err) {
        console.error("[resolveSalonData] Fel vid sökning efter liknande ID:", err);
      }
    }

    // Strategi 3: Hämta salong baserad på stad (mycket viktig fallback)
    if (city) {
      console.log(`[resolveSalonData] Strategi 3: Söker salong baserad på stad: ${city}`);
      try {
        // VIKTIGT: Förbättrad direkthämtning för städer - använder ilike för delvis matchning
        const directData = await directFetch<SalonData>(
          `salons`, 
          { "select": "*", "city": `ilike.%${city}%`, "limit": "1" }
        );
        
        if (directData && directData.length > 0) {
          console.log("[resolveSalonData] Hittade salong baserad på stad:", directData[0]);
          return {
            ...directData[0],
            name: directData[0].name || `Salong i ${city}`
          };
        }
        
        // Om ingen salong hittades med stadens namn via ilike, testa att hämta första salongen
        console.log("[resolveSalonData] Ingen salong hittades för staden, hämtar första tillgängliga salong");
        const fallbackData = await directFetch<SalonData>('salons', { "select": "*", "limit": "1" });
        
        if (fallbackData && fallbackData.length > 0) {
          console.log("[resolveSalonData] Hittade en generisk salong:", fallbackData[0]);
          return {
            ...fallbackData[0],
            name: fallbackData[0].name || `Salong i ${city}`
          };
        }
      } catch (err) {
        console.error("[resolveSalonData] Fel vid hämtning baserad på stad:", err);
      }
      
      // Om allt annat misslyckas, skapa en default-salong för staden
      console.log(`[resolveSalonData] Skapar default-salong för stad: ${city}`);
      const defaultSalong = createDefaultSalonData();
      defaultSalong.name = `Salong i ${city}`;
      defaultSalong.city = city;
      return defaultSalong;
    }

    // Strategi 4: Hämta vilken salong som helst från databasen
    console.log("[resolveSalonData] Strategi 4: Hämtar vilken salong som helst");
    const anyData = await directFetch<SalonData>('salons', { "select": "*", "limit": "1" });
    
    if (anyData && anyData.length > 0) {
      console.log("[resolveSalonData] Hittade en generisk salong:", anyData[0]);
      return anyData[0];
    }

    // Strategi 5: Om allt annat misslyckas, returnera en standard-salong
    console.log("[resolveSalonData] Strategi 5: Returnerar default-salong");
    return createDefaultSalonData();
  } catch (error) {
    console.error(`[resolveSalonData] Fel vid hämtning av salong: ${error instanceof Error ? error.message : String(error)}`);
    return createDefaultSalonData();
  }
};
