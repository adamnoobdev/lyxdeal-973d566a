
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
    
    // Om numerisk sökning misslyckas, prova strängmatchning
    const stringId = String(salonId);
    console.log(`Querying salon with string ID filter: ${stringId}`);
    
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string salon query:", stringError);
      return null;
    }
    
    if (stringData) {
      console.log("Found salon with string ID comparison:", stringData);
      return stringData as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId} using either method`);
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
    console.log(`Using string filter for salon ID: "${stringId}"`);
    
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)
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
