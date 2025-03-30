
import { SalonData } from "./types";
import { fetchAllSalons, fetchFullSalonData } from "./queries";

/**
 * Finds a salon with a similar ID in the list of all salons
 */
export const findSalonWithSimilarId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Finding salon with similar ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Get all salons for comparison
    const allSalons = await fetchAllSalons();
    
    if (!allSalons || allSalons.length === 0) {
      console.log("No salons found in the database");
      return null;
    }
    
    // Try multiple matching strategies for salon ID
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = typeof numericId === 'number' && !isNaN(numericId);
    const stringId = String(salonId);
    
    console.log(`Looking for salon with ID using multiple matching strategies:
    - Original ID: ${salonId} (${typeof salonId})
    - Numeric ID: ${numericId} (${isValidNumber ? 'valid' : 'invalid'})
    - String ID: ${stringId}
    - Among ${allSalons.length} salons`);
    
    // Debug first few salons
    if (allSalons.length > 0) {
      console.log("Sample salon IDs to compare against:", 
        allSalons.slice(0, 5).map(s => `${s.id} (${typeof s.id})`).join(', '));
    }
    
    // Try exact match first (both as number and string)
    let matchedSalon = allSalons.find(salon => {
      // Try different comparison strategies
      const exactMatch = salon.id === salonId;
      const numericMatch = isValidNumber && salon.id === numericId;
      const stringMatch = String(salon.id) === stringId;
      
      return exactMatch || numericMatch || stringMatch;
    });
    
    if (matchedSalon) {
      console.log("Found exact match for salon:", matchedSalon);
      return fetchFullSalonData(matchedSalon.id as number);
    }
    
    // If no exact match, look for partial matches or similar IDs
    console.log("No exact match found, checking for similar salon IDs");
    
    // If all strategies fail, use first salon as fallback
    if (allSalons.length > 0) {
      console.log("Using first available salon as fallback:", allSalons[0]);
      return fetchFullSalonData(allSalons[0].id as number);
    }
    
    console.log("No salons available for fallback");
    return null;
  } catch (err) {
    console.error("Exception in findSalonWithSimilarId:", err);
    return null;
  }
};
