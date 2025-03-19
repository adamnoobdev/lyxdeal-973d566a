
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Delete a deal
export async function deleteDeal(
  deletingDeal: Deal | null,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setDeletingDeal: React.Dispatch<React.SetStateAction<Deal | null>>,
  isDeletingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> {
  if (!deletingDeal || isDeletingDeal.current) {
    return;
  }

  isDeletingDeal.current = true;
  console.log(`[deleteDeal] Deleting deal ${deletingDeal.id}: ${deletingDeal.title}`);

  try {
    // First delete any discount codes associated with the deal
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', deletingDeal.id);
      
    if (discountCodesError) {
      console.error('Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    }
    
    // Then delete the deal
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', deletingDeal.id);

    if (error) throw error;

    // Update local state only if component is still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== deletingDeal.id));
      setDeletingDeal(null);
      toast.success('Erbjudandet togs bort!');
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    
    if (isMountedRef.current) {
      toast.error('Kunde inte ta bort erbjudandet', {
        description: 'Ett fel uppstod när erbjudandet skulle tas bort.'
      });
    }
  } finally {
    isDeletingDeal.current = false;
  }
}

// Update a deal
export async function updateDeal(
  editingDeal: Deal | null,
  values: any,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setEditingDeal: React.Dispatch<React.SetStateAction<Deal | null>>,
  isUpdatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> {
  if (!editingDeal || isUpdatingDeal.current) {
    return;
  }

  isUpdatingDeal.current = true;
  console.log(`[updateDeal] Updating deal ${editingDeal.id}:`, values);

  try {
    // Transform form values to match database structure
    const updatedDealData = {
      title: values.title,
      description: values.description,
      original_price: parseInt(values.originalPrice),
      discounted_price: parseInt(values.discountedPrice) || 1, // Set to 1 for free deals
      image_url: values.imageUrl,
      category: values.category,
      city: values.city,
      featured: values.featured,
      is_free: parseInt(values.discountedPrice) === 0,
      status: 'pending' as const, // Explicitly type as a literal
      expiration_date: values.expirationDate.toISOString(),
      quantity_left: parseInt(values.quantity) || editingDeal.quantity_left,
    };

    // Update the deal in the database - without including the id in the payload
    const { error } = await supabase
      .from('deals')
      .update(updatedDealData)
      .eq('id', editingDeal.id);

    if (error) throw error;

    // Update local state if component is still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === editingDeal.id ? { ...deal, ...updatedDealData } : deal
        )
      );
      setEditingDeal(null);
      toast.success('Erbjudandet har uppdaterats!');
    }
  } catch (error) {
    console.error('Error updating deal:', error);
    
    if (isMountedRef.current) {
      toast.error('Kunde inte uppdatera erbjudandet', {
        description: 'Ett fel uppstod när erbjudandet skulle uppdateras.'
      });
    }
  } finally {
    isUpdatingDeal.current = false;
  }
}

// Toggle active status
export async function toggleActive(
  deal: Deal,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> {
  const newActiveState = !deal.is_active;
  console.log(`[toggleActive] Toggling deal ${deal.id} active state to ${newActiveState}`);

  try {
    const { error } = await supabase
      .from('deals')
      .update({ is_active: newActiveState })
      .eq('id', deal.id);

    if (error) throw error;

    // Update local state if component is still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => 
        prevDeals.map(d => d.id === deal.id ? { ...d, is_active: newActiveState } : d)
      );
      
      toast.success(newActiveState 
        ? 'Erbjudandet är nu aktivt!'
        : 'Erbjudandet är nu inaktivt!');
    }
  } catch (error) {
    console.error('Error toggling deal active state:', error);
    
    if (isMountedRef.current) {
      toast.error('Kunde inte ändra status på erbjudandet', {
        description: 'Ett fel uppstod när aktivitetsstatusen skulle ändras.'
      });
    }
  }
}
