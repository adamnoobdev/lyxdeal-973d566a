import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { FormValues } from "@/components/deal-form/schema";
import { generateDiscountCodes } from "@/utils/discount-codes";

/**
 * Tar bort ett erbjudande från databasen
 */
export const deleteDeal = async (id: number): Promise<boolean> => {
  try {
    // Först tar vi bort alla rabattkoder kopplade till erbjudandet
    console.log(`Removing discount codes for deal ID: ${id}`);
    const { error: discountCodesError } = await supabase
      .from('discount_codes')
      .delete()
      .eq('deal_id', id);
      
    if (discountCodesError) {
      console.error('Error deleting discount codes:', discountCodesError);
      // Continue with deal deletion even if code deletion fails
    } else {
      console.log(`Successfully removed discount codes for deal ID: ${id}`);
    }

    // Sedan tar vi bort själva erbjudandet
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
    
    toast.success("Erbjudandet har tagits bort");
    return true;
  } catch (error) {
    console.error('Error deleting deal:', error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    return false;
  }
};

/**
 * Uppdaterar ett befintligt erbjudande
 */
export const updateDeal = async (values: FormValues, id: number): Promise<boolean> => {
  try {
    const originalPrice = parseInt(values.originalPrice) || 0;
    let discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    // but keep is_free flag as true
    if (isFree) {
      discountedPrice = 1;
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
      booking_url: values.booking_url
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

/**
 * Skapar ett nytt erbjudande
 */
export const createDeal = async (values: FormValues): Promise<boolean> => {
  try {
    const originalPrice = parseInt(values.originalPrice) || 0;
    let discountedPrice = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPrice === 0;
    const quantity = parseInt(values.quantity) || 10;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    // but keep is_free flag as true
    if (isFree) {
      discountedPrice = 1;
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
      booking_url: values.booking_url
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
      }])
      .select();

    if (error) {
      console.error('Database error details:', error);
      throw error;
    }

    // Om vi fick tillbaka ett ID, generera rabattkoder
    if (newDeal && newDeal.length > 0) {
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

/**
 * Växlar aktiv/inaktiv status för ett erbjudande
 */
export const toggleDealActive = async (deal: Deal): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deals')
      .update({ is_active: !deal.is_active })
      .eq('id', deal.id);

    if (error) throw error;
    
    toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktiverat' : 'inaktiverat'}`);
    return true;
  } catch (error) {
    console.error('Error toggling deal active status:', error);
    toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
    return false;
  }
};
