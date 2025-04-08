import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { FormValues } from '@/components/deal-form/schema';
import { createStripeProductForDeal } from "@/utils/stripeUtils";

// Handle deleting a deal
export const deleteDeal = async (
  deletingDeal: Deal | null,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setDeletingDeal: (deal: Deal | null) => void,
  isDeletingDeal: { current: boolean },
  isMountedRef: { current: boolean }
): Promise<void> => {
  if (!deletingDeal || isDeletingDeal.current) {
    console.log("[dealOperations] No deal to delete or already deleting");
    return;
  }

  isDeletingDeal.current = true;
  
  try {
    console.log(`[dealOperations] Deleting deal: ${deletingDeal.id}`);
    
    // First delete any associated discount codes
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', deletingDeal.id);
      
    if (discountCodesError) {
      console.error('[dealOperations] Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    }
    
    // Now delete the deal itself
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', deletingDeal.id);

    if (error) throw error;
    
    if (isMountedRef.current) {
      setDeals((prevDeals: Deal[]) => 
        prevDeals.filter(deal => deal.id !== deletingDeal.id)
      );
      setDeletingDeal(null);
      toast.success("Erbjudande borttaget");
    }
  } catch (error) {
    console.error("[dealOperations] Error in delete operation:", error);
    toast.error("Kunde inte ta bort erbjudandet");
  } finally {
    isDeletingDeal.current = false;
  }
};

// Handle updating a deal
export const updateDeal = async (
  editingDeal: Deal | null,
  values: FormValues,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setEditingDeal: (deal: Deal | null) => void,
  isUpdatingDeal: { current: boolean },
  isMountedRef: { current: boolean }
): Promise<boolean> => {
  if (!editingDeal || isUpdatingDeal.current) {
    console.log("[dealOperations] No deal to update or already updating");
    return false;
  }

  isUpdatingDeal.current = true;
  
  try {
    console.log(`[dealOperations] Updating deal: ${editingDeal.id}`);
    
    // Derive is_free field from discountedPrice
    const discountedPrice = parseFloat(values.discountedPrice);
    const is_free = discountedPrice === 0;
    
    // Prepare data for updating
    const updatedData = {
      title: values.title,
      description: values.description,
      original_price: parseFloat(values.originalPrice),
      discounted_price: discountedPrice,
      category: values.category,
      city: values.city,
      image_url: values.imageUrl,
      featured: values.featured,
      is_free: is_free,
      is_active: values.is_active,
      expiration_date: values.expirationDate.toISOString(), // Convert Date to ISO string
      requires_discount_code: values.requires_discount_code,
      booking_url: values.booking_url || null,
      updated_at: new Date().toISOString()
    };
    
    // Update the deal in the database
    const { data, error } = await supabase
      .from('deals')
      .update(updatedData)
      .eq('id', editingDeal.id)
      .select();
      
    if (error) throw error;
    
    // Try to update Stripe product if required, but don't fail if it doesn't work
    try {
      await createStripeProductForDeal(values);
    } catch (stripeError) {
      console.error("[dealOperations] Error updating Stripe product:", stripeError);
      // Continue despite Stripe error
    }
    
    if (isMountedRef.current && data) {
      // Update the local state
      setDeals((prevDeals: Deal[]) => 
        prevDeals.map(deal => 
          deal.id === editingDeal.id ? { ...deal, ...updatedData } as Deal : deal
        )
      );
      setEditingDeal(null);
      toast.success("Erbjudandet har uppdaterats");
    }
    
    return true;
  } catch (error) {
    console.error("[dealOperations] Error in update operation:", error);
    toast.error("Kunde inte uppdatera erbjudandet");
    return false;
  } finally {
    isUpdatingDeal.current = false;
  }
};

// Handle toggling deal active status
export const toggleActive = async (
  deal: Deal,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isMountedRef: { current: boolean }
): Promise<void> => {
  try {
    console.log(`[dealOperations] Toggling deal active status: ${deal.id}`);
    
    const { data, error } = await supabase
      .from('deals')
      .update({ is_active: !deal.is_active })
      .eq('id', deal.id)
      .select();
      
    if (error) throw error;
    
    if (isMountedRef.current) {
      // Update the local state
      setDeals((prevDeals: Deal[]) => 
        prevDeals.map(d => 
          d.id === deal.id ? { ...d, is_active: !d.is_active } as Deal : d
        )
      );
      
      toast.success(
        deal.is_active 
          ? "Erbjudandet har inaktiverats"
          : "Erbjudandet har aktiverats"
      );
    }
  } catch (error) {
    console.error("[dealOperations] Error toggling deal active state:", error);
    toast.error("Kunde inte ändra erbjudandets status");
  }
};

// Create deal function - fixed to properly handle numeric salon_id
export const createDeal = async (
  values: FormValues,
  salonId: string | undefined,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isCreatingDeal: { current: boolean },
  isMountedRef: { current: boolean }
): Promise<boolean> => {
  if (!salonId || isCreatingDeal.current) {
    console.error("[dealOperations] No salon ID or already creating deal", { salonId });
    toast.error("Kunde inte identifiera salongen. Försök igen.");
    return false;
  }

  isCreatingDeal.current = true;
  
  try {
    console.log(`[dealOperations] Creating new deal for salon: ${salonId}`);
    
    // Convert salon_id from string to number
    const salon_id = parseInt(salonId, 10);
    
    if (isNaN(salon_id)) {
      console.error("[dealOperations] Invalid salon ID format:", salonId);
      toast.error("Kunde inte identifiera salongen");
      return false;
    }
    
    // Check salon subscription before creating deal
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan, status')
      .eq('id', salon_id)
      .single();
    
    if (salonError) {
      console.error("[dealOperations] Error fetching salon data:", salonError);
      toast.error("Kunde inte hämta salonginformation");
      return false;
    }
    
    console.log("[dealOperations] Salon data:", salonData);
    
    // Verify that subscription is active
    if (salonData?.status !== 'active') {
      console.log("[dealOperations] Salon subscription not active:", salonData?.status);
      toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
      return false;
    }
    
    // Derive is_free field from discountedPrice
    const discountedPrice = parseFloat(values.discountedPrice);
    const is_free = discountedPrice === 0;
    
    // For basic plan, force direct booking (no discount codes)
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    const requiresDiscountCode = isBasicPlan ? false : (values.requires_discount_code !== undefined ? values.requires_discount_code : true);
    
    // Validate direct booking URL if needed
    if (!requiresDiscountCode && !values.booking_url) {
      console.log("[dealOperations] Missing booking URL for direct booking");
      toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder");
      return false;
    }
    
    // Calculate quantity for discount codes
    const quantity = requiresDiscountCode ? parseInt(values.quantity || "10", 10) : 0;
    
    // Prepare data for creating
    const dealData = {
      title: values.title,
      description: values.description,
      original_price: parseFloat(values.originalPrice),
      discounted_price: is_free ? 1 : discountedPrice,
      category: values.category,
      city: values.city,
      image_url: values.imageUrl,
      featured: values.featured,
      is_free: is_free,
      is_active: values.is_active !== undefined ? values.is_active : true,
      expiration_date: values.expirationDate.toISOString(),
      requires_discount_code: requiresDiscountCode,
      booking_url: values.booking_url || null,
      salon_id: salon_id,
      status: "pending",  // Deals start as pending and require admin approval
      quantity_left: quantity,
      time_remaining: "72 timmar" // Default time remaining text
    };
    
    console.log("[dealOperations] Creating deal with data:", dealData);
    
    // Create the deal in the database
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select();
      
    if (error) {
      console.error("[dealOperations] Error creating deal:", error);
      throw error;
    }
    
    // Generate discount codes if needed (handled separately via existing functionality)
    
    // Try to create Stripe product if required
    try {
      await createStripeProductForDeal({
        ...values,
        salon_id: salon_id
      });
    } catch (stripeError) {
      console.error("[dealOperations] Error creating Stripe product:", stripeError);
      // Continue despite Stripe error
    }
    
    if (isMountedRef.current && data) {
      // Update the local state
      setDeals((prevDeals: Deal[]) => [data[0] as Deal, ...prevDeals]);
      toast.success("Nytt erbjudande har skapats och skickats för godkännande");
    }
    
    return true;
  } catch (error) {
    console.error("[dealOperations] Error in create operation:", error);
    toast.error("Kunde inte skapa erbjudandet: " + (error instanceof Error ? error.message : "Okänt fel"));
    return false;
  } finally {
    isCreatingDeal.current = false;
  }
};
