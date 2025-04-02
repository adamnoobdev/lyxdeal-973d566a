
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";

export const createDeal = async (values: FormValues, salonId: number | undefined): Promise<boolean> => {
  try {
    if (!salonId) {
      toast.error("Kunde inte identifiera salongen.");
      return false;
    }

    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPriceVal = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPriceVal === 0;
    const quantity = parseInt(values.quantity) || 10;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    const discountedPrice = isFree ? 1 : discountedPriceVal;
    
    // Calculate days remaining and time remaining text
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    console.log('Creating salon deal with values:', {
      ...values,
      originalPrice,
      discountedPrice,
      is_free: isFree,
      expirationDate: expirationDate,
      quantity
    });
    
    const { data: newDeal, error } = await supabase.from('deals').insert({
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
      salon_id: salonId,
      status: 'pending',
      is_free: isFree, // Set is_free flag for free deals
      quantity_left: quantity,
      booking_url: values.booking_url,
      requires_discount_code: values.requires_discount_code
    }).select();

    if (error) {
      console.error('Database error details:', error);
      throw error;
    }
    
    // Om erbjudandet skapades, generera rabattkoder automatiskt
    if (newDeal && newDeal.length > 0) {
      const dealId = newDeal[0].id;
      console.log(`Automatically generating ${quantity} discount codes for new salon deal ID: ${dealId}`);
      
      try {
        // Generera rabattkoder i bakgrunden
        setTimeout(async () => {
          try {
            await generateDiscountCodes(dealId, quantity);
            console.log(`Successfully generated ${quantity} discount codes for salon deal ID: ${dealId}`);
          } catch (genError) {
            console.error(`Error generating discount codes for salon deal ID: ${dealId}:`, genError);
          }
        }, 500);
      } catch (genError) {
        console.error('Error starting discount code generation:', genError);
        // Fortsätt utan att blockera eftersom erbjudandet skapades korrekt
      }
    }
    
    toast.success("Erbjudande skapat! Det kommer att granskas av en administratör innan det publiceras.");
    return true;
  } catch (error) {
    console.error("Error creating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas.");
    return false;
  }
};
