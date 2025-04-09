
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

export const updateDeal = async (values: FormValues, dealId: number): Promise<boolean> => {
  try {
    // Hämta befintligt erbjudande för att kontrollera krav på rabattkoder
    const { data: existingDeal, error: fetchError } = await supabase
      .from('deals')
      .select('requires_discount_code, salon_id, status')
      .eq('id', dealId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching existing deal:', fetchError);
      toast.error("Kunde inte hitta erbjudandet.");
      return false;
    }
    
    if (!existingDeal) {
      toast.error("Erbjudandet kunde inte hittas.");
      return false;
    }
    
    // CRITICAL: Kontrollera salongens prenumerationsplan
    // Detta måste göras oavsett hur salongen skapades (av admin eller via betalning)
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan')
      .eq('id', existingDeal.salon_id)
      .single();
    
    if (salonError) {
      console.error('Error fetching salon data:', salonError);
      toast.error("Kunde inte hämta salonginformation.");
      return false;
    }
    
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    console.log("Salon subscription plan:", salonData?.subscription_plan, "isBasicPlan:", isBasicPlan);
    
    // Hantera rabattkoder baserat på plan och befintligt värde
    let requiresDiscountCode = values.requires_discount_code ?? false;
    
    // CRITICAL: Om basic-paketet, tvinga direkt bokning (ingen rabattkod)
    // Detta är viktigt för admin-skapade salonger eller salonger via betalning
    if (isBasicPlan) {
      console.log("Basic plan detected. Forcing direct booking.");
      requiresDiscountCode = false;
    }
    
    // Förhindra ändring från rabattkoder till direkt bokning
    if (existingDeal.requires_discount_code === true && !requiresDiscountCode) {
      toast.warning("Ett erbjudande som använder rabattkoder kan inte ändras till att inte använda dem.");
      requiresDiscountCode = true;
    }
    
    // Double-check after applying rules to make sure basic plan users can't use discount codes
    if (isBasicPlan && requiresDiscountCode === true) {
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }

    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPriceVal = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPriceVal === 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    const discountedPrice = isFree ? 1 : discountedPriceVal;
    
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
    
    console.log('Updating salon deal with values:', {
      ...values,
      originalPrice,
      discountedPrice,
      is_free: isFree,
      expirationDate: expirationDate,
      requires_discount_code: requiresDiscountCode,
      salonPlan: salonData?.subscription_plan,
      isBasicPlan
    });
    
    // Final safety check before DB update
    if (isBasicPlan && requiresDiscountCode === true) {
      console.error('CRITICAL ERROR: Basic plan attempting to use discount codes in final check');
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // Always set status to pending for review after updates
    const newStatus = existingDeal.status === 'rejected' ? 'pending' : existingDeal.status;
    
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
        status: newStatus,
        is_free: isFree, // Set is_free flag for free deals
        quantity_left: parseInt(values.quantity) || 10,
        booking_url: values.booking_url || null,
        requires_discount_code: requiresDiscountCode,
        is_active: values.is_active !== undefined ? values.is_active : true,
      })
      .eq('id', dealId);

    if (error) {
      console.error('Database error details:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras: " + error.message);
      return false;
    }
    
    const statusMessage = newStatus === 'pending' ? 
      "Erbjudande uppdaterat! Det kommer att granskas igen av en administratör." :
      "Erbjudande uppdaterat!";
    
    toast.success(statusMessage);
    return true;
  } catch (error) {
    console.error("Error updating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras.");
    return false;
  }
};
