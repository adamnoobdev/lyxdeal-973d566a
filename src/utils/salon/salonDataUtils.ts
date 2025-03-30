
import { checkSalonsTable } from "./queries/checkSalon";
import { fetchSalonByExactId } from "./queries/fetchSalonByExactId";
import { findSalonWithSimilarId } from "./salonSearchUtils";
import { SalonData, createDefaultSalonData } from "./types";

/**
 * Main function to resolve salon data
 */
export const resolveSalonData = async (
  salonId: number | string | null | undefined, 
  cityName?: string | null
): Promise<SalonData> => {
  console.log(`[resolveSalonData] Försöker hämta salongsdata för salon_id: ${salonId}, typ: ${typeof salonId}`);
  
  try {
    // Om inget salon_id angetts, returnera standarddata
    if (salonId === null || salonId === undefined) {
      console.log("[resolveSalonData] Inget salon_id tillhandahållet, använder standarddata");
      return createDefaultSalonData(cityName);
    }

    // Kontrollera först att tabellen verkligen finns och innehåller data
    const tableExists = await checkSalonsTable();
    console.log("[resolveSalonData] Salongstabellkontroll resultat:", tableExists);
    
    if (!tableExists) {
      console.log("[resolveSalonData] Salongstabellen är inte tillgänglig, använder standarddata");
      return createDefaultSalonData(cityName);
    }
    
    // Prova hämta salong med exakt ID först - denna använder nu prioriterade direkta API-anrop
    console.log("[resolveSalonData] Försöker hämta salong med exakt ID-matchning");
    const exactSalon = await fetchSalonByExactId(salonId);
    
    if (exactSalon) {
      console.log("[resolveSalonData] Hittade salong med exakt ID-matchning:", exactSalon);
      return exactSalon;
    }
    
    console.log(`[resolveSalonData] Ingen exakt match hittades för ${salonId}, provar liknande ID-sökning`);
    
    // Om exakt match misslyckas, försök hitta salong med liknande ID
    const similarSalon = await findSalonWithSimilarId(salonId);
    if (similarSalon) {
      console.log("[resolveSalonData] Hittade salong med liknande ID:", similarSalon);
      return similarSalon;
    }
    
    // Om vi inte kunde hitta salongen, skapa en tillfällig salong baserad på staden
    console.log(`[resolveSalonData] Alla salongsöksförsök misslyckades för ID: ${salonId}, fallback till standarddata`);
    const defaultSalon = createDefaultSalonData(cityName);
    
    // Utöka adressinformationen om vi endast har ett stadsnamn
    if (cityName && (!defaultSalon.address || defaultSalon.address === cityName)) {
      defaultSalon.address = `${cityName} centrum`;
      console.log(`[resolveSalonData] Förbättrad standardsalongsadress till ${defaultSalon.address} för bättre geokodning`);
    }
    
    return defaultSalon;
  } catch (err) {
    console.error("[resolveSalonData] Oväntat fel:", err);
    return createDefaultSalonData(cityName);
  }
};

// Re-export types för att underlätta användning
export type { SalonData } from "./types";
export { createDefaultSalonData } from "./types";
