
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Tar bort ett erbjudande från databasen
 */
export const deleteDeal = async (id: number): Promise<boolean> => {
  try {
    // Först tar vi bort alla rabattkoder kopplade till erbjudandet
    console.log(`Removing discount codes for deal ID: ${id}`);
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', id);
      
    if (discountCodesError) {
      console.error('Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    } else {
      console.log(`Successfully removed discount codes for deal ID: ${id}`);
    }

    // Sedan tar vi bort själva erbjudandet
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
    
    toast.success("Erbjudandet har tagits bort");
    return true;
  } catch (error) {
    console.error('Error deleting deal:', error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    return false;
  }
};
