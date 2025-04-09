
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

    // Get the current user's salon info to check their role
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('id, role')
      .eq('user_id', session.user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors
    
    // Admin check - always allow admins to delete deals
    const isAdmin = salonData?.role === 'admin';
    
    // If not an admin, check if the user owns the salon that owns the deal
    if (!isAdmin) {
      // If salon data fetch failed or the salon ID doesn't match the deal's salon ID
      if (salonError) {
        console.error("[deleteDeal] Error fetching salon data:", salonError);
        toast.error("Kunde inte verifiera dina behörigheter");
        return false;
      }
      
      if (!salonData || salonData.id !== dealData.salon_id) {
        console.error("[deleteDeal] User is not the salon owner");
        toast.error("Du har inte behörighet att ta bort detta erbjudande");
        return false;
      }
    }
    
    // Delete any associated discount codes first
    const { error: codesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', dealId);
    
    if (codesError) {
      console.error("[deleteDeal] Error deleting associated discount codes:", codesError);
      // Continue with deal deletion even if code deletion fails
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
