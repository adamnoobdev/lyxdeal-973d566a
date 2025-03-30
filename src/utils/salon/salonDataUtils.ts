
import { checkSalonsTable } from "./salonDbQueries";
import { fetchSalonByExactId } from "./salonDbQueries";
import { findSalonWithSimilarId } from "./salonSearchUtils";
import { SalonData, createDefaultSalonData } from "./types";

/**
 * Main function to resolve salon data
 */
export const resolveSalonData = async (
  salonId: number | string | null | undefined, 
  cityName?: string | null
): Promise<SalonData> => {
  // If no salon_id provided, return default salon data
  if (!salonId) {
    console.log("No salon_id provided, using default salon data");
    return createDefaultSalonData(cityName);
  }

  console.log(`Attempting to resolve salon data for salon_id: ${salonId}, type: ${typeof salonId}`);
  
  try {
    // First check if the salons table is accessible
    const tableExists = await checkSalonsTable();
    console.log("Salons table check result:", tableExists);
    
    // Try to fetch salon with exact ID first
    const exactSalon = await fetchSalonByExactId(salonId);
    if (exactSalon) {
      return exactSalon;
    }
    
    // If exact match fails, try to find salon with similar ID
    const similarSalon = await findSalonWithSimilarId(salonId);
    if (similarSalon) {
      return similarSalon;
    }
    
    // If all else fails, return default salon data
    console.log("All salon lookup attempts failed, falling back to default salon data");
    return createDefaultSalonData(cityName);
  } catch (err) {
    console.error("Unexpected error in resolveSalonData:", err);
    return createDefaultSalonData(cityName);
  }
};

// Re-export all the things that might be used elsewhere
export { SalonData, createDefaultSalonData } from "./types";
export { checkSalonsTable, fetchSalonByExactId, fetchFullSalonData } from "./salonDbQueries";
export { findSalonWithSimilarId } from "./salonSearchUtils";
