
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
    
    // 2. Fallback till Supabase-klient (även för icke-inloggade)
    console.log(`[fetchSalonByExactId] Försöker hämta salong via Supabase-klient (anonym/publik åtkomst)`);
    
    // Konvertera till numeriskt ID för Supabase om det behövs
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
    
    // Viktigt: Använd publik åtkomst till salons-tabellen
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .eq("id", numericId)
      .maybeSingle(); 
    
    if (error) {
      console.error(`[fetchSalonByExactId] Supabase-fel: ${error.message}`);
      
      // Prova en sista gång med direkthämtning utan filter på ID för att se om tabellen är tillgänglig
      const testData = await directFetch<SalonData>(`salons`, { "limit": "1" });
      if (testData) {
        console.log("[fetchSalonByExactId] Direkthämtning utan filter fungerar, tabellen är tillgänglig.");
      } else {
        console.error("[fetchSalonByExactId] Direkthämtning utan filter misslyckades också, tabellen kan ha åtkomstproblem.");
      }
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
