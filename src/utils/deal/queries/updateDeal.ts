
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
      .select('requires_discount_code, salon_id')
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
    
    // Fetch salon details to get subscription plan
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
    
    // Check if this is a basic plan - CRITICALLY IMPORTANT for admin-created salons
    const isBasicPlan = salonData.subscription_plan === 'Baspaket';
    
    // For basic plan, force requires_discount_code to false
    if (isBasicPlan) {
      console.log('[updateDeal] Basic plan detected, forcing discount code to false');
      values.requires_discount_code = false;
    }
    
    // If basic plan is trying to use discount codes despite our restrictions, block the update
    if (isBasicPlan && values.requires_discount_code === true) {
      console.error('[updateDeal] Basic plan attempting to use discount codes');
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // If existing deal has requires_discount_code=true, see till att vi inte ändrar det till false
    let requiresDiscountCode = values.requires_discount_code;
    
    if (existingDeal.requires_discount_code === true && !requiresDiscountCode) {
      console.warn('[updateDeal] Attempt to change requires_discount_code from true to false prevented');
      toast.warning("Ett erbjudande som använder rabattkoder kan inte ändras till att inte använda dem.");
      requiresDiscountCode = true;
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
      requires_discount_code: requiresDiscountCode
    });
    
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
        quantity_left: parseInt(values.quantity) || 10,
        is_free: isFree, // Set is_free based on original discounted price
        status: 'approved', // Always approve deals,
        booking_url: values.booking_url || null, // Lägg till bokningslänk
        requires_discount_code: requiresDiscountCode,
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
