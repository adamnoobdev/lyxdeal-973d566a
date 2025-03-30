
import { SalonData } from "./types";
import { fetchAllSalons, fetchFullSalonData } from "./queries";
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/supabaseConfig";

/**
 * Finds a salon with a similar ID in the list of all salons
 */
export const findSalonWithSimilarId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Finding salon with similar ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Först prova att hämta alla salonger via Supabase klienten
    let allSalons = await fetchAllSalons();
    
    // Om inga salonger hittades med Supabase klienten, prova direkt fetch
    if (!allSalons || allSalons.length === 0) {
      console.log("No salons found via Supabase client, trying direct fetch");
      
      const { data: directData, error: directError } = await fetch(
        `${SUPABASE_URL}/rest/v1/salons?select=id,name,address,phone&limit=50`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).then(res => res.json().then(data => ({ data, error: null })))
        .catch(error => ({ data: null, error }));
      
      if (directError) {
        console.error("Error fetching all salons with direct API:", directError);
        return null;
      }
      
      if (directData && Array.isArray(directData)) {
        allSalons = directData as SalonData[];
        console.log("Retrieved salons via direct API:", allSalons.length);
      }
    }
    
    if (!allSalons || allSalons.length === 0) {
      console.log("No salons found in the database using any method");
      return null;
    }
    
    // Prova flera matchningsstrategier för salongs-ID
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = typeof numericId === 'number' && !isNaN(numericId);
    const stringId = String(salonId);
    
    console.log(`Looking for salon with ID using multiple matching strategies:
    - Original ID: ${salonId} (${typeof salonId})
    - Numeric ID: ${numericId} (${isValidNumber ? 'valid' : 'invalid'})
    - String ID: ${stringId}
    - Among ${allSalons.length} salons`);
    
    // Debug första salonger
    if (allSalons.length > 0) {
      console.log("Sample salon IDs to compare against:", 
        allSalons.slice(0, 5).map(s => `${s.id} (${typeof s.id})`).join(', '));
    }
    
    // Prova exakt match först (både som nummer och sträng)
    let matchedSalon = allSalons.find(salon => {
      // Prova olika jämförelsestrategier
      const exactMatch = salon.id === salonId;
      const numericMatch = isValidNumber && salon.id === numericId;
      const stringMatch = String(salon.id) === stringId;
      
      return exactMatch || numericMatch || stringMatch;
    });
    
    if (matchedSalon) {
      console.log("Found exact match for salon:", matchedSalon);
      return matchedSalon;
    }
    
    // Om ingen exakt match, använd första salonen som fallback
    if (allSalons.length > 0) {
      console.log("Using first available salon as fallback:", allSalons[0]);
      return allSalons[0];
    }
    
    console.log("No salons available for fallback");
    return null;
  } catch (err) {
    console.error("Exception in findSalonWithSimilarId:", err);
    return null;
  }
};
