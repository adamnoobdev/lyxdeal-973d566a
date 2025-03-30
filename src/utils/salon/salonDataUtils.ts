
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

  // Enhanced logging for debugging
  console.log(`Attempting to resolve salon data for salon_id: ${salonId}, type: ${typeof salonId}`);
  
  try {
    // First check if the salons table is accessible
    const tableExists = await checkSalonsTable();
    console.log("Salons table check result:", tableExists);
    
    // Convert salonId to proper type for database queries
    const numericSalonId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    
    // Add detailed logging for ID being used
    console.log(`Using ${typeof numericSalonId === 'number' && !isNaN(numericSalonId) ? 'numeric' : 'original'} ID: ${typeof numericSalonId === 'number' && !isNaN(numericSalonId) ? numericSalonId : salonId}`);
    
    // Try to fetch salon with exact ID first - use numeric ID if valid, otherwise original
    const exactSalon = await fetchSalonByExactId(
      typeof numericSalonId === 'number' && !isNaN(numericSalonId) ? numericSalonId : salonId
    );
    
    if (exactSalon) {
      console.log("Found salon with exact ID match:", exactSalon);
      return exactSalon;
    }
    
    console.log("No exact ID match found, trying similar ID search");
    // If exact match fails, try to find salon with similar ID
    const similarSalon = await findSalonWithSimilarId(salonId);
    if (similarSalon) {
      console.log("Found salon with similar ID:", similarSalon);
      return similarSalon;
    }
    
    // If all else fails, return default salon data
    console.log(`All salon lookup attempts failed for ID: ${salonId}, falling back to default salon data`);
    return createDefaultSalonData(cityName);
  } catch (err) {
    console.error("Unexpected error in resolveSalonData:", err);
    return createDefaultSalonData(cityName);
  }
};

// Re-export all the things that might be used elsewhere
export type { SalonData } from "./types";
export { createDefaultSalonData } from "./types";
export { checkSalonsTable, fetchSalonByExactId, fetchFullSalonData } from "./salonDbQueries";
export { findSalonWithSimilarId } from "./salonSearchUtils";
