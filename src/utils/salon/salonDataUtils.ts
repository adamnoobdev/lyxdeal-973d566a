
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
        // Om vi har stadsinformation men saknar den i hämtad data, lägg till den
        if (city && !directData.city) {
          directData.city = city;
        }
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
          // Om vi har stadsinformation men saknar den i hämtad data, lägg till den
          if (city && !similarData.city) {
            similarData.city = city;
          }
          return similarData;
        }
      } catch (err) {
        console.error("[resolveSalonData] Fel vid sökning efter liknande ID:", err);
      }
    }

    // Strategi 3: Hämta en salong utan stad-filtrering (eftersom city-kolumnen inte finns)
    console.log(`[resolveSalonData] Strategi 3: Hämtar en salong (utan stad-filtrering)`);
    try {
      // OBS! Vi skickar inte med city-parametern här eftersom den inte finns i databasen
      const fallbackData = await directFetch<SalonData>('salons', { "limit": "1" });
      
      if (fallbackData && fallbackData.length > 0) {
        console.log("[resolveSalonData] Hittade en generisk salong:", fallbackData[0]);
        // Säkerställ att city-värdet finns på objektet som lokal data
        const result = {
          ...fallbackData[0],
          name: fallbackData[0].name || `Salong i ${city || 'okänd stad'}`,
          city: city // Explicit tilldela city-värdet lokalt (finns inte i databasen)
        };
        return result;
      }
    } catch (err) {
      console.error("[resolveSalonData] Fel vid hämtning av generisk salong:", err);
    }
    
    // Strategi 4: Om vi har city-information, skapa en default-salong för staden
    if (city) {
      console.log(`[resolveSalonData] Strategi 4: Skapar default-salong för stad: ${city}`);
      const defaultSalong = createDefaultSalonData(city);
      defaultSalong.city = city; // Säkerställ att city-värdet finns
      return defaultSalong;
    }

    // Strategi 5: Om allt annat misslyckas, returnera en standard-salong
    console.log("[resolveSalonData] Strategi 5: Returnerar default-salong");
    return createDefaultSalonData();
  } catch (error) {
    console.error(`[resolveSalonData] Fel vid hämtning av salong: ${error instanceof Error ? error.message : String(error)}`);
    return createDefaultSalonData();
  }
};
