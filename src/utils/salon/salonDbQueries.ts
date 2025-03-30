
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
    // Convert to number for numeric query
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = !isNaN(numericId);
    
    // Try to fetch using numeric ID first if valid
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
    
    // If numeric query fails or ID isn't numeric, try string comparison
    // This is a fallback to handle cases where IDs might be stored as strings
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
    // Try numeric query first
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
    
    // Fallback to string comparison if numeric fails
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

/**
 * Uppdaterar alla salonger för att godkänna villkoren och integritetspolicyn
 */
export const updateAllSalonsTermsAcceptance = async (): Promise<boolean> => {
  try {
    console.log("Updating all salons to accept terms and privacy policy");
    
    const { error } = await supabase
      .from("salons")
      .update({ 
        terms_accepted: true,
        privacy_accepted: true 
      })
      .is('terms_accepted', null);
      
    if (error) {
      console.error("Error updating salons terms acceptance:", error);
      return false;
    }
    
    // Uppdatera även de som har false värden
    const { error: error2 } = await supabase
      .from("salons")
      .update({ 
        terms_accepted: true,
        privacy_accepted: true 
      })
      .eq('terms_accepted', false);
      
    if (error2) {
      console.error("Error updating salons with false terms acceptance:", error2);
      return false;
    }
    
    // Uppdatera även de som har null för privacy_accepted
    const { error: error3 } = await supabase
      .from("salons")
      .update({ 
        privacy_accepted: true 
      })
      .is('privacy_accepted', null);
      
    if (error3) {
      console.error("Error updating salons privacy acceptance:", error3);
      return false;
    }
    
    // Uppdatera även de som har false för privacy_accepted
    const { error: error4 } = await supabase
      .from("salons")
      .update({ 
        privacy_accepted: true 
      })
      .eq('privacy_accepted', false);
      
    if (error4) {
      console.error("Error updating salons with false privacy acceptance:", error4);
      return false;
    }
    
    console.log("Successfully updated all salons to accept terms and privacy policy");
    return true;
  } catch (err) {
    console.error("Exception in updateAllSalonsTermsAcceptance:", err);
    return false;
  }
};
