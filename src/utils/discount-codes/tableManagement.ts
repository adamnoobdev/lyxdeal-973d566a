
import { supabase } from "@/integrations/supabase/client";

/**
 * Kontrollerar att rabattkoder-tabellen är korrekt strukturerad
 */
export const ensureDiscountCodesTable = async (): Promise<boolean> => {
  try {
    console.log("[ensureDiscountCodesTable] Checking discount_codes table");
    
    // Kontrollera att tabellen finns och har rätt struktur
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(1);
      
    if (error) {
      console.error("[ensureDiscountCodesTable] Error checking table:", error);
      // Här skulle vi kunna lägga till kod för att skapa tabellen om den inte finns
      // Men det kräver sannolikt admin-rättigheter
      return false;
    }
    
    console.log("[ensureDiscountCodesTable] Table exists and is accessible");
    
    // Försök hämta information om index direkt från information_schema istället för en procedur
    const { data: indexData, error: indexError } = await supabase
      .from('pg_indexes')
      .select('indexname, tablename')
      .eq('tablename', 'discount_codes')
      .limit(10);
    
    if (indexError) {
      console.log("[ensureDiscountCodesTable] Could not check indices:", indexError);
    } else {
      console.log("[ensureDiscountCodesTable] Table indices:", indexData);
    }
    
    return true;
  } catch (error) {
    console.error("[ensureDiscountCodesTable] Exception checking table:", error);
    return false;
  }
};

/**
 * Kör diagnostik på rabattkoder-tabellen
 */
export const runDiscountCodesDiagnostics = async (): Promise<void> => {
  try {
    console.log("[runDiscountCodesDiagnostics] Running diagnostics on discount_codes table");
    
    // Kontrollera antalet koder
    const { count, error: countError } = await supabase
      .from("discount_codes")
      .select("*", { count: "exact", head: true });
      
    if (countError) {
      console.error("[runDiscountCodesDiagnostics] Error counting codes:", countError);
    } else {
      console.log(`[runDiscountCodesDiagnostics] Total code count: ${count || 0}`);
    }
    
    // Kontrollera om det finns några felkonfigurerade koder
    const { data: nullDealData, error: nullDealError } = await supabase
      .from("discount_codes")
      .select("*")
      .is("deal_id", null)
      .limit(10);
      
    if (nullDealError) {
      console.error("[runDiscountCodesDiagnostics] Error checking for null deal_id:", nullDealError);
    } else if (nullDealData && nullDealData.length > 0) {
      console.warn("[runDiscountCodesDiagnostics] Found codes with null deal_id:", nullDealData);
    } else {
      console.log("[runDiscountCodesDiagnostics] No codes with null deal_id");
    }
    
    // Kontrollera typen på deal_id för alla koder
    const { data: sampleData, error: sampleError } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(1);
      
    if (sampleError) {
      console.error("[runDiscountCodesDiagnostics] Error fetching sample code:", sampleError);
    } else if (sampleData && sampleData.length > 0) {
      console.log("[runDiscountCodesDiagnostics] Sample code:", sampleData[0]);
      console.log(`[runDiscountCodesDiagnostics] deal_id type: ${typeof sampleData[0].deal_id}`);
    }
    
    // Hämta information om tabeller från den befintliga funktionen get_tables
    const { data: tablesInfo, error: tablesError } = await supabase.rpc(
      'get_tables'
    );
    
    if (tablesError) {
      console.log("[runDiscountCodesDiagnostics] Could not get table info:", tablesError);
    } else {
      console.log("[runDiscountCodesDiagnostics] Table structure:", tablesInfo);
    }
  } catch (error) {
    console.error("[runDiscountCodesDiagnostics] Exception during diagnostics:", error);
  }
};

/**
 * Hämtar information om tabeller i databasen
 */
export const getTableInfo = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_tables'
    );
    
    if (error) {
      console.error(`[getTableInfo] Error fetching table info:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`[getTableInfo] Exception fetching table info:`, error);
    return [];
  }
};

