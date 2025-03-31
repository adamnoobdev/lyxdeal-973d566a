
import { supabase } from "@/integrations/supabase/client";
import { SalonData, createDefaultSalonData } from "../types";
import { directFetch } from "./directFetch";

/**
 * Hämtar en specifik salong med exakt ID
 * Med förbättrad felhantering för 404-fel
 */
export const fetchSalonByExactId = async (salonId?: number | string | null): Promise<SalonData | null> => {
  if (!salonId) {
    console.log("[fetchSalonByExactId] Inget salong ID tillhandahålls");
    return null;
  }
  
  try {
    console.log(`[fetchSalonByExactId] Försöker hämta salong med ID: ${salonId}, typ: ${typeof salonId}`);
    
    // Diagnostik för användarens session
    const { data: sessionData } = await supabase.auth.getSession();
    const isAuthenticated = !!sessionData?.session?.user;
    console.log(`[fetchSalonByExactId] Användare är ${isAuthenticated ? 'autentiserad' : 'INTE autentiserad'}`);
    
    // 1. Försök direkthämtning utan autentisering först (offentlig data)
    const formattedId = String(salonId); // Konvertera ID till sträng för API-parametrar
    
    console.log(`[fetchSalonByExactId] Direkthämtar salong med ID: ${formattedId}`);
    try {
      const directData = await directFetch<SalonData>(
        `salons`,
        { "id": `eq.${formattedId}`, "select": "*" }
      );
      
      if (directData && directData.length > 0) {
        console.log(`[fetchSalonByExactId] Framgångsrik direkthämtning av salong:`, directData[0]);
        return directData[0];
      } else {
        console.log(`[fetchSalonByExactId] Direkthämtning hittade ingen salong med ID ${formattedId}. Provar Supabase klient istället.`);
      }
    } catch (directFetchError) {
      console.error(`[fetchSalonByExactId] Fel vid direkthämtning:`, directFetchError);
      // Fortsätt till nästa metod, logga men avbryt inte flödet
    }
    
    // 2. Testa salongs tabell existens och permissions
    console.log(`[fetchSalonByExactId] Kontrollerar salong-tabellens existens och behörigheter`);
    try {
      const { count, error } = await supabase
        .from("salons")
        .select("*", { count: "exact", head: true });
      
      if (error) {
        console.error(`[fetchSalonByExactId] VIKTIGT: Kunde inte komma åt salongs-tabellen:`, error.message);
        console.error(`[fetchSalonByExactId] Detta indikerar troligen ett PERMISSIONS- eller RLS-problem!`);
        console.error(`[fetchSalonByExactId] ⚠️ Se till att det finns en RLS policy i Supabase för publik åtkomst till salons-tabellen`);
      } else {
        console.log(`[fetchSalonByExactId] Salong-tabellen är åtkomlig med ${count || 0} rader`);
      }
    } catch (tableCheckError) {
      console.error(`[fetchSalonByExactId] Fel vid kontroll av salong-tabell:`, tableCheckError);
    }
    
    // 3. Fallback till Supabase-klient (även för icke-inloggade)
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
    
    try {
      // Viktigt: Använd publik åtkomst till salons-tabellen
      const { data, error } = await supabase
        .from("salons")
        .select("*")
        .eq("id", numericId)
        .maybeSingle(); 
      
      if (error) {
        // Identifiera specifikt 404-fel
        if (error.code === '404' || error.message.includes('404')) {
          console.error(`[fetchSalonByExactId] 404 Not Found: Salongen med ID ${numericId} finns inte`);
        } else {
          console.error(`[fetchSalonByExactId] Supabase-fel: ${error.message}`);
          console.error(`[fetchSalonByExactId] Kod: ${error.code}, Detaljer: ${error.details}`);
        }
        
        // Test för att se om det är ett RLS-fel
        if (error.code === "PGRST116" || error.message.includes("permission denied")) {
          console.error(`[fetchSalonByExactId] KRITISKT: Detta verkar vara ett Row Level Security (RLS) fel!`);
          console.error(`[fetchSalonByExactId] Användaren saknar behörighet att läsa från salons-tabellen.`);
          console.error(`[fetchSalonByExactId] Lägg till följande RLS policy i Supabase:
          
            CREATE POLICY "Allow public read access" ON salons
            FOR SELECT
            TO anon
            USING (true);
          `);
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
    } catch (supabaseError) {
      console.error(`[fetchSalonByExactId] Fel vid Supabase-hämtning:`, supabaseError);
      // Fortsätt till fallback
    }
    
    // 4. Om alla metoder misslyckas, returnera null
    console.log(`[fetchSalonByExactId] Alla hämtningsmetoder misslyckades för ID: ${salonId}`);
    return null;
  } catch (err) {
    console.error(`[fetchSalonByExactId] Undantag: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
};
