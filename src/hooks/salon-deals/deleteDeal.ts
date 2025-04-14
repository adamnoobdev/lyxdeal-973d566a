
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const deleteDeal = async (dealId: number): Promise<boolean> => {
  try {
    // Först tar vi bort alla rabattkoder kopplade till erbjudandet
    console.log(`[deleteDeal] Removing discount codes for deal ID: ${dealId}`);
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', dealId);
      
    if (discountCodesError) {
      console.error('[deleteDeal] Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    }
    
    // Ta bort erbjudandet efter en kort fördröjning för att undvika race conditions
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`[deleteDeal] Deleting deal with ID: ${dealId}`);
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId);

    if (error) {
      console.error("[deleteDeal] Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
      return false;
    }
    
    console.log("[deleteDeal] Deal successfully deleted");
    toast.success("Erbjudande borttaget!");
    return true;
  } catch (error) {
    console.error("[deleteDeal] Error deleting deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
    return false;
  }
};
