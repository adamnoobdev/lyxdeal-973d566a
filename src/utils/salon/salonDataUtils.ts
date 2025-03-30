
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
  // Ta bort hårdkodade salongsdata och förlita oss på faktisk data från databasen
  console.log(`Attempting to resolve salon data for salon_id: ${salonId}, type: ${typeof salonId}`);
  
  try {
    // If no salon_id provided, return default salon data
    if (salonId === null || salonId === undefined) {
      console.log("No salon_id provided, using default salon data");
      return createDefaultSalonData(cityName);
    }

    // First check if the salons table is accessible
    const tableExists = await checkSalonsTable();
    console.log("Salons table check result:", tableExists);
    
    if (!tableExists) {
      console.log("Salons table not accessible, using default salon data");
      return createDefaultSalonData(cityName);
    }
    
    // Try to fetch salon with exact ID first
    const exactSalon = await fetchSalonByExactId(salonId);
    
    if (exactSalon) {
      console.log("Found salon with exact ID match:", exactSalon);
      return exactSalon;
    }
    
    console.log(`No exact ID match found for ${salonId}, trying similar ID search`);
    
    // If exact match fails, try to find salon with similar ID
    const similarSalon = await findSalonWithSimilarId(salonId);
    if (similarSalon) {
      console.log("Found salon with similar ID:", similarSalon);
      return similarSalon;
    }
    
    // Om vi inte kunde hitta salongen, skapa en tillfällig salong baserad på staden
    // med standardadress för att öka chansen för geocoding
    console.log(`All salon lookup attempts failed for ID: ${salonId}, falling back to default salon data with city`);
    const defaultSalon = createDefaultSalonData(cityName);
    
    // Utöka adressinformationen om vi endast har ett stadsnamn
    if (cityName && (!defaultSalon.address || defaultSalon.address === cityName)) {
      defaultSalon.address = `${cityName} centrum`;
      console.log(`Enhanced default salon address to ${defaultSalon.address} for better geocoding`);
    }
    
    return defaultSalon;
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
