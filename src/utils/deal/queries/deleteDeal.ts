
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteDeal = async (dealId: number): Promise<boolean> => {
  if (!dealId) {
    console.error("[deleteDeal] Missing deal ID");
    return false;
  }
  
  console.log("[deleteDeal] Called with dealId:", dealId);
  
  try {
    // Delete any associated discount codes first
    await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', dealId)
      .then(({ error }) => {
        if (error) {
          console.error("[deleteDeal] Error deleting discount codes:", error);
        } else {
          console.log("[deleteDeal] Successfully deleted associated discount codes");
        }
      });
    
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
