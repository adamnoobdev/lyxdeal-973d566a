
import { supabase } from "@/integrations/supabase/client";

export interface SalonData {
  id: number | null;
  name: string;
  address: string | null;
  phone: string | null;
}

/**
 * Creates a default salon data object with fallback values
 */
export const createDefaultSalonData = (cityName?: string | null): SalonData => ({
  id: null,
  name: cityName ? `Salong i ${cityName}` : 'Okänd salong',
  address: cityName || null,
  phone: null
});

/**
 * Fetches a salon by its exact ID
 */
export const fetchSalonByExactId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Attempting to fetch salon with exact ID: ${salonId}`);
  
  // Convert string ID to number if needed
  const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
  
  // Check if conversion was successful
  if (isNaN(numericId)) {
    console.error(`Invalid salon ID format: ${salonId}`);
    return null;
  }
  
  const { data, error } = await supabase
    .from("salons")
    .select("id, name, address, phone")
    .eq("id", numericId)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching salon by exact ID:", error);
    return null;
  }
  
  if (data) {
    console.log("Salon data successfully retrieved with exact ID:", data);
    return data as SalonData;
  }
  
  console.log(`No salon found with ID: ${salonId}. This might indicate a data consistency issue.`);
  return null;
};

/**
 * Fetches all salons and tries to find one with a similar ID
 */
export const findSalonWithSimilarId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log("No salon found with exact ID match, trying alternative approaches");
  
  const { data: allSalons, error } = await supabase
    .from("salons")
    .select("id, name");
    
  if (error) {
    console.error("Error fetching all salons:", error);
    return null;
  }
  
  console.log("All available salons:", allSalons);
  
  if (!allSalons || allSalons.length === 0) {
    console.log("No salons found in the database");
    return null;
  }
  
  // Try to find a salon with a similar ID
  const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
  
  // Check if conversion was successful before using it for comparison
  const validNumericId = !isNaN(numericId);
  
  const similarSalon = allSalons.find(s => 
    (validNumericId && s.id === numericId) || 
    s.id === salonId || 
    String(s.id) === String(salonId)
  );
  
  if (similarSalon) {
    console.log("Found a salon with similar ID:", similarSalon);
    return fetchFullSalonData(similarSalon.id);
  }
  
  // If no similar salon found, return first salon as fallback
  console.log("Using first available salon as fallback");
  return fetchFullSalonData(allSalons[0].id);
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
};

/**
 * Main function to resolve salon data
 */
export const resolveSalonData = async (
  salonId: number | string | null | undefined, 
  cityName?: string | null
): Promise<SalonData> => {
  // If no salon_id provided, return default salon data
  if (!salonId) {
    console.log("No salon_id provided, using default salon data");
    return createDefaultSalonData(cityName);
  }

  console.log(`Attempting to resolve salon data for salon_id: ${salonId}, type: ${typeof salonId}`);
  
  // Try to fetch salon with exact ID first
  const exactSalon = await fetchSalonByExactId(salonId);
  if (exactSalon) {
    return exactSalon;
  }
  
  // If exact match fails, try to find salon with similar ID
  const similarSalon = await findSalonWithSimilarId(salonId);
  if (similarSalon) {
    return similarSalon;
  }
  
  // If all else fails, return default salon data
  return createDefaultSalonData(cityName);
};
