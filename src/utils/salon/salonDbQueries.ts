
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
    // Convert to string for consistent handling
    const idAsString = String(salonId);
    
    console.log(`Fetching salon with ID string: "${idAsString}"`);
    
    const { data, error, status } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .or(`id.eq.${idAsString},id::text.eq.${idAsString}`)
      .maybeSingle();
    
    console.log("Salon query response:", {
      status,
      hasError: !!error, 
      dataReceived: !!data,
      data
    });
    
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
 * Fetches full salon data by ID
 */
export const fetchFullSalonData = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Fetching full salon data for ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Convert to string for consistent handling
    const idAsString = String(salonId);
    
    console.log(`Using string-based query for full salon data with ID: ${idAsString}`);
    
    const { data, error } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .or(`id.eq.${idAsString},id::text.eq.${idAsString}`)
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
