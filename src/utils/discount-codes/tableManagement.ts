
import { supabase } from "@/integrations/supabase/client";

/**
 * Hämtar information om tabellstrukturen för rabattkoder
 */
export async function getTableInfo() {
  try {
    // Försök hämta tabellinfo
    const { data, error } = await supabase
      .from('discount_codes')
      .select('id')
      .limit(1);
      
    // Om det gick att hämta data, logga information om tabellen
    if (!error && data !== null) {
      // Using get_tables instead of get_table_def since it's not available
      const metadataPromise = supabase
        .rpc('get_tables')
        .then(result => {
          return result;
        })
        .catch(e => {
          console.error("[getTableInfo] Error getting table metadata:", e);
          return { data: null };
        });
        
      const metadata = await metadataPromise;
      
      // Sammanställ information om tabellen
      return {
        table: 'discount_codes',
        exists: true,
        hasData: data.length > 0,
        metadata: metadata?.data || null
      };
    }
    
    // Om det inte gick, kolla om tabellen finns
    return {
      table: 'discount_codes',
      exists: error?.code !== 'PGRST116',  // PostgreSQL-fel för icke-existerande tabell
      error: error,
      hasData: false
    };
  } catch (error) {
    console.error("[getTableInfo] Error:", error);
    return {
      table: 'discount_codes',
      exists: null, // Kunde inte avgöra
      error: error,
      hasData: null
    };
  }
}
