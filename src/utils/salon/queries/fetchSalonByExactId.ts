
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
    console.log(`[fetchSalonByExactId] Försöker hämta salong med ID: ${salonId}, typ: ${typeof salonId}`);
    
    // Prioritera direkthämtning utan autentisering
    console.log(`[fetchSalonByExactId] Försöker direkthämta salong med ID: ${salonId}`);
    
    // Säkerställ att salonId är korrekt formaterat för API-anropet
    const formattedId = typeof salonId === 'string' || typeof salonId === 'number' 
      ? String(salonId) 
      : null;
    
    if (!formattedId) {
      console.error(`[fetchSalonByExactId] Ogiltigt salong ID format: ${salonId}`);
      return null;
    }
    
    // Skicka en förfrågan till REST API-endpunkten som borde kringgå RLS
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${formattedId}`, "select": "*", "limit": "1" }
    );
    
    if (directData && directData.length > 0) {
      console.log(`[fetchSalonByExactId] Hämtade salong via direkthämtning:`, directData[0]);
      return directData[0] as SalonData;
    } else {
      console.log(`[fetchSalonByExactId] Kunde inte hitta salong med ID ${salonId} via direkthämtning`);
    }
    
    // Fallback till Supabase klient om direkthämtning misslyckas
    console.log(`[fetchSalonByExactId] Försöker hämta salong med ID: ${salonId} via Supabase klient`);
    
    // Konvertera salonId till nummer för Supabase-fråga om det är en sträng
    let numericId: number;
    
    if (typeof salonId === 'string') {
      numericId = parseInt(salonId, 10);
      if (isNaN(numericId)) {
        console.error(`[fetchSalonByExactId] Ogiltigt salong ID format för Supabase-anrop: ${salonId}`);
        return null;
      }
    } else {
      numericId = salonId as number;
    }
    
    console.log(`[fetchSalonByExactId] Använder numericId: ${numericId}, typ: ${typeof numericId}`);
    
    const { data, error } = await supabase
      .from("salons")
      .select("*")
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
