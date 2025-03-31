
import { supabase } from "@/integrations/supabase/client";
import { SalonData, createDefaultSalonData } from "../types";
import { directFetch } from "./directFetch";

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
    
    // 1. Försök direkthämtning utan autentisering först (offentlig data)
    const formattedId = String(salonId); // Konvertera ID till sträng för API-parametrar
    
    console.log(`[fetchSalonByExactId] Direkthämtar salong med ID: ${formattedId}`);
    const directData = await directFetch<SalonData>(
      `salons`,
      { "id": `eq.${formattedId}`, "select": "*" }
    );
    
    if (directData && directData.length > 0) {
      console.log(`[fetchSalonByExactId] Framgångsrik direkthämtning av salong:`, directData[0]);
      return directData[0];
    } else {
      console.log(`[fetchSalonByExactId] Direkthämtning hittade ingen salong med ID ${formattedId}`);
    }
    
    // 2. Fallback till Supabase-klient (kräver autentisering)
    console.log(`[fetchSalonByExactId] Försöker hämta salong via Supabase-klient`);
    
    // Konvertera till numeriskt ID för Supabase
    let numericId: number;
    if (typeof salonId === 'string') {
      numericId = parseInt(salonId, 10);
      if (isNaN(numericId)) {
        console.error(`[fetchSalonByExactId] Ogiltigt numeriskt ID format: ${salonId}`);
        return null;
      }
    } else {
      numericId = salonId as number;
    }
    
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .eq("id", numericId)
      .maybeSingle(); // Använd maybeSingle istället för single för att undvika fel
    
    if (error) {
      console.error(`[fetchSalonByExactId] Supabase-fel: ${error.message}`);
      return null;
    }
    
    if (data) {
      console.log(`[fetchSalonByExactId] Hämtade salong via Supabase:`, data);
      return data as SalonData;
    } else {
      console.log(`[fetchSalonByExactId] Hittade ingen salong med ID: ${salonId} via Supabase`);
      return null;
    }
  } catch (err) {
    console.error(`[fetchSalonByExactId] Undantag: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
};
