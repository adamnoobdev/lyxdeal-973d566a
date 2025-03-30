
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
      .select("id")
      .limit(1);
      
    if (error) {
      console.error("Error accessing salons table:", error);
      return false;
    }
    
    // Table exists and we can access it (even if it's empty)
    console.log("Salons table exists and is accessible, found records:", data?.length > 0);
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
  
  // Convert string ID to number if needed
  const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
  
  // Check if conversion was successful
  if (isNaN(numericId)) {
    console.error(`Invalid salon ID format: ${salonId}`);
    return null;
  }
  
  try {
    // Log the actual query we're about to execute
    console.log(`Executing Supabase query: .from("salons").select("id, name, address, phone").eq("id", ${numericId})`);
    
    const { data, error, status } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .eq("id", numericId)
      .maybeSingle();
    
    console.log("Query response status:", status);
    
    if (error) {
      console.error("Error fetching salon by exact ID:", error);
      return null;
    }
    
    console.log("Raw salon data response:", data);
    
    if (data) {
      console.log("Salon data successfully retrieved with exact ID:", data);
      return data as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId}. This might indicate a data consistency issue.`);
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
      .select("id, name, address, phone");
    
    console.log("All salons query status:", status);
      
    if (error) {
      console.error("Error fetching all salons:", error);
      return null;
    }
    
    console.log("All available salons count:", allSalons?.length || 0);
    if (allSalons && allSalons.length > 0) {
      console.log("First salon in the list:", allSalons[0]);
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
  // Convert string ID to number if needed
  const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
  
  // Check if conversion was successful
  if (isNaN(numericId)) {
    console.error(`Invalid salon ID format: ${salonId}`);
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .eq("id", numericId)
      .single();
      
    if (error) {
      console.error("Error fetching full salon data:", error);
      return null;
    }
    
    console.log("Retrieved full salon data:", data);
    return data as SalonData;
  } catch (err) {
    console.error("Exception in fetchFullSalonData:", err);
    return null;
  }
};
