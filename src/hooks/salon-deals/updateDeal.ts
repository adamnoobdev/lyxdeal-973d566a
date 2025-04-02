
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

export const updateDeal = async (values: FormValues, dealId: number): Promise<boolean> => {
  try {
    // Hämta befintligt erbjudande för att kontrollera krav på rabattkoder
    const { data: existingDeal, error: fetchError } = await supabase
      .from('deals')
      .select('requires_discount_code, salon_id')
      .eq('id', dealId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching existing deal:', fetchError);
      throw fetchError;
    }
    
    if (!existingDeal) {
      toast.error("Erbjudandet kunde inte hittas.");
      return false;
    }
    
    // Kontrollera salongens prenumerationsplan
    const { data: salonData } = await supabase
      .from('salons')
      .select('subscription_plan')
      .eq('id', existingDeal.salon_id)
      .single();
    
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    
    // Hantera rabattkoder baserat på plan och befintligt värde
    let requiresDiscountCode = values.requires_discount_code ?? false;
    
    // Om basic-paketet, tvinga direkt bokning
    if (isBasicPlan) {
      requiresDiscountCode = false;
    }
    
    // Förhindra ändring från rabattkoder till direkt bokning
    if (existingDeal.requires_discount_code === true && !requiresDiscountCode) {
      toast.warning("Ett erbjudande som använder rabattkoder kan inte ändras till att inte använda dem.");
      requiresDiscountCode = true;
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
      requires_discount_code: requiresDiscountCode
    });
    
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
        status: 'pending',
        is_free: isFree, // Set is_free flag for free deals
        quantity_left: parseInt(values.quantity) || 10,
        booking_url: values.booking_url,
        requires_discount_code: requiresDiscountCode
      })
      .eq('id', dealId);

    if (error) {
      console.error('Database error details:', error);
      throw error;
    }
    
    toast.success("Erbjudande uppdaterat! Det kommer att granskas igen av en administratör.");
    return true;
  } catch (error) {
    console.error("Error updating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras.");
    return false;
  }
};
