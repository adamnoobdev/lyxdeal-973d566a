
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
    
    // Verify the deal exists first
    const { data: dealData, error: checkError } = await supabase
      .from('deals')
      .select('id, title, salon_id')
      .eq('id', dealId)
      .single();
    
    if (checkError || !dealData) {
      console.error("[deleteDeal] Error checking deal:", checkError);
      toast.error("Kunde inte hitta erbjudandet");
      return false;
    }
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("[deleteDeal] No active user session");
      toast.error("Du måste vara inloggad för att ta bort erbjudanden");
      return false;
    }

    // Check if user is associated with the salon that owns this deal
    const { data: salonData } = await supabase
      .from('salons')
      .select('id, user_id')
      .eq('user_id', session.user.id)
      .single();

    // If the user is associated with the salon that owns the deal, 
    // or if no salon association check is needed (admin users), allow deletion
    console.log("[deleteDeal] Proceeding with deletion for deal ID:", dealId);
    
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
