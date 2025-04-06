
import { supabase } from "@/integrations/supabase/client";
import { fetchAllSalons } from "@/utils/salon/queries";

/**
 * Fetches all salons data from the database
 */
export const fetchSalonsData = async () => {
  try {
    console.log("Hämtar salonger via fetchSalonsData()");
    
    // Försök först med fetchAllSalons från queries
    try {
      const salonsData = await fetchAllSalons();
      if (salonsData && salonsData.length > 0) {
        console.log("Hämtade salonger via fetchAllSalons, antal:", salonsData.length);
        // Log the first salon's rating for debugging
        if (salonsData[0]) {
          console.log("First salon rating from fetchAllSalons:", salonsData[0].rating);
        }
        return salonsData;
      }
    } catch (e) {
      console.warn("Kunde inte hämta via fetchAllSalons, försöker med direkt Supabase anrop", e);
    }
    
    // Force a direct query with asterisk to ensure we get all fields including rating
    console.log("Gör direkt Supabase anrop med explicit kolumnförfrågan");
    const { data, error } = await supabase
      .from("salons")
      .select("id, name, email, phone, address, created_at, user_id, role, terms_accepted, privacy_accepted, rating, rating_comment")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching salons via direct query:", error);
      throw error;
    }
    
    console.log("Hämtade salonger via direkt Supabase anrop, antal:", data?.length || 0);
    // Log the first salon's rating for debugging
    if (data && data.length > 0) {
      console.log("First salon raw rating from direct query:", data[0].rating);
    }
    return data;
  } catch (error) {
    console.error("Error i fetchSalonsData:", error);
    throw error;
  }
};
