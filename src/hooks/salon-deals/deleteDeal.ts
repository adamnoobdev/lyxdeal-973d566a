
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const deleteDeal = async (dealId: number): Promise<boolean> => {
  try {
    // Först tar vi bort alla rabattkoder kopplade till erbjudandet
    console.log(`Removing discount codes for deal ID: ${dealId}`);
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', dealId);
      
    if (discountCodesError) {
      console.error('Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    }
    
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId);

    if (error) throw error;
    
    toast.success("Erbjudande borttaget!");
    return true;
  } catch (error) {
    console.error("Error deleting deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
    return false;
  }
};
