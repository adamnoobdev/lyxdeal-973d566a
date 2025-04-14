
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

/**
 * Uppdaterar ett befintligt erbjudande
 */
export const updateDeal = async (values: FormValues, id: number): Promise<boolean> => {
  try {
    console.log("[updateDeal] Starting update for deal ID:", id);
    
    // Hämtar befintligt erbjudande för att kontrollera requires_discount_code
    const { data: existingDeal, error: fetchError } = await supabase
      .from('deals')
      .select('requires_discount_code, salon_id, status')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('[updateDeal] Database error fetching existing deal:', fetchError);
      throw fetchError;
    }
    
    if (!existingDeal) {
      console.error('[updateDeal] Deal not found');
      throw new Error('Deal not found');
    }
    
    // CRITICAL: Fetch salon details to get subscription plan
    // This must happen regardless of how the salon was created
    console.log("[updateDeal] Checking salon plan for ID:", existingDeal.salon_id);
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan')
      .eq('id', existingDeal.salon_id)
      .single();
    
    if (salonError) {
      console.error('[updateDeal] Error fetching salon details:', salonError);
      toast.error("Kunde inte verifiera prenumerationsplan");
      return false;
    }
    
    // IMPORTANT: Treat null/undefined subscription_plan as Baspaket
    // This is critically important for admin-created salons that might not have the field set
    const isBasicPlan = !salonData?.subscription_plan || salonData?.subscription_plan === 'Baspaket';
    console.log('[updateDeal] Salon plan:', salonData?.subscription_plan, 'isBasicPlan:', isBasicPlan);
    
    // CRITICAL: For basic plan, FORCE requires_discount_code to false
    if (isBasicPlan) {
      console.log('[updateDeal] Basic plan detected, forcing discount code to false');
      values.requires_discount_code = false;
    }
    
    // If existing deal has requires_discount_code=true, se till att vi inte ändrar det till false
    let requiresDiscountCode = values.requires_discount_code;
    
    if (existingDeal.requires_discount_code === true && !requiresDiscountCode) {
      console.warn('[updateDeal] Attempt to change requires_discount_code from true to false prevented');
      toast.warning("Ett erbjudande som använder rabattkoder kan inte ändras till att inte använda dem.");
      requiresDiscountCode = true;
    }
    
    // Double-check after applying rules to make sure basic plan users can't use discount codes
    if (isBasicPlan && requiresDiscountCode === true) {
      console.error('[updateDeal] Basic plan attempting to use discount codes after verification');
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // Parse price values
    const originalPrice = parseInt(values.originalPrice) || 0;
    let discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    // but keep is_free flag as true
    if (isFree) {
      discountedPrice = 1;
    }
    
    // Validate that booking URL is provided when discount codes are not required
    if (!requiresDiscountCode && !values.booking_url) {
      toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder.");
      return false;
    }
    
    // Calculate days remaining and time remaining text
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    console.log('[updateDeal] Updating deal with values:', {
      ...values,
      originalPrice,
      discountedPrice,
      expirationDate: expirationDate,
      booking_url: values.booking_url,
      requires_discount_code: requiresDiscountCode,
      isBasicPlan: isBasicPlan // Log this for debugging
    });
    
    // Final safety check before DB update
    if (isBasicPlan && requiresDiscountCode === true) {
      console.error('[updateDeal] CRITICAL ERROR: Basic plan attempting to use discount codes in final check');
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // Om erbjudandet tidigare var avslaget och nu uppdateras av salongägaren, ändra status till pending och rensa rejection_message
    const dealStatus = values.status || (existingDeal.status === 'rejected' ? 'pending' : existingDeal.status);
    const rejectionMessage = dealStatus === 'pending' ? null : undefined; // Sätt till null bara om vi ändrar status till pending
    
    // Update the deal with all information
    const { error } = await supabase
      .from('deals')
      .update({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice, // Set to 1 for free deals
        category: values.category,
        city: values.city,
        time_remaining: timeRemaining,
        expiration_date: expirationDate.toISOString(),
        featured: values.featured,
        salon_id: values.salon_id,
        is_active: values.is_active,
        quantity_left: parseInt(values.quantity || '10'),
        is_free: isFree, // Set is_free based on original discounted price
        status: dealStatus, // Använd dealStatus som kan ha ändrats
        booking_url: values.booking_url || null, // Lägg till bokningslänk
        requires_discount_code: requiresDiscountCode,
        rejection_message: rejectionMessage // Rensa rejection_message om vi ändrar status
      })
      .eq('id', id);

    if (error) {
      console.error('[updateDeal] Database error during update:', error);
      throw error;
    }
    
    toast.success("Erbjudandet har uppdaterats");
    return true;
  } catch (error) {
    console.error('[updateDeal] Error updating deal:', error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    return false;
  }
};
