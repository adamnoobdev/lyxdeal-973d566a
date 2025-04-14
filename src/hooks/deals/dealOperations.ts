
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";
import { deleteDeal as deleteFromDb } from "@/utils/deal/queries/deleteDeal";
import { updateDeal as updateFromDb } from "@/utils/deal/queries/updateDeal";
import { toggleDealActive } from "@/utils/deal/queries/toggleActive";

export const deleteDeal = async (
  deal: Deal | null,
  setDeals: Dispatch<SetStateAction<Deal[]>>,
  setDeletingDeal: Dispatch<SetStateAction<Deal | null>>,
  isDeletingDeal: MutableRefObject<boolean>,
  isMountedRef: MutableRefObject<boolean>
): Promise<boolean> => {
  if (!deal) {
    console.error("[deleteDeal] No deal provided");
    return false;
  }

  if (isDeletingDeal.current) {
    console.log("[deleteDeal] Already deleting deal, skipping");
    return false;
  }

  try {
    isDeletingDeal.current = true;
    console.log(`[deleteDeal] Deleting deal: ${deal.id}`);

    const success = await deleteFromDb(deal.id);
    
    if (!success) {
      console.error("[deleteDeal] Failed to delete deal");
      if (isMountedRef.current) {
        toast.error("Kunde inte ta bort erbjudandet");
      }
      return false;
    }

    if (isMountedRef.current) {
      setDeals(prev => prev.filter(d => d.id !== deal.id));
      setDeletingDeal(null);
      toast.success("Erbjudandet har tagits bort");
    }
    
    return true;
  } catch (error) {
    console.error("[deleteDeal] Error:", error);
    if (isMountedRef.current) {
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    }
    return false;
  } finally {
    isDeletingDeal.current = false;
  }
};

export const updateDeal = async (
  deal: Deal | null,
  values: FormValues,
  setDeals: Dispatch<SetStateAction<Deal[]>>,
  setEditingDeal: Dispatch<SetStateAction<Deal | null>>,
  isUpdatingDeal: MutableRefObject<boolean>,
  isMountedRef: MutableRefObject<boolean>
): Promise<boolean> => {
  if (!deal || !isMountedRef.current || isUpdatingDeal.current) {
    console.log("Skipping update: no deal, unmounted, or already updating");
    return false;
  }

  try {
    isUpdatingDeal.current = true;
    console.log(`Updating deal with ID: ${deal.id}`);
    
    const discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    
    if (values.requires_discount_code) {
      const { data: salonData } = await supabase
        .from('salons')
        .select('subscription_plan')
        .eq('id', deal.salon_id)
        .single();
      
      if (salonData?.subscription_plan === 'Baspaket') {
        toast.error("Baspaketet stödjer inte rabattkoder. Uppgradera till premium för denna funktion.");
        values.requires_discount_code = false;
        return false;
      }
    }
    
    const updateValues = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      originalPrice: parseInt(values.originalPrice) || 0,
      discountedPrice: discountedPrice,
      category: values.category,
      city: values.city,
      featured: values.featured,
      is_free: isFree,
      is_active: values.is_active !== undefined ? values.is_active : deal.is_active,
      quantity: parseInt(values.quantity) || 10,
      expirationDate: values.expirationDate,
      booking_url: values.booking_url || null,
      requires_discount_code: values.requires_discount_code,
      salon_id: deal.salon_id
    };
    
    console.log("Updating deal with values:", updateValues);
    await updateFromDb(values, deal.id);
    
    if (isMountedRef.current) {
      toast.success("Erbjudandet har uppdaterats");
      
      const updatedDeal = { 
        ...deal, 
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: parseInt(values.originalPrice) || 0,
        discounted_price: isFree ? 0 : discountedPrice,
        category: values.category,
        city: values.city,
        featured: values.featured,
        is_free: isFree,
        is_active: values.is_active !== undefined ? values.is_active : deal.is_active,
        quantity_left: parseInt(values.quantity) || 10,
        expiration_date: values.expirationDate.toISOString(),
        booking_url: values.booking_url || null,
        requires_discount_code: values.requires_discount_code
      };
      
      setDeals(prevDeals => prevDeals.map(d => 
        d.id === deal.id ? updatedDeal : d
      ));
      setEditingDeal(null);
    }
    return true;
  } catch (err: any) {
    console.error("Error updating deal:", err);
    if (isMountedRef.current) {
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    }
    return false;
  } finally {
    isUpdatingDeal.current = false;
  }
};

export const toggleActive = async (
  deal: Deal,
  setDeals: Dispatch<SetStateAction<Deal[]>>,
  isMountedRef: MutableRefObject<boolean>
): Promise<void> => {
  if (!isMountedRef.current) return;
  
  try {
    console.log(`Toggling active state for deal ID: ${deal.id}, current: ${deal.is_active}`);
    await toggleDealActive(deal);
    
    if (isMountedRef.current) {
      toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktivt' : 'inaktivt'}`);
      
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
