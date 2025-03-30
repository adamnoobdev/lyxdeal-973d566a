
import { checkSalonsTable, fetchSalonByExactId, fetchFullSalonData } from "./queries";
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

    // Kontrollera först att tabellen verkligen finns och innehåller data
    const tableExists = await checkSalonsTable();
    console.log("Salons table check result:", tableExists);
    
    if (!tableExists) {
      console.log("Salons table not accessible or empty, using default salon data");
      return createDefaultSalonData(cityName);
    }
    
    // Prova hämta salong med exakt ID först - denna använder nu flera metoder
    const exactSalon = await fetchSalonByExactId(salonId);
    
    if (exactSalon) {
      console.log("Found salon with exact ID match:", exactSalon);
      return exactSalon;
    }
    
    console.log(`No exact ID match found for ${salonId}, trying similar ID search`);
    
    // Om exakt match misslyckas, försök hitta salong med liknande ID
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

// Re-export types för att underlätta användning
export type { SalonData } from "./types";
export { createDefaultSalonData } from "./types";
