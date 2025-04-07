
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";
import { RefObject } from "react";

// Delete a deal
export const deleteDeal = async (
  deletingDeal: Deal | null,
  setDeals: (deals: Deal[]) => void,
  setDeletingDeal: (deal: Deal | null) => void,
  isDeletingDeal: RefObject<boolean>,
  isMountedRef: RefObject<boolean>
): Promise<boolean> => {
  if (!deletingDeal || isDeletingDeal.current) return false;

  try {
    isDeletingDeal.current = true;
    console.log("[dealOperations] Deleting deal: ", deletingDeal.id);

    // Call the API to delete the deal
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', deletingDeal.id);

    if (error) {
      console.error("[dealOperations] Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
      return false;
    }

    console.log("[dealOperations] Deal deleted successfully");
    toast.success("Erbjudandet har tagits bort");

    // Update local state if component still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== deletingDeal.id));
      setDeletingDeal(null);
    }
    return true;
  } catch (error) {
    console.error("[dealOperations] Error in delete operation:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    return false;
  } finally {
    if (isMountedRef.current) {
      isDeletingDeal.current = false;
    }
  }
};

// Update a deal
export const updateDeal = async (
  editingDeal: Deal | null,
  values: FormValues,
  setDeals: (deals: Deal[]) => void,
  setEditingDeal: (deal: Deal | null) => void,
  isUpdatingDeal: RefObject<boolean>,
  isMountedRef: RefObject<boolean>
): Promise<boolean> => {
  if (!editingDeal || isUpdatingDeal.current) return false;

  try {
    isUpdatingDeal.current = true;
    console.log("[dealOperations] Updating deal: ", editingDeal.id, values);

    // Prepare the data for update
    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;

    // Call the API to update the deal
    const { error } = await supabase
      .from('deals')
      .update({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: isFree ? 1 : discountedPrice, // Set to 1 for free deals to avoid DB constraints
        category: values.category,
        city: values.city,
        expiration_date: values.expirationDate.toISOString(),
        featured: values.featured,
        is_free: isFree,
        is_active: values.is_active !== undefined ? values.is_active : true,
      })
      .eq('id', editingDeal.id);

    if (error) {
      console.error("[dealOperations] Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    }

    console.log("[dealOperations] Deal updated successfully");
    toast.success("Erbjudandet har uppdaterats");

    // Update local state if component still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.map(deal => 
        deal.id === editingDeal.id 
          ? { 
              ...deal, 
              title: values.title,
              description: values.description,
              image_url: values.imageUrl,
              original_price: originalPrice,
              discounted_price: isFree ? 1 : discountedPrice,
              category: values.category,
              city: values.city,
              expiration_date: values.expirationDate.toISOString(),
              featured: values.featured,
              is_free: isFree,
              is_active: values.is_active !== undefined ? values.is_active : true,
            }
          : deal
      ));
      setEditingDeal(null);
    }
    return true;
  } catch (error) {
    console.error("[dealOperations] Error in update operation:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    return false;
  } finally {
    if (isMountedRef.current) {
      isUpdatingDeal.current = false;
    }
  }
};

// Toggle deal active state
export const toggleActive = async (
  deal: Deal,
  setDeals: (deals: Deal[]) => void,
  isMountedRef: RefObject<boolean>
): Promise<boolean> => {
  try {
    console.log(`[dealOperations] Toggling deal active state: ${deal.id} to ${!deal.is_active}`);
    
    // Call the API to toggle the active state
    const { error } = await supabase
      .from('deals')
      .update({ is_active: !deal.is_active })
      .eq('id', deal.id);

    if (error) {
      console.error("[dealOperations] Error toggling deal active state:", error);
      toast.error(`Kunde inte ${deal.is_active ? 'inaktivera' : 'aktivera'} erbjudandet`);
      return false;
    }

    // Success message
    toast.success(deal.is_active ? 
      "Erbjudandet har inaktiverats" : 
      "Erbjudandet har aktiverats");

    // Update local state if component still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.map(d => 
        d.id === deal.id ? { ...d, is_active: !d.is_active } : d
      ));
    }
    return true;
  } catch (error) {
    console.error("[dealOperations] Error in toggle active operation:", error);
    toast.error(`Kunde inte ${deal.is_active ? 'inaktivera' : 'aktivera'} erbjudandet`);
    return false;
  }
};
