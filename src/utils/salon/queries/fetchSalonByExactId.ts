
import { supabase } from "@/integrations/supabase/client";
import { SalonData, createDefaultSalonData } from "../types";
import { directFetch } from "./api/directFetch";

/**
 * Hämtar en specifik salong med exakt ID
 */
export const fetchSalonByExactId = async (salonId?: number | string | null): Promise<SalonData | null> => {
  if (!salonId) {
    console.log("[fetchSalonByExactId] Inget salong ID tillhandahålls");
    return null;
  }
  
  try {
    console.log(`[fetchSalonByExactId] Försöker hämta salong med ID: ${salonId}`);
    
    // Prioritera direkthämtning utan autentisering
    console.log(`[fetchSalonByExactId] Försöker direkthämta salong med ID: ${salonId}`);
    
    // Ensure salonId is properly formatted for the query
    const formattedId = typeof salonId === 'string' ? salonId : salonId.toString();
    
    // Send a query to the REST API endpoint which should bypass RLS
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${formattedId}`, "select": "id,name,address,phone", "limit": "1" }
    );
    
    if (directData && directData.length > 0) {
      console.log(`[fetchSalonByExactId] Hämtade salong via direkthämtning:`, directData[0]);
      return directData[0] as SalonData;
    } else {
      console.log(`[fetchSalonByExactId] Kunde inte hitta salong med ID ${salonId} via direkthämtning`);
    }
    
    // Fallback till Supabase klient om direkthämtning misslyckas
    console.log(`[fetchSalonByExactId] Försöker hämta salong med ID: ${salonId} via Supabase klient`);
    
    // Convert salonId to number for Supabase query if it's a string
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    
    // Check if conversion resulted in a valid number
    if (isNaN(Number(numericId))) {
      console.error(`[fetchSalonByExactId] Ogiltigt salong ID format: ${salonId}`);
      return null;
    }
    
    const { data, error } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .eq("id", numericId)
      .single();
    
    if (error) {
      console.error(`[fetchSalonByExactId] Fel vid hämtning av salong: ${error.message}`);
      return null;
    }
    
    if (!data) {
      console.log(`[fetchSalonByExactId] Ingen salong hittades med ID: ${salonId}`);
      return null;
    }
    
    console.log(`[fetchSalonByExactId] Hämtade salong via Supabase klient:`, data);
    return data as SalonData;
  } catch (err) {
    console.error(`[fetchSalonByExactId] Undantag vid hämtning av salong: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
};
