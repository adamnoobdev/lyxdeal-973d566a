
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a deal and related discount codes
 */
export const deleteDeal = async (
  deletingDeal: Deal | null,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setDeletingDeal: React.Dispatch<React.SetStateAction<Deal | null>>,
  isDeletingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> => {
  if (!deletingDeal || isDeletingDeal.current || !isMountedRef.current) {
    console.log("Cannot delete: No deal selected, already deleting, or component unmounted");
    return;
  }

  isDeletingDeal.current = true;
  
  try {
    console.log(`[dealOperations] Deleting deal with ID: ${deletingDeal.id}`);
    
    // First delete any associated discount codes
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', deletingDeal.id);
      
    if (discountCodesError) {
      console.error('[dealOperations] Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    }
    
    // Then delete the deal itself
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', deletingDeal.id);

    if (error) {
      throw error;
    }
    
    // Update state if component is still mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== deletingDeal.id));
      toast.success("Erbjudandet har tagits bort");
    }
  } catch (error) {
    console.error("[dealOperations] Error deleting deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
  } finally {
    if (isMountedRef.current) {
      isDeletingDeal.current = false;
      setDeletingDeal(null);
    }
  }
};

/**
 * Updates an existing deal
 */
export const updateDeal = async (
  editingDeal: Deal | null,
  values: FormValues,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setEditingDeal: React.Dispatch<React.SetStateAction<Deal | null>>,
  isUpdatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<boolean | void> => {
  if (!editingDeal || isUpdatingDeal.current || !isMountedRef.current) {
    console.error("Cannot update: No deal selected, already updating, or component unmounted");
    return false;
  }

  isUpdatingDeal.current = true;

  try {
    console.log(`[dealOperations] Updating deal ID: ${editingDeal.id} with values:`, values);
    
    // Check if the salon has a basic subscription plan
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan')
      .eq('id', editingDeal.salon_id)
      .single();
    
    if (salonError) {
      console.error("[dealOperations] Error fetching salon information:", salonError);
      toast.error("Kunde inte hämta salongsinformation");
      return false;
    }
    
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    
    // If basic plan, ensure discount codes are not required
    let requiresDiscountCode = values.requires_discount_code;
    if (isBasicPlan) {
      requiresDiscountCode = false;
    }
    
    // Determine if deal is free and handle pricing accordingly
    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPriceVal = parseInt(values.discountedPrice) || 0;
    const isFree = values.is_free || discountedPriceVal === 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    const discountedPrice = isFree ? 1 : discountedPriceVal;
    
    // Build update object
    const updateData = {
      title: values.title,
      description: values.description,
      image_url: values.imageUrl,
      original_price: originalPrice,
      discounted_price: discountedPrice,
      category: values.category,
      city: values.city,
      featured: values.featured,
      is_free: isFree,
      quantity_left: parseInt(values.quantity) || 10,
      booking_url: requiresDiscountCode ? null : values.booking_url,
      requires_discount_code: requiresDiscountCode,
      is_active: values.is_active !== undefined ? values.is_active : true,
      expiration_date: values.expirationDate.toISOString()
    };
    
    // Update the deal in the database
    const { error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', editingDeal.id);

    if (error) {
      console.error("[dealOperations] Database error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    }

    // Update local state if component is mounted
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.map(deal => 
        deal.id === editingDeal.id ? { ...deal, ...updateData } : deal
      ));
      toast.success("Erbjudandet har uppdaterats");
    }
    
    return true;
  } catch (error) {
    console.error("[dealOperations] Error updating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    return false;
  } finally {
    if (isMountedRef.current) {
      isUpdatingDeal.current = false;
    }
  }
};

/**
 * Toggles a deal's active status
 */
export const toggleActive = async (
  deal: Deal,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<void> => {
  try {
    console.log(`[dealOperations] Toggling active status for deal ID: ${deal.id} from ${deal.is_active} to ${!deal.is_active}`);
    
    const { error } = await supabase
      .from('deals')
      .update({ is_active: !deal.is_active })
      .eq('id', deal.id);

    if (error) {
      throw error;
    }

    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.map(d => 
        d.id === deal.id ? { ...d, is_active: !d.is_active } : d
      ));
      
      toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktiverat' : 'inaktiverat'}`);
    }
  } catch (error) {
    console.error('[dealOperations] Error toggling deal active status:', error);
    toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
  }
};

/**
 * Creates a new deal
 */
export const createDeal = async (
  values: FormValues,
  salonId: string,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isCreatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<boolean> => {
  if (isCreatingDeal.current || !isMountedRef.current) {
    console.error("[dealOperations] Already creating a deal or component unmounted");
    return false;
  }

  isCreatingDeal.current = true;

  try {
    console.log(`[dealOperations] Creating new deal for salon ID: ${salonId} with values:`, values);
    
    // Parse salon ID to integer
    const salonIdInt = parseInt(salonId, 10);
    if (isNaN(salonIdInt)) {
      console.error(`[dealOperations] Invalid salon ID: ${salonId}`);
      toast.error("Ogiltig salong-ID");
      return false;
    }
    
    // Check if the salon has a basic subscription plan
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan, status')
      .eq('id', salonIdInt)
      .single();
    
    if (salonError) {
      console.error("[dealOperations] Error fetching salon information:", salonError);
      toast.error("Kunde inte hämta salongsinformation");
      return false;
    }
    
    // First check if subscription is active
    if (salonData?.status !== 'active') {
      console.error("[dealOperations] Salon subscription is not active:", salonData?.status);
      toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
      return false;
    }
    
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    console.log("[dealOperations] Salon plan:", salonData?.subscription_plan, "isBasicPlan:", isBasicPlan);
    
    // Check number of active deals for this salon
    const { data: activeDeals, error: countError } = await supabase
      .from('deals')
      .select('id', { count: 'exact' })
      .eq('salon_id', salonIdInt)
      .eq('is_active', true)
      .not('status', 'eq', 'rejected');
    
    if (countError) {
      console.error('[dealOperations] Error counting active deals:', countError);
      toast.error("Kunde inte kontrollera antal aktiva erbjudanden");
      return false;
    }
    
    const activeDealsCount = activeDeals?.length || 0;
    const maxDealsAllowed = isBasicPlan ? 1 : 3;
    
    console.log("[dealOperations] Active deals count:", activeDealsCount, "Max allowed:", maxDealsAllowed);
    
    if (activeDealsCount >= maxDealsAllowed) {
      toast.error(`Du har redan nått maxgränsen på ${maxDealsAllowed} aktiva erbjudanden för din prenumerationsnivå.`);
      return false;
    }
    
    // If basic plan, ensure discount codes are not required
    let requiresDiscountCode = values.requires_discount_code;
    if (isBasicPlan) {
      console.log("[dealOperations] Basic plan detected, forcing direct booking");
      requiresDiscountCode = false;
    }
    
    // Determine if deal is free and handle pricing accordingly
    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPriceVal = parseInt(values.discountedPrice) || 0;
    const isFree = values.is_free || discountedPriceVal === 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    const discountedPrice = isFree ? 1 : discountedPriceVal;
    
    // Calculate days until expiration for time_remaining
    const now = new Date();
    const expirationDate = new Date(values.expirationDate);
    const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const timeRemaining = `${daysRemaining} dagar`;
    
    // Validation for direct booking URL
    if (!requiresDiscountCode && !values.booking_url) {
      console.error("[dealOperations] Missing booking URL for direct booking");
      toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder.");
      return false;
    }
    
    const newDeal = {
      salon_id: salonIdInt,
      title: values.title,
      description: values.description,
      image_url: values.imageUrl,
      original_price: originalPrice,
      discounted_price: discountedPrice,
      category: values.category,
      city: values.city,
      time_remaining: timeRemaining,
      featured: values.featured,
      is_free: isFree,
      quantity_left: parseInt(values.quantity) || 10,
      booking_url: requiresDiscountCode ? null : values.booking_url,
      requires_discount_code: requiresDiscountCode,
      is_active: values.is_active !== undefined ? values.is_active : true,
      expiration_date: values.expirationDate.toISOString(),
      status: 'pending' as const // Start with pending status for approval flow
    };
    
    console.log("[dealOperations] Inserting new deal with data:", newDeal);
    
    // Insert the new deal into the database
    const { data, error } = await supabase
      .from('deals')
      .insert(newDeal)
      .select()
      .single();

    if (error) {
      console.error("[dealOperations] Database error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas: " + error.message);
      return false;
    }

    // Update local state if component is mounted
    if (isMountedRef.current && data) {
      // Cast the returned data as Deal to ensure type compatibility
      const newDealWithCorrectType = data as unknown as Deal;
      console.log("[dealOperations] Deal created successfully:", newDealWithCorrectType);
      setDeals(prevDeals => [newDealWithCorrectType, ...prevDeals]);
      toast.success("Erbjudandet har skapats och väntar på granskning");
    }
    
    return true;
  } catch (error) {
    console.error("[dealOperations] Error creating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  } finally {
    if (isMountedRef.current) {
      isCreatingDeal.current = false;
    }
  }
};
