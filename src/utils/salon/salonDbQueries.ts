
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "./types";

/**
 * Checks if the salons table exists and contains data - using a simple approach
 */
export const checkSalonsTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if salons table exists and contains data");
    
    // Use a simple query that should work even if the table is empty
    const { data, error } = await supabase
      .from("salons")
      .select("id, name")
      .limit(5);
      
    if (error) {
      console.error("Error accessing salons table:", error);
      return false;
    }
    
    // Table exists and we can access it
    console.log("Salons table check result:", {
      accessible: true,
      recordsFound: data?.length || 0,
      sampleData: data
    });
    
    return true;
  } catch (err) {
    console.error("Exception checking salons table:", err);
    return false;
  }
};

/**
 * Fetches a salon by its exact ID
 */
export const fetchSalonByExactId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Attempting to fetch salon with exact ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Handle potential string ID more carefully
    let query = supabase.from("salons").select("id, name, address, phone");
    
    // Determine the right comparison based on ID type
    if (typeof salonId === 'number' || (typeof salonId === 'string' && !isNaN(parseInt(salonId, 10)))) {
      // For numeric ID or string that can be parsed as number
      const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
      console.log(`Using numeric comparison with ID: ${numericId}`);
      query = query.eq("id", numericId);
    } else {
      // For non-numeric string ID
      console.log(`Using string comparison with ID: ${salonId}`);
      query = query.eq("id", salonId);
    }
    
    const { data, error, status } = await query.maybeSingle();
    
    console.log("Query response status:", status);
    
    if (error) {
      console.error("Error fetching salon by exact ID:", error);
      return null;
    }
    
    if (data) {
      console.log("Salon data successfully retrieved with exact ID:", data);
      return data as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId}`);
    return null;
  } catch (err) {
    console.error("Exception fetching salon by exact ID:", err);
    return null;
  }
};

/**
 * Fetches all salons and tries to find one with a similar ID
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
    }
    
    return allSalons as SalonData[];
  } catch (err) {
    console.error("Exception in fetchAllSalons:", err);
    return null;
  }
};

/**
 * Fetches full salon data by ID
 */
export const fetchFullSalonData = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Fetching full salon data for ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Convert to numeric ID if possible
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const useNumericId = !isNaN(numericId);
    
    console.log(`Using ${useNumericId ? 'numeric' : 'original'} ID for full data query: ${useNumericId ? numericId : salonId}`);
    
    const { data, error } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .eq("id", useNumericId ? numericId : salonId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching full salon data:", error);
      return null;
    }
    
    if (data) {
      console.log("Retrieved full salon data:", data);
      return data as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId}`);
    return null;
  } catch (err) {
    console.error("Exception in fetchFullSalonData:", err);
    return null;
  }
};
