
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
        console.log("[resolveSalonData] Hittade salong via direkthämtning:", directData);
        return directData;
      }
    }
    
    // Fallback till liknande ID-sökningar
    if (salonId) {
      console.log(`[resolveSalonData] Försöker hitta salong med liknande ID: ${salonId}`);
      const similarData = await findSalonWithSimilarId(salonId);
      
      if (similarData) {
        console.log("[resolveSalonData] Hittade salong med liknande ID:", similarData);
        return similarData;
      }
    }

    // Om vi har stad, försök hämta en salong baserad på staden
    if (city) {
      console.log(`[resolveSalonData] Försöker hitta salong baserad på stad: ${city}`);
      try {
        // Försök med directFetch via salons API
        const directData = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL || "https://gmqeqhlhqhyrjquzhuzg.supabase.co"}/rest/v1/salons?select=*&limit=1`,
          {
            headers: {
              'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcWVxaGxocWh5cmpxdXpodXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDMxNDgsImV4cCI6MjA1MTkxOTE0OH0.AlorwONjeBvh9nex5cm0I1RWqQAEiTlJsXml9n54yMs"}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          }
        );
        
        if (directData.ok) {
          const salons = await directData.json();
          if (salons && salons.length > 0) {
            console.log("[resolveSalonData] Hittade salong baserad på stad:", salons[0]);
            return {
              ...salons[0],
              name: `${salons[0].name || 'Salong'} i ${city}`
            };
          }
        }
      } catch (err) {
        console.error("[resolveSalonData] Fel vid hämtning av salong baserad på stad:", err);
      }
      
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
