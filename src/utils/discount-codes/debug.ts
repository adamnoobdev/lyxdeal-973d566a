import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Listar alla rabattkoder för felsökning
 */
export const listAllDiscountCodes = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(100);
      
    if (error) {
      console.error("[listAllDiscountCodes] Error fetching codes:", error);
      return [];
    }
    
    console.log("[listAllDiscountCodes] Found codes:", data?.length || 0);
    console.table(data || []);
    
    // Kontrollera datatypen för deal_id
    if (data && data.length > 0) {
      console.log("[listAllDiscountCodes] Sample deal_id types:", 
        data.slice(0, 5).map(code => `${code.deal_id} (${typeof code.deal_id})`).join(', '));
    }
    
    return data || [];
  } catch (error) {
    console.error("[listAllDiscountCodes] Exception:", error);
    return [];
  }
};

/**
 * Tar bort alla rabattkoder för ett specifikt erbjudande
 */
export const removeAllDiscountCodes = async (dealId?: number | string): Promise<boolean> => {
  try {
    let query = supabase.from("discount_codes").delete();
    
    if (dealId) {
      const normalizedId = normalizeId(dealId);
      query = query.eq("deal_id", normalizedId);
      console.log(`[removeAllDiscountCodes] Removing all codes for deal ${normalizedId}`);
    } else {
      console.log("[removeAllDiscountCodes] Removing ALL discount codes from database");
    }
    
    const { error, count } = await query;
    
    if (error) {
      console.error("[removeAllDiscountCodes] Error removing codes:", error);
      return false;
    }
    
    console.log(`[removeAllDiscountCodes] Successfully removed ${count || 'unknown number of'} codes`);
    return true;
  } catch (error) {
    console.error("[removeAllDiscountCodes] Exception:", error);
    return false;
  }
};

/**
 * Visar antal rabattkoder för ett erbjudande
 */
export const countDiscountCodes = async (dealId: number | string): Promise<number> => {
  try {
    const normalizedId = normalizeId(dealId);
    const { data, error, count } = await supabase
      .from("discount_codes")
      .select("*", { count: "exact" })
      .eq("deal_id", normalizedId);
      
    if (error) {
      console.error(`[countDiscountCodes] Error counting codes for deal ${normalizedId}:`, error);
      return 0;
    }
    
    const resultCount = count || 0;
    console.log(`[countDiscountCodes] Found ${resultCount} codes for deal ${normalizedId}`);
    return resultCount;
  } catch (error) {
    console.error(`[countDiscountCodes] Exception counting codes for deal ${dealId}:`, error);
    return 0;
  }
};

/**
 * Testar att skapa en rabattkod och sedan ta bort den - för att felsöka problem med databasen
 */
export const testDiscountCodeGeneration = async (dealId: number | string): Promise<boolean> => {
  try {
    const normalizedId = normalizeId(dealId);
    console.log(`[testDiscountCodeGeneration] Testing code generation for deal ${normalizedId}`);
    
    // Skapa en testkod
    const testCode = {
      deal_id: normalizedId,
      code: `TEST-${Date.now()}`,
      is_used: false
    };
    
    // Försök att spara koden i databasen
    const { data, error } = await supabase
      .from('discount_codes')
      .insert([testCode])
      .select();
      
    if (error) {
      console.error('[testDiscountCodeGeneration] Error inserting test code:', error);
      console.error('[testDiscountCodeGeneration] Error details:', error.message, error.details, error.hint);
      return false;
    }
    
    const inserted = data && data.length > 0;
    console.log(`[testDiscountCodeGeneration] Test code insertion ${inserted ? 'successful' : 'failed'}: `, data);
    
    // Om det lyckades, ta bort testkoden
    if (inserted) {
      const { error: deleteError } = await supabase
        .from('discount_codes')
        .delete()
        .eq('code', testCode.code);
        
      if (deleteError) {
        console.error('[testDiscountCodeGeneration] Error deleting test code:', deleteError);
      } else {
        console.log('[testDiscountCodeGeneration] Test code deleted successfully');
      }
    }
    
    return inserted;
  } catch (error) {
    console.error('[testDiscountCodeGeneration] Exception during test:', error);
    return false;
  }
};
