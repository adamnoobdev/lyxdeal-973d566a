
import { SalonData, createDefaultSalonData } from "./types";
import { fetchSalonByExactId, fetchAllSalons, fetchFullSalonData } from "./salonDbQueries";

/**
 * Finds a salon with a similar ID in the list of all salons
 */
export const findSalonWithSimilarId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log("No salon found with exact ID match, trying alternative approaches");
  
  try {
    const allSalons = await fetchAllSalons();
    
    if (!allSalons || allSalons.length === 0) {
      console.log("No salons found in the database");
      return null;
    }
    
    // Try to find a salon with a similar ID
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    
    // Check if conversion was successful before using it for comparison
    const validNumericId = !isNaN(numericId);
    
    const similarSalon = allSalons.find(s => 
      (validNumericId && s.id === numericId) || 
      s.id === salonId || 
      String(s.id) === String(salonId)
    );
    
    if (similarSalon) {
      console.log("Found a salon with similar ID:", similarSalon);
      return fetchFullSalonData(similarSalon.id as number);
    }
    
    // If no similar salon found, return first salon as fallback
    console.log("Using first available salon as fallback");
    return fetchFullSalonData(allSalons[0].id as number);
  } catch (err) {
    console.error("Exception in findSalonWithSimilarId:", err);
    return null;
  }
};
