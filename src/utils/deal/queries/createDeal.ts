
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";

/**
 * Skapar ett nytt erbjudande
 */
export const createDeal = async (values: FormValues): Promise<boolean> => {
  try {
    const originalPrice = parseInt(values.originalPrice) || 0;
    let discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    
    // Hämta salong för att kontrollera prenumerationsplan
    let requiresDiscountCode = values.requires_discount_code ?? false;
    let subscription_plan = null;
    
    if (values.salon_id) {
      const { data: salonData } = await supabase
        .from('salons')
        .select('subscription_plan')
        .eq('id', values.salon_id)
        .single();
      
      subscription_plan = salonData?.subscription_plan;
      
      // Om basic-paketet, tvinga direkt bokning (inga rabattkoder)
      if (subscription_plan === 'Baspaket') {
        requiresDiscountCode = false;
      }
    }
    
    const quantity = requiresDiscountCode ? parseInt(values.quantity) || 10 : 0;
    
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
    
    console.log('Creating deal with values:', {
      ...values,
      originalPrice,
      discountedPrice,
      isFree,
      expirationDate: expirationDate,
      quantity,
      booking_url: values.booking_url,
      requires_discount_code: requiresDiscountCode
    });
    
    // Create a new deal
    const { data: newDeal, error } = await supabase
      .from('deals')
      .insert([{
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
        status: 'approved', // Direktgodkänd
        is_free: isFree, // Set is_free based on original discounted price
        is_active: values.is_active !== undefined ? values.is_active : true,
        quantity_left: quantity,
        booking_url: values.booking_url || null, // Lägg till bokningslänk
        requires_discount_code: requiresDiscountCode,
      }])
      .select();

    if (error) {
      console.error('Database error details:', error);
      throw error;
    }

    // Om vi fick tillbaka ett ID och erbjudandet kräver rabattkoder, generera rabattkoder
    if (newDeal && newDeal.length > 0 && requiresDiscountCode) {
      const dealId = newDeal[0].id;
      console.log(`Automatically generating ${quantity} discount codes for new deal ID: ${dealId}`);
      
      try {
        // Generera rabattkoder i bakgrunden
        setTimeout(async () => {
          try {
            await generateDiscountCodes(dealId, quantity);
            console.log(`Successfully generated ${quantity} discount codes for deal ID: ${dealId}`);
          } catch (genError) {
            console.error(`Error generating discount codes for deal ID: ${dealId}:`, genError);
          }
        }, 500);
      } catch (genError) {
        console.error('Error starting discount code generation:', genError);
        // Fortsätt utan att blockera eftersom erbjudandet skapades korrekt
      }
    }
    
    toast.success("Erbjudandet har skapats");
    return true;
  } catch (error) {
    console.error('Error creating deal:', error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  }
};
