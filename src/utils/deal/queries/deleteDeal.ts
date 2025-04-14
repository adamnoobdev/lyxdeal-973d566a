
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteDeal = async (dealId: number): Promise<boolean> => {
  if (!dealId) {
    console.error("[deleteDeal] Missing deal ID");
    return false;
  }
  
  console.log("[deleteDeal] Called with dealId:", dealId);
  
  try {
    // First delete any associated discount codes
    const { error: codesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', dealId);
    
    if (codesError) {
      console.error("[deleteDeal] Error deleting discount codes:", codesError);
      // Continue with deal deletion even if code deletion fails
    } else {
      console.log("[deleteDeal] Successfully deleted associated discount codes");
    }
    
    // Add a small delay to ensure the discount code deletion completes fully
    await new Promise(resolve => setTimeout(resolve, 100));
    
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
    return true;
  } catch (error) {
    console.error("[deleteDeal] Unexpected error:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    return false;
  }
};
