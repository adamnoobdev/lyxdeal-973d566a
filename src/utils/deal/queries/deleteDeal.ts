
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteDeal = async (dealId: number): Promise<boolean> => {
  try {
    console.log("[deleteDeal] Called with dealId:", dealId);
    
    if (!dealId) {
      console.error("[deleteDeal] Missing deal ID");
      toast.error("Kunde inte identifiera erbjudandet");
      return false;
    }
    
    // Delete any associated discount codes first
    const { error: codesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', dealId);
    
    if (codesError) {
      console.error("[deleteDeal] Error deleting associated discount codes:", codesError);
      // Continue with deal deletion even if code deletion fails
    } else {
      console.log("[deleteDeal] Successfully deleted associated discount codes");
    }
    
    // Delete the deal
    console.log("[deleteDeal] Deleting deal:", dealId);
    const { error: deleteError } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId);
    
    if (deleteError) {
      console.error("[deleteDeal] Delete error:", deleteError);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
      return false;
    }
    
    console.log("[deleteDeal] Deal deleted successfully");
    toast.success("Erbjudandet har tagits bort");
    return true;
  } catch (error) {
    console.error("[deleteDeal] Unexpected error:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    return false;
  }
};
