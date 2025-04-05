
/**
 * Utilities for handling salon data
 */
import { fetchSalonByExactId } from "./queries/fetchSalonByExactId";

/**
 * Formats a date string into a more readable format
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Creates a default salon data object
 * @param name Optional salon name
 * @param id Optional salon ID
 * @returns A default salon data object
 */
export const createDefaultSalonData = (
  name: string = 'Okänd salong', 
  id: number | null = null,
  city: string | null = null
) => {
  return {
    id,
    name,
    address: city || null,
    phone: null,
    // Andra standardfält kan läggas till här vid behov
  };
};

/**
 * Resolves salon data from various sources
 * With improved fallback strategies for 404 errors and missing data
 */
export const resolveSalonData = async (
  salonId: number | null,
  city?: string | null
) => {
  console.log(`[resolveSalonData] Försöker hämta salongsdata för ID: ${salonId}, Stad: ${city}`);

  if (!salonId) {
    console.log(`[resolveSalonData] Inget salon ID, returnerar fallback-data med stad: ${city || 'okänd'}`);
    return createDefaultSalonData(
      city ? `Salong i ${city}` : 'Okänd salong',
      null,
      city || null
    );
  }

  try {
    // Försök hämta salongsdata
    const salonData = await fetchSalonByExactId(salonId);
    
    if (salonData) {
      console.log(`[resolveSalonData] Framgångsrikt hämtad salongsdata:`, salonData);
      
      // Kontrollera om vi fått ett tomt namn och använd city som fallback
      if (!salonData.name || salonData.name.trim() === '') {
        console.log(`[resolveSalonData] Reparerar tomt salongsnamn med stad: ${city || 'okänd'}`);
        salonData.name = city ? `Salong i ${city}` : 'Okänd salong';
      }
      
      return salonData;
    }
    
    // Om vi inte kunde hitta salongsdata, använd fallback
    console.log(`[resolveSalonData] Ingen salongsdata hittad för ID: ${salonId}, använder fallback`);
    return createDefaultSalonData(
      city ? `Salong i ${city}` : `Salong #${salonId}`,
      salonId,
      city || null
    );
  } catch (error) {
    console.error(`[resolveSalonData] Fel vid hämtning av salongsdata:`, error);
    
    // Skapa ett standardobjekt med tillgänglig info
    return createDefaultSalonData(
      city ? `Salong i ${city}` : `Salong #${salonId}`,
      salonId,
      city || null
    );
  }
};
