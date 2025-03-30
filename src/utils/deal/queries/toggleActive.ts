
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { toast } from "sonner";

/**
 * Växlar aktiv/inaktiv status för ett erbjudande
 */
export const toggleDealActive = async (deal: Deal): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deals')
      .update({ is_active: !deal.is_active })
      .eq('id', deal.id);

    if (error) throw error;
    
    toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktiverat' : 'inaktiverat'}`);
    return true;
  } catch (error) {
    console.error('Error toggling deal active status:', error);
    toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
    return false;
  }
};
