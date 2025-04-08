import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { Deal } from "@/components/admin/types";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";

/**
 * Uppdaterar ett erbjudande
 */
export const updateDeal = async (
  editingDeal: Deal | null,
  values: FormValues,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setEditingDeal: React.Dispatch<React.SetStateAction<Deal | null>>,
  isUpdatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<boolean> => {
  if (!editingDeal || isUpdatingDeal.current) return false;
  
  try {
    isUpdatingDeal.current = true;
    console.log("[updateDeal] Updating deal ID:", editingDeal.id, "with values:", values);

    const originalPrice = parseInt(values.originalPrice);
    let discountedPrice = parseInt(values.discountedPrice);
    
    // If is_free is true, set discounted_price to 1 in database
    // but maintain the is_free flag
    const isFree = discountedPrice === 0;
    if (isFree) {
      discountedPrice = 1; // Set to 1 to avoid database constraints
    }
    
    // Calculate days remaining and time remaining text
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;

    // Update the deal
    const { error } = await supabase
      .from('deals')
      .update({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        category: values.category,
        city: values.city,
        time_remaining: timeRemaining,
        expiration_date: expirationDate.toISOString(),
        featured: values.featured,
        is_free: isFree,
        is_active: values.is_active,
        booking_url: values.booking_url || null,
      })
      .eq('id', editingDeal.id);

    if (error) {
      console.error("[updateDeal] Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    }

    // Update the deals state with the updated deal
    if (isMountedRef.current) {
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === editingDeal.id 
            ? { 
                ...deal, 
                title: values.title,
                description: values.description,
                image_url: values.imageUrl,
                original_price: originalPrice,
                discounted_price: discountedPrice,
                category: values.category,
                city: values.city,
                time_remaining: timeRemaining,
                expiration_date: expirationDate.toISOString(),
                featured: values.featured,
                is_free: isFree,
                is_active: values.is_active,
                booking_url: values.booking_url || null,
              }
            : deal
        )
      );
      
      setEditingDeal(null);
    }

    toast.success("Erbjudandet har uppdaterats");
    return true;
  } catch (error) {
    console.error("[updateDeal] Error in update flow:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    return false;
  } finally {
    isUpdatingDeal.current = false;
  }
};

/**
 * Tar bort ett erbjudande 
 */
export const deleteDeal = async (
  deletingDeal: Deal | null,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setDeletingDeal: React.Dispatch<React.SetStateAction<Deal | null>>,
  isDeletingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  if (!deletingDeal || isDeletingDeal.current) {
    return;
  }

  try {
    isDeletingDeal.current = true;
    console.log("[deleteDeal] Deleting deal ID:", deletingDeal.id);

    // Delete the deal
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', deletingDeal.id);

    if (error) {
      console.error("[deleteDeal] Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
      return;
    }

    // Update the deals state by removing the deleted deal
    if (isMountedRef.current) {
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== deletingDeal.id));
      setDeletingDeal(null);
    }

    toast.success("Erbjudandet har tagits bort");
  } catch (error) {
    console.error("[deleteDeal] Error in delete flow:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
  } finally {
    isDeletingDeal.current = false;
  }
};

/**
 * Togglar ett erbjudandes aktiva status
 */
export const toggleActive = async (
  deal: Deal,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<boolean> => {
  try {
    console.log("[toggleActive] Toggling active state for deal ID:", deal.id, "Current state:", deal.is_active);
    
    // Update the deal's is_active status
    const { error } = await supabase
      .from('deals')
      .update({ is_active: !deal.is_active })
      .eq('id', deal.id);
      
    if (error) {
      console.error("[toggleActive] Error toggling deal active state:", error);
      toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
      return false;
    }
    
    // Update the deals state with the updated active status
    if (isMountedRef.current) {
      setDeals(prevDeals =>
        prevDeals.map(d =>
          d.id === deal.id ? { ...d, is_active: !d.is_active } : d
        )
      );
    }
    
    toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktivt' : 'inaktivt'}`);
    return true;
  } catch (error) {
    console.error("[toggleActive] Error in toggle active flow:", error);
    toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
    return false;
  }
};

/**
 * Skapar ett nytt erbjudande
 */
export const createDeal = async (
  values: FormValues,
  salonIdStr: string | undefined,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  isCreatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<boolean> => {
  if (isCreatingDeal.current) {
    console.log("[createDeal] Already creating a deal, skipping");
    return false;
  }
  
  try {
    isCreatingDeal.current = true;
    console.log("[createDeal] Creating new deal with values:", values);
    
    // Parse all numeric values
    const originalPrice = parseInt(values.originalPrice) || 0;
    let discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    const salonId = values.salon_id || (salonIdStr ? parseInt(salonIdStr) : undefined);
    
    if (!salonId) {
      console.error("[createDeal] No salon ID provided");
      toast.error("Kunde inte identifiera salongen.");
      return false;
    }
    
    console.log("[createDeal] Using salon ID:", salonId);
    
    // Hämta salong för att kontrollera prenumerationsplan
    let requiresDiscountCode = values.requires_discount_code ?? false;
    let subscription_plan = null;
    
    try {
      const { data: salonData } = await supabase
        .from('salons')
        .select('subscription_plan')
        .eq('id', salonId)
        .single();
      
      subscription_plan = salonData?.subscription_plan;
      console.log("[createDeal] Salon subscription plan:", subscription_plan);
      
      // Om basic-paketet, tvinga direkt bokning (inga rabattkoder)
      if (subscription_plan === 'Baspaket') {
        requiresDiscountCode = false;
        console.log("[createDeal] Basic plan detected, forcing direct booking");
      }
    } catch (error) {
      console.error("[createDeal] Error fetching salon subscription plan:", error);
    }
    
    const quantity = requiresDiscountCode ? parseInt(values.quantity) || 10 : 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    // but keep is_free flag as true
    if (isFree) {
      discountedPrice = 1;
    }
    
    // Validate that booking URL is provided when discount codes are not required
    if (!requiresDiscountCode && !values.booking_url) {
      console.error("[createDeal] Booking URL is required when discount codes are not used");
      toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder.");
      return false;
    }
    
    // Calculate days remaining and time remaining text
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    console.log('[createDeal] Prepared deal data:', {
      ...values,
      originalPrice,
      discountedPrice,
      isFree,
      expirationDate: expirationDate.toISOString(),
      quantity,
      timeRemaining,
      requiresDiscountCode,
      salonId
    });
    
    // Create a new deal
    const { data: newDealData, error } = await supabase
      .from('deals')
      .insert({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice, // Set to 1 for free deals
        category: values.category,
        city: values.city,
        time_remaining: timeRemaining,
        expiration_date: expirationDate.toISOString(),
        featured: values.featured ?? false,
        salon_id: salonId,
        status: 'approved' as "pending" | "approved" | "rejected", // Direktgodkänd
        is_free: isFree, // Set is_free based on original discounted price
        is_active: values.is_active !== undefined ? values.is_active : true,
        quantity_left: quantity,
        booking_url: values.booking_url || null, // Lägg till bokningslänk
        requires_discount_code: requiresDiscountCode,
      })
      .select();

    if (error) {
      console.error('[createDeal] Database error details:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
      return false;
    }

    if (!newDealData || newDealData.length === 0) {
      console.error("[createDeal] No deal data returned from insertion");
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
      return false;
    }

    const newDeal = newDealData[0] as Deal;
    console.log("[createDeal] Deal created successfully with ID:", newDeal.id);

    // Om vi fick tillbaka ett ID och erbjudandet kräver rabattkoder, generera rabattkoder
    if (requiresDiscountCode) {
      const dealId = newDeal.id;
      console.log(`[createDeal] Automatically generating ${quantity} discount codes for new deal ID: ${dealId}`);
      
      try {
        // Generera rabattkoder i bakgrunden
        setTimeout(async () => {
          try {
            await generateDiscountCodes(dealId, quantity);
            console.log(`[createDeal] Successfully generated ${quantity} discount codes for deal ID: ${dealId}`);
          } catch (genError) {
            console.error(`[createDeal] Error generating discount codes for deal ID: ${dealId}:`, genError);
          }
        }, 500);
      } catch (genError) {
        console.error('[createDeal] Error starting discount code generation:', genError);
        // Fortsätt utan att blockera eftersom erbjudandet skapades korrekt
      }
    }

    // Update local state with the new deal
    if (isMountedRef.current) {
      setDeals(prevDeals => [...prevDeals, newDeal]);
    }
    
    toast.success("Erbjudandet har skapats");
    return true;
  } catch (error) {
    console.error('[createDeal] Error creating deal:', error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  } finally {
    isCreatingDeal.current = false;
  }
};
