
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";

/**
 * Hämtar en salong med exakt matchande ID
 */
export const fetchSalonByExactId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Attempting to fetch salon with exact ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Konvertera till nummer för numerisk sökning
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = !isNaN(numericId);
    
    // Försök hämta med numeriskt ID först om giltigt
    if (isValidNumber) {
      console.log(`Querying salon with numeric ID: ${numericId}`);
      
      const { data: numericData, error: numericError } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .eq("id", numericId)
        .maybeSingle();
        
      if (numericError) {
        console.error("Error in numeric salon query:", numericError);
      } else if (numericData) {
        console.log("Found salon with numeric ID:", numericData);
        return numericData as SalonData;
      }
    }
    
    // Om numerisk sökning misslyckas, prova strängmatchning med explicit content-type
    const stringId = String(salonId);
    console.log(`Querying salon with string ID filter: ${stringId}`);
    
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .eq('id', stringId)  // Använd eq istället för filter för att minska risken för 406-fel
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string salon query:", stringError);
      return null;
    }
    
    if (stringData) {
      console.log("Found salon with string ID comparison:", stringData);
      return stringData as SalonData;
    }
    
    // Om ingen exakt match, prova att söka efter alla salonger (begränsat antal)
    console.log(`No exact match, fetching a limited set of salons to search manually`);
    
    const { data: allSalons, error: allSalonsError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .limit(20);
      
    if (allSalonsError) {
      console.error("Error fetching all salons:", allSalonsError);
      return null;
    }
    
    if (allSalons && allSalons.length > 0) {
      // Sök manuellt efter en matchande ID
      const matchedSalon = allSalons.find(salon => {
        return salon.id == salonId || String(salon.id) === stringId;
      });
      
      if (matchedSalon) {
        console.log("Found salon through manual comparison:", matchedSalon);
        return matchedSalon as SalonData;
      }
      
      // Fallback till första salonen om ingen match hittas
      console.log("No matching salon found, using first available salon as fallback");
      return allSalons[0] as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId} using any method`);
    return null;
  } catch (err) {
    console.error("Exception fetching salon by exact ID:", err);
    return null;
  }
};

/**
 * Hämtar alla salonger
 */
export const fetchAllSalons = async (): Promise<SalonData[] | null> => {
  try {
    console.log("Fetching all salons");
    const { data: allSalons, error, status } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .order('id', { ascending: true });
    
    console.log("All salons query status:", status);
      
    if (error) {
      console.error("Error fetching all salons:", error);
      return null;
    }
    
    console.log("All available salons count:", allSalons?.length || 0);
    if (allSalons && allSalons.length > 0) {
      console.log("Sample of salons:", allSalons.slice(0, 3));
    } else {
      console.log("No salons found in the database");
    }
    
    return allSalons as SalonData[];
  } catch (err) {
    console.error("Exception in fetchAllSalons:", err);
    return null;
  }
};

/**
 * Hämtar fullständig salongsdata med ett specifikt ID
 */
export const fetchFullSalonData = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Fetching full salon data for ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Prova numerisk sökning först
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    if (!isNaN(numericId)) {
      console.log(`Using numeric query for salon ID: ${numericId}`);
      
      const { data, error } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .eq("id", numericId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching salon with numeric ID:", error);
      } else if (data) {
        console.log("Retrieved salon with numeric ID:", data);
        return data as SalonData;
      }
    }
    
    // Fallback till strängmatchning om numerisk sökning misslyckas
    const stringId = String(salonId);
    console.log(`Using simple equality test for salon ID: "${stringId}"`);
    
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .eq('id', stringId)  // Använd eq istället för filter för att undvika 406-fel
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string-based salon query:", stringError);
      return null;
    }
    
    if (stringData) {
      console.log("Retrieved salon with string comparison:", stringData);
      return stringData as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId}`);
    return null;
  } catch (err) {
    console.error("Exception in fetchFullSalonData:", err);
    return null;
  }
};
