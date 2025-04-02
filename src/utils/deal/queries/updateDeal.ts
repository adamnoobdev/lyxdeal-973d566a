
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

/**
 * Uppdaterar ett befintligt erbjudande
 */
export const updateDeal = async (values: FormValues, id: number): Promise<boolean> => {
  try {
    // Hämtar befintligt erbjudande för att kontrollera requires_discount_code
    const { data: existingDeal, error: fetchError } = await supabase
      .from('deals')
      .select('requires_discount_code')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Database error fetching existing deal:', fetchError);
      throw fetchError;
    }
    
    if (!existingDeal) {
      console.error('Deal not found');
      throw new Error('Deal not found');
    }
    
    // Om befintligt erbjudande har requires_discount_code=true, se till att vi inte ändrar det till false
    let requiresDiscountCode = values.requires_discount_code ?? true;
    
    if (existingDeal.requires_discount_code === true && !requiresDiscountCode) {
      console.warn('Attempt to change requires_discount_code from true to false prevented');
      toast.warning("Ett erbjudande som använder rabattkoder kan inte ändras till att inte använda dem.");
      requiresDiscountCode = true;
    }
    
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
    
    console.log('Updating deal with values:', {
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
      console.error('Database error during update:', error);
      throw error;
    }
    
    toast.success("Erbjudandet har uppdaterats");
    return true;
  } catch (error) {
    console.error('Error updating deal:', error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    return false;
  }
};
