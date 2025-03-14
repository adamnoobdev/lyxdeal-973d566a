
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { DealUpdateValues } from "./dealTypes";
import { 
  deleteSalonDeal, 
  updateSalonDeal, 
  toggleDealActiveStatus 
} from "@/utils/dealApiUtils";
import { supabase } from "@/integrations/supabase/client";

export const deleteDeal = async (
  deletingDeal: Deal | null, 
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setDeletingDeal: (deal: Deal | null) => void,
  isDeletingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> => {
  if (!deletingDeal || !isMountedRef.current || isDeletingDeal.current) {
    console.log("Skipping delete: no deal, unmounted, or already deleting");
    return;
  }

  try {
    isDeletingDeal.current = true;
    console.log(`Deleting deal with ID: ${deletingDeal.id}`);
    
    // Först tar vi bort alla rabattkoder kopplade till erbjudandet
    console.log(`Removing discount codes for deal ID: ${deletingDeal.id}`);
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', deletingDeal.id);
      
    if (discountCodesError) {
      console.error("Error deleting discount codes:", discountCodesError);
      // Continue with deal deletion even if code deletion fails
    } else {
      console.log(`Successfully removed discount codes for deal ID: ${deletingDeal.id}`);
    }
    
    // Sedan tar vi bort själva erbjudandet
    await deleteSalonDeal(deletingDeal.id);
    toast.success("Erbjudandet har tagits bort");
    
    if (isMountedRef.current) {
      // Uppdatera state lokalt för att undvika ytterligare API-anrop
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== deletingDeal.id));
      setDeletingDeal(null);
    }
  } catch (err: any) {
    console.error("Error deleting deal:", err);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
  } finally {
    isDeletingDeal.current = false;
  }
};

export const updateDeal = async (
  editingDeal: Deal | null,
  values: any,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setEditingDeal: (deal: Deal | null) => void,
  isUpdatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> => {
  if (!editingDeal || !isMountedRef.current || isUpdatingDeal.current) {
    console.log("Skipping update: no deal, unmounted, or already updating");
    return;
  }

  try {
    isUpdatingDeal.current = true;
    console.log(`Updating deal with ID: ${editingDeal.id}`);
    
    // Check if discounted price is 0 and explicitly set is_free flag
    const discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    
    const updateValues: DealUpdateValues = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      originalPrice: parseInt(values.originalPrice) || 0,
      discountedPrice: discountedPrice,
      category: values.category,
      city: values.city,
      featured: values.featured,
      is_free: isFree, // Explicitly set based on discounted price
      is_active: values.is_active !== undefined ? values.is_active : editingDeal.is_active,
      quantity: parseInt(values.quantity) || 10,
      expirationDate: values.expirationDate,
      salon_id: editingDeal.salon_id
    };
    
    console.log("Updating deal with values:", updateValues);
    await updateSalonDeal(editingDeal.id, updateValues);
    
    if (isMountedRef.current) {
      toast.success("Erbjudandet har uppdaterats");
      
      // Uppdatera det redigerade erbjudandet lokalt
      const updatedDeal = { 
        ...editingDeal, 
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: parseInt(values.originalPrice) || 0,
        discounted_price: isFree ? 0 : discountedPrice, // Store 0 for free deals in local state
        category: values.category,
        city: values.city,
        featured: values.featured,
        is_free: isFree,
        is_active: values.is_active !== undefined ? values.is_active : editingDeal.is_active,
        quantity_left: parseInt(values.quantity) || 10,
        expiration_date: values.expirationDate.toISOString()
      };
      
      setDeals(prevDeals => prevDeals.map(deal => 
        deal.id === editingDeal.id ? updatedDeal : deal
      ));
      setEditingDeal(null);
    }
  } catch (err: any) {
    console.error("Error updating deal:", err);
    if (isMountedRef.current) {
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    }
  } finally {
    isUpdatingDeal.current = false;
  }
};

export const toggleActive = async (
  deal: Deal,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> => {
  if (!isMountedRef.current) return;
  
  try {
    console.log(`Toggling active state for deal ID: ${deal.id}, current: ${deal.is_active}`);
    await toggleDealActiveStatus(deal.id, !deal.is_active);
    
    if (isMountedRef.current) {
      toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktivt' : 'inaktivt'}`);
      
      // Uppdatera erbjudandet lokalt
      setDeals(prevDeals => prevDeals.map(d => 
        d.id === deal.id ? { ...d, is_active: !d.is_active } : d
      ));
    }
  } catch (err: any) {
    console.error("Error toggling deal active status:", err);
    if (isMountedRef.current) {
      toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
    }
  }
};
