
import { fetchSalonByExactId } from "./queries/fetchSalonByExactId";
import { SalonData, createDefaultSalonData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { findSalonWithSimilarId } from "./salonSearchUtils";
import { directFetch } from "./queries/directFetch";

/**
 * Attempts to fetch full salon data with multiple fallback strategies
 */
export const resolveSalonData = async (
  salonId?: number | string | null,
  city?: string | null
): Promise<SalonData> => {
  try {
    console.log(`[resolveSalonData] Starting search for salon with ID: ${salonId}, city: ${city || 'N/A'}`);
    
    // Strategy 1: Direct fetch via public API
    if (salonId) {
      console.log(`[resolveSalonData] Strategy 1: Direct fetch with ID: ${salonId}`);
      const directData = await fetchSalonByExactId(salonId);
      
      if (directData) {
        console.log("[resolveSalonData] Found salon via direct fetch:", directData);
        // If we have city information but it's missing in fetched data, add it
        if (city && !directData.city) {
          directData.city = city;
        }
        return directData;
      }
    }
    
    // Strategy 2: Search for similar ID - keeping this strategy but improving debugging
    if (salonId) {
      console.log(`[resolveSalonData] Strategy 2: Searching for salon with similar ID: ${salonId}`);
      try {
        const similarData = await findSalonWithSimilarId(salonId);
        
        if (similarData) {
          console.log("[resolveSalonData] Found salon with similar ID:", similarData);
          // If we have city information but it's missing in fetched data, add it
          if (city && !similarData.city) {
            similarData.city = city;
          }
          return similarData;
        }
      } catch (err) {
        console.error("[resolveSalonData] Error searching for similar ID:", err);
      }
    }

    // Strategy 3: Fetch a salon without city filtering (since city column doesn't exist)
    console.log(`[resolveSalonData] Strategy 3: Fetching a salon (without city filtering)`);
    try {
      // NOTE! We don't send the city parameter here as it doesn't exist in the database
      const fallbackData = await directFetch<SalonData>('salons', { "limit": "1" });
      
      if (fallbackData && fallbackData.length > 0) {
        console.log("[resolveSalonData] Found a generic salon:", fallbackData[0]);
        // Ensure city value exists on object as local data
        const result = {
          ...fallbackData[0],
          name: fallbackData[0].name || `Salong i ${city || 'okänd stad'}`,
          city: city // Explicitly assign city value locally (doesn't exist in database)
        };
        return result;
      }
    } catch (err) {
      console.error("[resolveSalonData] Error fetching generic salon:", err);
    }
    
    // Strategy 4: If we have city information, create a default salon for the city
    if (city) {
      console.log(`[resolveSalonData] Strategy 4: Creating default salon for city: ${city}`);
      const defaultSalon = createDefaultSalonData(city);
      defaultSalon.city = city; // Ensure city value exists
      return defaultSalon;
    }

    // Strategy 5: If all else fails, return a standard salon
    console.log("[resolveSalonData] Strategy 5: Returning default salon");
    return createDefaultSalonData();
  } catch (error) {
    console.error(`[resolveSalonData] Error fetching salon: ${error instanceof Error ? error.message : String(error)}`);
    // Säkerställ att vi alltid returnerar något, även vid fel
    return city ? createDefaultSalonData(city) : createDefaultSalonData();
  }
};
