
import { SalonData } from "./types";
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
    console.log(`Looking for salon with ID similar to: ${numericId} (${typeof numericId}) among ${allSalons.length} salons`);
    
    // Check if conversion was successful before using it for comparison
    const validNumericId = !isNaN(numericId);
    
    // Debug log some salons to check what we're working with
    if (allSalons.length > 0) {
      console.log("Sample salon IDs to compare against:", allSalons.slice(0, 3).map(s => `${s.id} (${typeof s.id})`));
    }
    
    const similarSalon = allSalons.find(s => {
      // Log comparison to debug match logic
      const isMatch = (validNumericId && s.id === numericId) || 
                     String(s.id) === String(salonId);
      
      if (isMatch) {
        console.log(`Found matching salon: ${JSON.stringify(s)}`);
      }
      return isMatch;
    });
    
    if (similarSalon) {
      console.log("Found a salon with similar ID:", similarSalon);
      return fetchFullSalonData(similarSalon.id as number);
    }
    
    // If no similar salon found, return first salon as fallback
    console.log("No salon with similar ID found. Using first available salon as fallback");
    return fetchFullSalonData(allSalons[0].id as number);
  } catch (err) {
    console.error("Exception in findSalonWithSimilarId:", err);
    return null;
  }
};
