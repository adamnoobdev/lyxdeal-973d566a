
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Listar alla rabattkoder för felsökning
 */
export const listAllDiscountCodes = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .limit(100);
      
    if (error) {
      console.error("[listAllDiscountCodes] Error fetching codes:", error);
      return;
    }
    
    console.log("[listAllDiscountCodes] Found codes:", data?.length || 0);
    console.table(data || []);
  } catch (error) {
    console.error("[listAllDiscountCodes] Exception:", error);
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
    
    const { error } = await query;
    
    if (error) {
      console.error("[removeAllDiscountCodes] Error removing codes:", error);
      return false;
    }
    
    console.log("[removeAllDiscountCodes] Successfully removed codes");
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
    
    return count || 0;
  } catch (error) {
    console.error(`[countDiscountCodes] Exception counting codes for deal ${dealId}:`, error);
    return 0;
  }
};
